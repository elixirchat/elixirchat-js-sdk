import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/ru';
import AutoLinkText from 'react-autolink-text2';
import {_findIndex, _get, _last, _round, isWebImage, logEvent, randomDigitStringId} from '../../utilsCommon';
import {
  getHumanReadableFileSize,
  inflectDayJSWeekDays,
  playNotificationSound,
  unlockNotificationSoundAutoplay,
  scrollToElement,
} from '../../utilsWidget';
import { getScreenshotCompatibilityFallback } from '../../sdk/ScreenshotTaker';
import { ElixirChatWidget } from '../ElixirChatWidget';
import {
  IMAGE_PREVIEW_OPEN,
  REPLY_MESSAGE,
  TEXTAREA_VERTICAL_RESIZE,
  WIDGET_IFRAME_READY, WIDGET_POPUP_OPEN, WIDGET_POPUP_TOGGLE,
} from '../ElixirChatWidgetEventTypes';
import {
  JOIN_ROOM_ERROR,
  MESSAGES_SUBSCRIBE_ERROR,
  MESSAGES_FETCH_HISTORY_INITIAL_ERROR,
  MESSAGES_HISTORY_SET,
  MESSAGES_HISTORY_APPEND_ONE,
  MESSAGES_HISTORY_PREPEND_MANY,
  MESSAGES_HISTORY_CHANGE_MANY,
  MESSAGES_HISTORY_CHANGE_ONE,
  JOIN_ROOM_SUCCESS,
} from '../../sdk/ElixirChatEventTypes';

export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: ElixirChatWidget;
  messages: Array<any>;
}

export interface IDefaultWidgetMessagesState {
  messages: Array<any>;
}

export class ChatMessages extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  state = {
    isPopupOpen: false,
    isLoading: true,
    isLoadingError: false,
    isLoadingPrecedingMessageHistory: false,
    hasMessagesScrollEverBeenVisible: false,
    processedMessages: [],
    imagePreviews: [],
    screenshotFallback: null,
    highlightedMessageIds: [],
  };

  scrollBlock: { current: HTMLElement } = React.createRef();
  scrollBlockInner: { current: HTMLElement } = React.createRef();

  maxThumbnailSize: number = 256;
  messageChunkSize: number = 20;
  messageRefs: object = {};
  currentlyVisibleMessageIds: object = {};
  alreadyMarkedReadMessageIds: object = {};

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    dayjs.locale('ru');
    dayjs.extend(dayjsCalendar);

    this.setState({
      screenshotFallback: getScreenshotCompatibilityFallback(),
    });

    elixirChatWidget.on(JOIN_ROOM_SUCCESS, () => {
      elixirChatWidget.fetchMessageHistory(this.messageChunkSize);
    });

    elixirChatWidget.on(WIDGET_IFRAME_READY, () => {
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('click', unlockNotificationSoundAutoplay);
      this.setState({ isPopupOpen: elixirChatWidget.isWidgetPopupOpen });
    });

    elixirChatWidget.on(WIDGET_POPUP_TOGGLE, (isPopupOpen) => {
      this.setState({ isPopupOpen });
      if (isPopupOpen) {
        this.fff();
      }
    });

    elixirChatWidget.on(WIDGET_POPUP_OPEN, () => {
      if (!this.state.hasMessagesScrollEverBeenVisible && elixirChatWidget.hasMessageHistoryBeenEverFetched) {
        this.setState({ hasMessagesScrollEverBeenVisible: true });
        this.scrollToBottom();


        const lastReadMessage = _last(this.state.processedMessages.filter(message => !message.isUnread)) || this.state.processedMessages[0];
        const lastReadMessageRef = this.messageRefs[lastReadMessage.id] || {};
        window.__lastReadMessageRef = lastReadMessageRef;

        console.warn('__ NADA SCROLL 1', {
          lastReadMessage,
          lastReadMessageRef,
        });

        requestAnimationFrame(() => {
          scrollToElement(lastReadMessageRef.current, { isSmooth: true, position: 'start' });
        });
      }
    });



    elixirChatWidget.on(MESSAGES_HISTORY_APPEND_ONE, this.onMessageReceive);
    elixirChatWidget.on(MESSAGES_HISTORY_SET, messages => {
      this.setProcessedMessages(messages);
      this.setState({ isLoading: false });
      if (elixirChatWidget.isWidgetPopupOpen) {
        this.setState({ hasMessagesScrollEverBeenVisible: true });
        this.scrollToBottom();

        const lastReadMessage = _last(this.state.processedMessages.filter(message => !message.isUnread)) || this.state.processedMessages[0];
        const lastReadMessageRef = this.messageRefs[lastReadMessage.id] || {};
        window.__lastReadMessageRef = lastReadMessageRef;

        console.warn('__ NADA SCROLL 2', {
          lastReadMessage,
          lastReadMessageRef,
        });

        requestAnimationFrame(() => {
          scrollToElement(lastReadMessageRef.current, { isSmooth: true, position: 'start' });
        });
      }
    });

    elixirChatWidget.on(MESSAGES_HISTORY_PREPEND_MANY, messages => {
      this.setProcessedMessages(messages, { insertBefore: true });
    });
    elixirChatWidget.on(MESSAGES_HISTORY_CHANGE_ONE, (changedMessage, messageHistory) => {
      this.setProcessedMessages(messageHistory);
    });
    elixirChatWidget.on(MESSAGES_HISTORY_CHANGE_MANY, messages => {
      this.setProcessedMessages(messages);
    });
    elixirChatWidget.on([JOIN_ROOM_ERROR, MESSAGES_SUBSCRIBE_ERROR, MESSAGES_FETCH_HISTORY_INITIAL_ERROR], () => {
      this.setState({ isLoading: false, isLoadingError: true });
    });
    elixirChatWidget.on(TEXTAREA_VERTICAL_RESIZE, textareaHeight => {
      const hasUserScroll = this.hasUserScroll();
      this.scrollBlock.current.style.bottom = textareaHeight + 'px';
      if (!hasUserScroll) {
        this.scrollToBottom();
      }
    });

    window.__this = this;
  }

  componentDidUpdate(prevProps, prevState){
    const { processedMessages, hasMessagesScrollEverBeenVisible } = this.state;
    const { elixirChatWidget } = this.props;

    const currentLastMessageId = _get(_last(processedMessages), 'id');
    const previousLastMessageId = _get(_last(prevState.processedMessages), 'id');

    const currentFirstMessageId = _get(processedMessages, '[0].id');
    const previousFirstMessageId = _get(prevState.processedMessages, '[0].id');

    const messagesDidRerender =
      (prevState.processedMessages.length !== processedMessages.length) &&
      (currentLastMessageId !== previousLastMessageId || currentFirstMessageId !== previousFirstMessageId);

    // const case1 = messagesDidRerender && hasMessagesScrollEverBeenVisible;
    // const case2 = hasMessagesScrollEverBeenVisible && !prevState.hasMessagesScrollEverBeenVisible;
    //
    // if ( (case1 || case2) &&  elixirChatWidget.isWidgetPopupOpen) {
    //   console.error('__ INIT WATCH', { case1, case2 });
    //   this.onMessageBeingScrolledToAndViewed(viewedMessageId => {
    //     this.messageRefs[viewedMessageId].current.style.border = `4px solid #${randomDigitStringId(6)}`;
    //     console.log('%c__ MARK READ 3', 'color: green', viewedMessageId);
    //   });
    // }

    if (messagesDidRerender) {
      this.fff();
    }

  };

  fff = () => {

    const { elixirChatWidget } = this.props;

    let ids = [];
    let timeout;
    let hasTimeout = false;

    requestAnimationFrame(() => {
      console.log('%c INIT', 'color: green');
      this.onMessageBeingScrolledToAndViewed(viewedMessageId => {

        ids.push(viewedMessageId);

        if (!hasTimeout) {
          hasTimeout = true;
          timeout = setTimeout(() => {

            const msgs = ids.map(id => this.messageRefs[id]).sort((a,b) => {
              const aTime = +new Date(a.timestamp);
              const bTime = +new Date(b.timestamp);
              return aTime < bTime ? -1 : 1;
            });

            const color = randomDigitStringId(6);
            msgs.forEach(msg => {
              msg.current.style.border = `4px solid #${color}`;
            });
            console.log(`%cMARK READ ${msgs.length} messages`, 'color: green', { msgs, LATEST: _last(msgs) });
            window.__msgs = msgs;

            elixirChatWidget.setLastReadMessage(_last(msgs).id);


            hasTimeout = false;
            ids = [];


          }, 1000);
        }


      });
    });
  };

  onMessageBeingScrolledToAndViewed = (callback) => {
    const timeInViewportToMarkMessageRead = 2 * 1000;
    const scrollBlockHeight = this.scrollBlock.current.offsetHeight;
    if (!scrollBlockHeight) {
      console.error('FAIL INIT');
      return;
    }
    const maxConsiderableMessageHeight = scrollBlockHeight / 2;

    Object.values(this.messageRefs)
      .filter(ref => {
        if (!ref.isUnread) {
          ref.current.style.opacity = '0.5';
        }
        if (ref.intersectionObserver) {
          console.log('__ has observer');
          ref.current.style.textShadow = '0 2px 2px red';
        }
        return ref.isUnread && !ref.intersectionObserver;
      })
      .forEach(ref => {
        ref.intersectionObserver = new IntersectionObserver(([ entry ]) => {
          const messageElement: HTMLElement = entry.target;
          const messageId = messageElement.dataset.id;
          if (!this.messageRefs[messageId].isUnread) {
            console.error('__ already marked');
            return;
          }
          if (this.alreadyMarkedReadMessageIds[messageId]) {
            return;
          }
          if (entry.isIntersecting) {
            this.currentlyVisibleMessageIds[messageId] = setTimeout(() => {
              this.alreadyMarkedReadMessageIds[messageId] = true;
              callback(messageId);
            }, timeInViewportToMarkMessageRead);
          }
          else {
            clearTimeout(this.currentlyVisibleMessageIds[messageId]);
            delete this.currentlyVisibleMessageIds[messageId];
          }
        }, {
          root: this.scrollBlock.current,
          threshold: Math.min(maxConsiderableMessageHeight / ref.current.offsetHeight, 0.8),
        });

        console.log('--- ', ref.current.offsetHeight);

        ref.intersectionObserver.observe(ref.current);
    });
  };

  onMessageReceive = message => {
    const { elixirChatWidget } = this.props;

    const hasUserScroll = this.hasUserScroll();
    const shouldPlayNotificationSound = !message.sender.isCurrentClient && !elixirChatWidget.isWidgetMuted;
    const shouldScrollMessagesToBottom = elixirChatWidget.isWidgetPopupOpen
      && elixirChatWidget.isWidgetPopupFocused
      && !hasUserScroll;

    console.error('__ shouldScrollMessagesToBottom', {
      shouldScrollMessagesToBottom,
      hasUserScroll,
      o: elixirChatWidget.isWidgetPopupOpen,
      f: elixirChatWidget.isWidgetPopupFocused,
    });

    this.setProcessedMessages([message], { insertAfter: true });

    if (shouldScrollMessagesToBottom) {
      this.scrollToBottom();
    }
    if (shouldPlayNotificationSound) {
      playNotificationSound();
    }
  };

  setProcessedMessages = (messages, params = {}) => {
    const { insertBefore, insertAfter } = params;
    const previousProcessedMessages = this.state.processedMessages;
    const previousImagePreviews = this.state.imagePreviews;
    const { processedMessages, imagePreviews } = this.processMessages(
      messages,
      insertAfter ? _last(previousProcessedMessages) : null
    );
    let updatedProcessedMessages;
    let updatedImagePreviews;

    if (insertBefore) {
      updatedProcessedMessages = [...processedMessages, ...previousProcessedMessages];
      updatedImagePreviews = [...imagePreviews, ...previousImagePreviews];
    }
    else if (insertAfter) {
      updatedProcessedMessages = [...previousProcessedMessages, ...processedMessages];
      updatedImagePreviews = [...previousImagePreviews, ...imagePreviews];
    }
    else {
      updatedProcessedMessages = processedMessages;
      updatedImagePreviews = imagePreviews;
    }
    this.setState({
      processedMessages: updatedProcessedMessages,
      imagePreviews: updatedImagePreviews,
    });
  };

  processMessages = (messages, previousMessage) => {
    const { elixirChatWidget } = this.props;

    let imagePreviews = [];
    let processedMessages = messages.map((message, i) => {
      const processedMessage = { ...message };
      const previousMessage = messages[i - 1] || previousMessage;
      const isFirstMessageInChat = !previousMessage && elixirChatWidget.reachedBeginningOfMessageHistory;
      const isNextDayAfterPreviousMessage = previousMessage && dayjs(previousMessage.timestamp)
        .isBefore(dayjs(message.timestamp).startOf('day'));

      if (isNextDayAfterPreviousMessage || isFirstMessageInChat) {
        processedMessage.prependDateTitle = true;
      }
      if (processedMessage.attachments.length) {
        const { files, images } = this.processAttachments(message.attachments, message.sender);
        imagePreviews = imagePreviews.concat(images);
        processedMessage.files = files;
        processedMessage.images = images;
      }
      return processedMessage;
    });

    return {
      processedMessages,
      imagePreviews
    };
  };

  processAttachments = (attachments, sender) => {
    const images = [];
    const files = [];

    attachments.forEach(attachment => {
      const thumbnailUrl = _get(attachment, 'thumbnails[0].url', null);
      const thumbnailRatio = this.maxThumbnailSize / Math.max(attachment.width, attachment.height);

      let thumbnailWidth = attachment.width;
      let thumbnailHeight = attachment.height;

      if (thumbnailRatio < 1) {
        thumbnailWidth = attachment.width * thumbnailRatio;
        thumbnailHeight = attachment.height * thumbnailRatio;
      }

      if (isWebImage(attachment.contentType) && thumbnailWidth && thumbnailHeight) {
        images.push({
          ...attachment,
          sender,
          thumbnailUrl,
          thumbnailWidth,
          thumbnailHeight,
        });
      }
      else {
        files.push({
          ...attachment,
          thumbnailUrl,
        })
      }
    });
    return { images, files };
  };

  onImagePreviewClick = (e, preview) => {
    const { elixirChatWidget } = this.props;
    const { imagePreviews } = this.state;
    elixirChatWidget.triggerEvent(IMAGE_PREVIEW_OPEN, preview, imagePreviews);
    e.preventDefault();
  };

  shouldHideMessageBalloon = (message) => { // TODO: move to process messages
    const hasText = message.text.trim();
    const hasReply = message.responseToMessage;
    const hasFiles = message.files && message.files.length;
    return message.sender.isCurrentClient && !hasText && !hasReply && !hasFiles;
  };

  onTakeScreenshotClick = () => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.togglePopup();
    elixirChatWidget.takeScreenshot().then(() => {
      elixirChatWidget.togglePopup();
    }).catch(() => {
      elixirChatWidget.togglePopup();
    });
  };

  onMessagesScroll = () => {
    const scrollBlock = this.scrollBlock.current;
    if (scrollBlock.scrollTop <= 0) {
      this.loadPrecedingMessageHistory();
    }
  };

  hasUserScroll = () => {
    const scrollBlock = this.scrollBlock.current;
    return scrollBlock.scrollTop <= scrollBlock.scrollHeight - scrollBlock.offsetHeight - 30;
  };

  scrollToBottom = (): void => {
    requestAnimationFrame(() => {
      this.scrollBlock.current.scrollTop = this.scrollBlock.current.scrollHeight;
    });
    this.scrollBlock.current.scrollTop = this.scrollBlock.current.scrollHeight;
  };

  onReplyOriginalMessageTextClick = (messageId) => {
    const highlightedClassName = 'elixirchat-chat-messages__item--flashed';
    const messageElement = this.refs[`message-${messageId}`];

    scrollToElement(messageElement, { isSmooth: true, position: 'center' }, () => {
      messageElement.classList.add(highlightedClassName);
      setTimeout(() => {
        messageElement.classList.remove(highlightedClassName);
      }, 1000);
    });
  };

  loadPrecedingMessageHistory = (): void => {
    const { elixirChatWidget } = this.props;
    const { isLoadingPrecedingMessageHistory } = this.state;
    const scrollBlock = this.scrollBlock.current;
    const initialScrollHeight = scrollBlock.scrollHeight;

    if (!isLoadingPrecedingMessageHistory && !elixirChatWidget.reachedBeginningOfMessageHistory) {
      this.setState({ isLoadingPrecedingMessageHistory: true });
      elixirChatWidget.fetchPrecedingMessageHistory(this.messageChunkSize).finally(() => {
        this.setState({ isLoadingPrecedingMessageHistory: false });
        scrollBlock.scrollTop = scrollBlock.scrollHeight - initialScrollHeight;
      });
    }
  };

  onReplyMessageClick = (messageId) => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.triggerEvent(REPLY_MESSAGE, messageId);
  };

  renderKeyShortcut = (keySequence) => {
    return (
      <Fragment>
        {keySequence.split(/\+/).map((key, index) => {
          return (
            <Fragment key={index}>
              {Boolean(index) && '+'}<kbd>{key}</kbd>
            </Fragment>
          )
        })}
      </Fragment>
    );
  };

  createMessageRef = (messageElement, message) => {
    this.messageRefs[message.id] = {
      current: messageElement,
      id: message.id,
      isUnread: message.isUnread,
      timestamp: message.timestamp,
      sender: {
        isCurrentClient: message.sender.isCurrentClient
      }
    };
  };

  render(): void {
    const { elixirChatWidget } = this.props;
    const {
      processedMessages,
      screenshotFallback,
      isLoading,
      isLoadingError,
      isLoadingPrecedingMessageHistory,
    } = this.state;

    return (
      <div className="elixirchat-chat-scroll" ref={this.scrollBlock} onScroll={this.onMessagesScroll}>
        <i className={cn({
          'elixirchat-chat-scroll-progress-bar': true,
          'elixirchat-chat-scroll-progress-bar--animating': isLoadingPrecedingMessageHistory,
        })}/>

        <div className="elixirchat-chat-messages" ref={this.scrollBlockInner}>
          {isLoading && (
            <i className="elixirchat-chat-spinner"/>
          )}

          {isLoadingError && (
            <div className="elixirchat-chat-fatal-error">
              Ошибка загрузки. <br/>
              Пожалуйста, перезагрузите
              страницу <span className="elixirchat-chat-fatal-error--nowrap">или напишите</span> администратору
              на support@elixir.chat.
            </div>
          )}

          {processedMessages.map(message => (
            <Fragment key={message.id}>

              {message.prependDateTitle && (
                <div className="elixirchat-chat-messages__date-title">
                  {dayjs(message.timestamp).calendar(null, {
                    sameDay: '[Сегодня, ] D MMMM',
                    lastDay: '[Вчера, ] D MMMM',
                    lastWeek: 'D MMMM',
                    sameElse: 'D MMMM',
                  })}
                </div>
              )}

              {!message.isSystem && (
                <div className={cn({
                  'elixirchat-chat-messages__item': true,
                  'elixirchat-chat-messages__item--by-me': message.sender.isCurrentClient,
                  'elixirchat-chat-messages__item--by-operator': message.sender.isOperator,
                  'elixirchat-chat-messages__item--highlighted': message.isUnread,
                })}
                  // ref={`message-${message.id}`}
                  // data-unread={message.isUnread}
                  // data-by-me={message.sender.isCurrentClient}
                  // data-id={message.id}>
                  data-id={message.id}
                  ref={element => this.createMessageRef(element, message)}>

                  {!this.shouldHideMessageBalloon(message) && (
                    <div className="elixirchat-chat-messages__balloon"
                      onDoubleClick={() => this.onReplyMessageClick(message.id)}>

                      {!message.sender.isCurrentClient && (
                        <div className="elixirchat-chat-messages__sender">
                          {message.sender.firstName} {message.sender.lastName}
                          {(!message.sender.firstName && !message.sender.lastName) && elixirChatWidget.widgetTitle}
                        </div>
                      )}

                      {Boolean(message.responseToMessage) && (
                        <div className="elixirchat-chat-messages__reply-message"
                          onClick={() => this.onReplyOriginalMessageTextClick(message.responseToMessage.id)}>
                          {message.responseToMessage.sender.firstName} {message.responseToMessage.sender.lastName} {message.responseToMessage.text.substr(0, 100)}
                        </div>
                      )}

                      {message.text && (
                        <div className="elixirchat-chat-messages__text">
                          <AutoLinkText
                            linkProps={{ target: '_blank', rel: 'noopener noreferrer' }}
                            text={message.text}/>
                        </div>
                      )}

                      {Boolean(message.files) && Boolean(message.files.length) && (
                        <ul className="elixirchat-chat-files">
                          {message.files.map(file => (
                            <li key={file.id} className="elixirchat-chat-files__item">
                              <a className={cn({
                                ['elixirchat-chat-files__preview']: true,
                                ['elixirchat-chat-files__preview-image']: file.thumbnailUrl,
                                ['elixirchat-chat-files__preview-submitting']: message.isSubmitting,
                              })}
                                style={{ backgroundImage: `url(${file.thumbnailUrl})` }}
                                href={file.url}
                                target="_blank">

                                {(!file.thumbnailUrl && !message.isSubmitting) && (
                                  <i className="icon-file"/>
                                )}
                                {message.isSubmitting && (
                                  <i className="elixirchat-chat-files__preview-spinner icon-spinner-xs"/>
                                )}
                              </a>
                              <div className="elixirchat-chat-files__text">
                                <a className="elixirchat-chat-files__text-link" href={file.url} target="_blank">{file.name}</a>
                                <br/>
                                <span className="elixirchat-chat-files__text-secondary">
                                    {message.isSubmitting ? 'Загрузка...' : getHumanReadableFileSize('ru-RU', file.bytesSize)}
                                  </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {Boolean(message.images) && Boolean(message.images.length) && (
                    <ul className="elixirchat-chat-images">
                      {message.images.map(image => (
                        <li key={image.id} className="elixirchat-chat-images__item">

                          <a className="elixirchat-chat-images__link"
                            href={image.url}
                            target="_blank"
                            onClick={e => this.onImagePreviewClick(e, { ...image, sender: message.sender })}>

                            <img className="elixirchat-chat-images__img"
                              width={_round(image.thumbnailWidth, 2)}
                              height={_round(image.thumbnailHeight)}
                              src={image.thumbnailUrl}
                              alt={image.name}
                              data-error-message="Файл не найден"
                              onError={e => e.target.parentNode.classList.add('elixirchat-chat-images__item-not-found')}/>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="elixirchat-chat-messages__bottom">
                    {message.isSubmissionError && (
                      <span className="elixirchat-chat-messages__submission-error"
                        title="Нажмите, чтобы отправить еще раз"
                        onClick={() => elixirChatWidget.retrySendMessage(message)}>
                        Не отправлено
                      </span>
                    )}
                    {!message.isSubmissionError && (
                      <Fragment>
                        {!message.sender.isCurrentClient && dayjs(message.timestamp).format('H:mm')}
                        {!message.isSystem && (
                          <span className="elixirchat-chat-messages__reply-button"
                            title="Для ответа также можно дважды кликнуть сообщение"
                            onClick={() => this.onReplyMessageClick(message.id)}>
                            Ответить
                          </span>
                        )}
                        {message.sender.isCurrentClient && dayjs(message.timestamp).format('H:mm')}
                      </Fragment>
                    )}
                  </div>
                </div>
              )}

              {message.isSystem && (
                <div className={cn({
                  'elixirchat-chat-messages__item': true,
                  'elixirchat-chat-messages__item--by-operator': true,
                  'elixirchat-chat-messages__item--system': true,
                  'elixirchat-chat-messages__item--highlighted': message.isUnread,
                })}
                  // ref={`message-${message.id}`}
                  // data-unread={message.isUnread}
                  // data-by-me={message.sender.isCurrentClient}
                  // data-id={message.id}>
                  data-id={message.id}
                  ref={element => this.createMessageRef(element, message)}>

                  <div className="elixirchat-chat-messages__balloon">
                    <div className="elixirchat-chat-messages__sender">
                      {message.sender.firstName} {message.sender.lastName}
                      {(!message.sender.firstName && !message.sender.lastName) && elixirChatWidget.widgetTitle}
                    </div>

                    {message.systemData.type === 'SCREENSHOT_REQUESTED' && (
                      <Fragment>
                        <div className="elixirchat-chat-messages__text">
                          Пожалуйста, пришлите скриншот вашего экрана.
                          {(Boolean(screenshotFallback) && Boolean(screenshotFallback.pressKey)) && (
                            <Fragment>
                              &nbsp;Для этого нажмите {this.renderKeyShortcut(screenshotFallback.pressKey)}
                              {screenshotFallback.pressKeySecondary && (
                                <Fragment>&nbsp;({this.renderKeyShortcut(screenshotFallback.pressKeySecondary)})</Fragment>
                              )},
                              а затем вставьте результат в текстовое поле.
                            </Fragment>
                          )}
                        </div>
                        {!Boolean(screenshotFallback) && (
                          <button className="elixirchat-chat-messages__take-screenshot"
                            onClick={this.onTakeScreenshotClick}>
                            Сделать скриншот
                          </button>
                        )}
                      </Fragment>
                    )}

                    {message.systemData.type === 'NOBODY_WORKING' && (
                      <Fragment>
                        <div className="elixirchat-chat-messages__text">
                          К сожалению, все операторы поддержки сейчас оффлайн
                          {message.systemData.whenWouldWork &&
                            ', но будут снова в сети ' +
                            inflectDayJSWeekDays('ru-RU', dayjs(message.systemData.whenWouldWork).calendar(null, {
                              nextWeek: '[в] dddd [в] H:mm',
                              nextDay: '[завтра в] H:mm',
                              sameDay: '[сегодня в] H:mm',
                              lastDay: 'D MMMM [в] H:mm',
                              lastWeek: 'D MMMM [в] H:mm',
                              sameElse: 'D MMMM [в] H:mm',
                            })
                          )}.
                        </div>
                      </Fragment>
                    )}

                    {message.systemData.type === 'NEW_CLIENT_PLACEHOLDER' && (
                      <Fragment>
                        <div className="elixirchat-chat-messages__text">
                          Здравствуйте! Как мы можем вам помочь?
                        </div>
                      </Fragment>
                    )}

                  </div>
                  <div className="elixirchat-chat-messages__bottom">
                    {dayjs(message.timestamp).format('H:mm')}
                  </div>
                </div>
              )}

            </Fragment>
          ))}
        </div>
      </div>
    );
  }
}
