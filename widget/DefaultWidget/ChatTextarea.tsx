import React, {Component, Fragment} from 'react';
import cn from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { randomDigitStringId } from '../../utilsCommon';
import { getImageDimensions } from '../../utilsWidget';
import { getScreenshotCompatibilityFallback } from '../../sdk/ScreenshotTaker';
import {
  REPLY_MESSAGE,
  IMAGE_PREVIEW_CLOSE,
  TEXTAREA_VERTICAL_RESIZE,
  WIDGET_IFRAME_READY,
  WIDGET_POPUP_OPEN,
  WIDGET_RENDERED,
  WIDGET_MUTE,
  WIDGET_UNMUTE,
} from '../ElixirChatWidgetEventTypes';

import { TYPING_STATUS_SUBSCRIBE_SUCCESS } from '../../sdk/ElixirChatEventTypes';

export interface IDefaultWidgetTextareaProps {
  elixirChatWidget: ElixirChatWidget;
  onVerticalResize: any;
}

export interface IDefaultWidgetTextareaState {
  screenshotFallback: null | object;
  textareaText: string,
  textareaResponseToMessageId: string | null,
  textareaAttachments: Array<{
    id: string;
    file: File;
    name: string;
    width: number;
    height: number;
    isScreenshot?: boolean;
  }>,
  isSubmittingMessage: boolean;
  isDraggingAttachments: boolean;
  hasCanceledDraggingAttachments: boolean;
}

export class ChatTextarea extends Component<IDefaultWidgetTextareaProps, IDefaultWidgetTextareaState> {

  container = React.createRef();
  inputFile = React.createRef();
  textarea: HTMLTextAreaElement = null;

  state = {
    screenshotFallback: null,
    textareaText: '',
    textareaAttachments: [],
    textareaResponseToMessageId: null,
    isSubmittingMessage: false,
    isDraggingAttachments: false,
    hasCanceledDraggingAttachments: false,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.on(WIDGET_IFRAME_READY, () => {
      elixirChatWidget.widgetIFrameDocument.addEventListener('dragover', this.onWidgetPopupDrag);
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('drop', this.onBodyDrop);
      document.addEventListener('dragover', this.cancelWidgetPopupDrag);
    });
    elixirChatWidget.on(TYPING_STATUS_SUBSCRIBE_SUCCESS, () => {
      const textareaText = localStorage.getItem('elixirchat-typed-text') || '';
      elixirChatWidget.dispatchTypedText(textareaText);
      this.setState({ textareaText });
    });
    elixirChatWidget.on(WIDGET_RENDERED, () => {
      if (elixirChatWidget.isWidgetPopupOpen) {
        this.focusTextarea();
      }
    });
    elixirChatWidget.on(WIDGET_POPUP_OPEN, () => {
      this.onVerticalResize();
      this.focusTextarea();
    });
    elixirChatWidget.on(IMAGE_PREVIEW_CLOSE, () => this.focusTextarea);

    elixirChatWidget.on(REPLY_MESSAGE, messageId => {
      this.setState({ textareaResponseToMessageId: messageId });
      this.onVerticalResize();
      this.focusTextarea();
    });
    elixirChatWidget.on([WIDGET_MUTE, WIDGET_UNMUTE], () => {
      this.focusTextarea();
    });

    window.addEventListener('beforeunload', (e) => {
      if (this.state.isSubmittingMessage) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    this.setState({
      screenshotFallback: getScreenshotCompatibilityFallback(),
    });
  }

  componentWillUnmount(){
    const { elixirChatWidget } = this.props;
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('dragover', this.onWidgetPopupDrag);
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('drop', this.onBodyDrop);
    document.removeEventListener('dragover', this.cancelWidgetPopupDrag);
  }

  onWidgetPopupDrag = (e) => {
    const { hasCanceledDraggingAttachments } = this.state;
    e.preventDefault();
    e.stopPropagation();

    this.setState({ isDraggingAttachments: true });

    if (!hasCanceledDraggingAttachments) {
      this.setState({ hasCanceledDraggingAttachments: true });
      requestAnimationFrame(() => {
        elixirChatWidget.widgetIFrameDocument.body.addEventListener('dragleave', this.onWidgetPopupDragLeave);
      });
    }
  };

  onWidgetPopupDragLeave = () => {
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('dragleave', this.onWidgetPopupDragLeave);
    this.setState({
      isDraggingAttachments: false,
      hasCanceledDraggingAttachments: false,
    });
  };

  cancelWidgetPopupDrag = () => {
    this.setState({ isDraggingAttachments: false });
  };

  onBodyDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const attachments = Array.from(e.dataTransfer.items || e.dataTransfer.files)
      .filter(item => item.kind === 'file')
      .map(item => {
        const file = item.getAsFile();
        return {
          name: file.name,
          file,
        }
      });

    this.addAttachments(attachments);
    this.cancelWidgetPopupDrag();
  };

  focusTextarea = () => {
    requestAnimationFrame(() => {
      this.textarea.focus();
    });
  };

  onVerticalResize = () => {
    const { elixirChatWidget } = this.props;
    requestAnimationFrame(() => {
      const containerElement = this.container.current;
      if (containerElement) {
        elixirChatWidget.triggerEvent(TEXTAREA_VERTICAL_RESIZE, containerElement.offsetHeight);
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
        this.onVerticalResize();
      }
    }
  };

  onRemoveReplyTo = () => {
    this.setState({
      textareaResponseToMessageId: null,
    });
    this.onVerticalResize();
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
        name: attachment.name,
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
    this.onVerticalResize();
    this.focusTextarea();
  };

  removeAttachment = attachmentId => {
    const { textareaAttachments } = this.state;
    this.setState({
      textareaAttachments: textareaAttachments.filter(item => item.id !== attachmentId)
    });
    this.onVerticalResize();
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
    const attachments = Array.from(e.target.files).map(file => {
      return {
        name: file.name,
        file: file,
      };
    });
    this.addAttachments(attachments);
    this.inputFile.current.value = '';
  };

  onMessageSubmit = async () => {
    const { elixirChatWidget } = this.props;
    const { textareaText, textareaResponseToMessageId, textareaAttachments } = this.state;

    if (textareaText.trim() || textareaAttachments.length) {
      this.setState({ isSubmittingMessage: true });

      elixirChatWidget
        .sendMessage({
          text: textareaText,
          attachments: textareaAttachments,
          responseToMessageId: textareaResponseToMessageId,
          appendConditionally: true,
        })
        .finally(() => {
          this.setState({ isSubmittingMessage: false });
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
      screenshotFallback,
      isDraggingAttachments,
    } = this.state;

    const responseToMessage = elixirChatWidget.messageHistory.filter(message => {
      return message.id === textareaResponseToMessageId;
    })[0];

    return (
      <Fragment>
        <div className="elixirchat-chat-textarea" ref={this.container}>

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
            onHeightChange={this.onVerticalResize}
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

        {isDraggingAttachments && (
          <Fragment>
            <div className="elixirchat-chat-draggable-backdrop"/>
            <div className="elixirchat-chat-draggable-area">
              <i className="elixirchat-chat-draggable-area__icon icon-file"/>
              <div>Перетащите файлы для загрузки</div>
            </div>
          </Fragment>
        )}

      </Fragment>
    );
  }
}
