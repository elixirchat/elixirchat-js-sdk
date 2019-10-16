import React, { Component } from 'react';
import cn from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { randomDigitStringId } from '../../utilsCommon';
import {inflect, getImageDimensions, isWebImage} from '../../utilsWidget';
import { getScreenshotCompatibilityFallback } from '../../sdk/ScreenshotTaker';
import {IMAGE_PREVIEW_CLOSE, WIDGET_POPUP_OPEN, WIDGET_RENDERED} from '../ElixirChatWidgetEventTypes';
import {TYPING_STATUS_CHANGE, TYPING_STATUS_SUBSCRIBE_SUCCESS} from '../../sdk/ElixirChatEventTypes';

export interface IDefaultWidgetTextareaProps {
  elixirChatWidget: ElixirChatWidget;
  onVerticalResize: any;
}

export interface IDefaultWidgetTextareaState {
  screenshotFallback: null | object;
  currentlyTypingUsers: Array<object>,
  textareaText: string,
  textareaAttachments: Array<{ id: string, file: File, name: string, isScreenshot?: boolean }>,
  textareaResponseToMessageId: string | null,
}

export class ChatTextarea extends Component<IDefaultWidgetTextareaProps, IDefaultWidgetTextareaState> {

  container = React.createRef();
  inputFile = React.createRef();
  textarea: HTMLTextAreaElement = null;

  state = {
    screenshotFallback: null,
    currentlyTypingUsers: [],
    textareaText: '',
    textareaAttachments: [],
    textareaResponseToMessageId: null,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.on(WIDGET_RENDERED, () => {
      if (elixirChatWidget.isWidgetPopupOpen) {
        this.focusTextarea();
      }
    });

    elixirChatWidget.on(TYPING_STATUS_SUBSCRIBE_SUCCESS, () => {
      const textareaText = localStorage.getItem('elixirchat-typed-text') || '';
      elixirChatWidget.dispatchTypedText(textareaText);
      this.setState({ textareaText });
    });

    elixirChatWidget.on(WIDGET_POPUP_OPEN, () => {
      this.updateVerticalHeight();
      this.focusTextarea();
    });

    elixirChatWidget.on(TYPING_STATUS_CHANGE, currentlyTypingUsers => {
      this.setState({ currentlyTypingUsers });
    });

    elixirChatWidget.on(IMAGE_PREVIEW_CLOSE, () => this.focusTextarea);

    this.setState({
      screenshotFallback: getScreenshotCompatibilityFallback(),
    });
  }

  componentDidUpdate(prevProps) {
    const { textareaAttachments, textareaResponseToMessageId } = this.props;
    const didResponseToMessageIdChange = textareaResponseToMessageId !== prevProps.textareaResponseToMessageId;
    // const didAttachmentsChange = textareaAttachments !== prevProps.textareaAttachments;
    if (didResponseToMessageIdChange) {
      this.updateVerticalHeight();
      this.focusTextarea();
    }
  }

  focusTextarea = () => {
    requestAnimationFrame(() => {
      this.textarea.focus();
    });
  };

  updateVerticalHeight = () => {
    const { onVerticalResize } = this.props;
    requestAnimationFrame(() => {
      const containerElement = this.container.current;
      if (containerElement) {
        onVerticalResize(containerElement.offsetHeight);
      }
    });
  };

  onTextareaChange = (e): void => {
    const { elixirChatWidget } = this.props;
    const textareaText = e.target.value;
    elixirChatWidget.dispatchTypedText(textareaText);
    localStorage.setItem('elixirchat-typed-text', textareaText);
    this.setState({ textareaText });
  };

  onTextareaKeyDown = (e) => {
    const {
      textareaText,
      textareaAttachments,
      textareaResponseToMessageId,
    } = this.state;

    if(e.keyCode === 13 && e.shiftKey === false) { // Press "Enter" without holding Shift
      e.preventDefault();
      if (textareaText.trim() || textareaAttachments.length) {
        this.onMessageSubmit({ textareaText, textareaResponseToMessageId, textareaAttachments });
        this.setState({
          textareaText: '',
          textareaResponseToMessageId: null,
          textareaAttachments: [],
        });
      }
    }
  };

  onRemoveReplyTo = () => {
    this.setState({
      textareaResponseToMessageId: null,
    });
    this.updateVerticalHeight();
  };

  addAttachments = async newAttachments => {
    const { textareaAttachments } = this.state;
    const enrichedNewAttachments = [];

    for (let i = 0; i < newAttachments.length; i++) {
      const attachment = newAttachments[i];
      const id = randomDigitStringId(6);
      const imageBlobUrl = URL.createObjectURL(attachment.file);
      const dimensions = await getImageDimensions(imageBlobUrl);
      enrichedNewAttachments.push({
        id,
        file: attachment.file,
        name: attachment.name || attachment.file.name,
        width: dimensions.width,
        height: dimensions.height,
        isScreenshot: attachment.isScreenshot,
      });
    }
    await this.setState({
      textareaAttachments: [
        ...textareaAttachments,
        ...enrichedNewAttachments,
      ]
    });
    this.updateVerticalHeight();
    this.focusTextarea();
  };

  removeAttachment = attachmentId => {
    const { textareaAttachments } = this.state;
    this.setState({
      textareaAttachments: textareaAttachments.filter(item => item.id !== attachmentId)
    });
    this.updateVerticalHeight();
  };

  handleAttachmentPaste = e => {
    const clipboardItem = (e.clipboardData || e.originalEvent.clipboardData || window.clipboardData).items[0];
    if (clipboardItem.kind === 'file') {
      e.preventDefault();
      const file = clipboardItem.getAsFile();
      if (file) {
        this.addAttachments([{
          name: 'Вставлено из буфера',
          file,
        }]);
      }
    }
  };

  onScreenShotClick = () => {
    const { elixirChatWidget } = this.props;
    const { textareaText } = this.state;
    elixirChatWidget.togglePopup();
    elixirChatWidget.takeScreenshot().then(screenshot => {
      this.addAttachments([{
        name: 'Скриншот экрана',
        file: screenshot.file,
        isScreenshot: true,
      }]);

      const updatedText = textareaText.trim() ? textareaText : 'Вот скриншот моего экрана';
      this.setState({ textareaText: updatedText });
      elixirChatWidget.togglePopup();

    }).catch(() => {
      elixirChatWidget.togglePopup();
    });
  };

  onInputFileChange = (e) => {
    this.addAttachments(e.target.files);
    this.inputFile.current.value = '';
  };

  onMessageSubmit = async () => {
    const { elixirChatWidget } = this.props;
    const { textareaText, textareaResponseToMessageId, textareaAttachments } = this.state;

    if (textareaText.trim() || textareaAttachments.length) {
      elixirChatWidget.sendMessage({
        text: textareaText,
        attachments: textareaAttachments.map(attachment => attachment.file),
        responseToMessageId: textareaResponseToMessageId,
        appendConditionally: true,
      });
      elixirChatWidget.dispatchTypedText(false);
      localStorage.removeItem('elixirchat-typed-text');
    }
  };

  render(): void {
    const { elixirChatWidget } = this.props;
    const {
      textareaText,
      textareaAttachments,
      textareaResponseToMessageId,
      currentlyTypingUsers,
      screenshotFallback,
    } = this.state;

    const responseToMessage = elixirChatWidget.messageHistory.filter(message => {
      return message.id === textareaResponseToMessageId;
    })[0];

    return (
      <div className="elixirchat-chat-textarea" ref={this.container}>

        {Boolean(currentlyTypingUsers.length) && (
          <div className="elixirchat-chat-typing">
            <i className="elixirchat-chat-typing__icon icon-typing"/>
            {inflect('ru-RU', currentlyTypingUsers.length, ['человек пишет...', 'человека пишут...', 'человек пишут...'])}
          </div>
        )}

        {Boolean(responseToMessage) && (
          <div className="elixirchat-chat-textarea__reply-to">
            <span className="elixirchat-chat-textarea__reply-to-text">
              <i className="elixirchat-chat-textarea__reply-to-icon icon-reply-right"/>
              <span title={responseToMessage.text}>
                {responseToMessage.text && responseToMessage.text.substr(0, 100)}
                {!responseToMessage.text && (
                  responseToMessage.sender.firstName + ' ' + responseToMessage.sender.lastName
                )}
              </span>
            </span>
            <span className="elixirchat-chat-textarea__reply-to-remove icon-close-thick"
              onClick={this.onRemoveReplyTo}/>
          </div>
        )}

        <div className="elixirchat-chat-textarea__actions">
          {!Boolean(screenshotFallback) && (
            <button className="elixirchat-chat-textarea__actions-screenshot"
              onClick={this.onScreenShotClick}
              title="Сделать скриншот">
              <i className="icon-screenshot"/>
            </button>
          )}
          <span className="elixirchat-chat-textarea__actions-attach"
            title="Прикрепить файл">
            <label className="elixirchat-chat-textarea__actions-attach-label" htmlFor="DefaultWidget-file-upload">
              <i className="icon-file"/>
            </label>
            <input
              className="elixirchat-chat-textarea__actions-attach-input"
              id="DefaultWidget-file-upload"
              type="file"
              ref={this.inputFile}
              multiple={true}
              onChange={this.onInputFileChange}/>
          </span>
        </div>

        <TextareaAutosize
          className="elixirchat-chat-textarea__textarea"
          placeholder="Напишите сообщение..."
          inputRef={tag => {this.textarea = tag;}}
          minRows={1}
          maxRows={5}
          onHeightChange={this.updateVerticalHeight}
          onPaste={this.handleAttachmentPaste}
          onChange={this.onTextareaChange}
          onKeyDown={this.onTextareaKeyDown}
          value={textareaText}>
        </TextareaAutosize>

        {Boolean(textareaAttachments.length) && (
          <ul className="elixirchat-chat-attachment-list">
            {textareaAttachments.map(attachment => (
              <li key={attachment.id} className="elixirchat-chat-attachment-item">
                <i className={cn({
                  'elixirchat-chat-attachment-icon': true,
                  'icon-file': !attachment.isScreenshot,
                  'icon-screenshot': attachment.isScreenshot,
                })}/>
                <span className="elixirchat-chat-attachment-filename">{attachment.name}</span>
                <i className="elixirchat-chat-attachment-remove icon-close-thick"
                  tabIndex={0}
                  onClick={() => this.removeAttachment(attachment.id)}>
                </i>
              </li>
            ))}
          </ul>
        )}

      </div>
    );
  }
}
