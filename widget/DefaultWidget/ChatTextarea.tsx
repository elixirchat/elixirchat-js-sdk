import React, { Component, Fragment } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { Tooltip } from './Tooltip';
import { cn, randomDigitStringId, setToLocalStorage } from '../../utilsCommon';
import { getImageDimensions, generateReplyMessageQuote } from '../../utilsWidget';
import { getScreenshotCompatibilityFallback } from '../../sdk/ScreenshotTaker';
import { TYPING_STATUS_SUBSCRIBE_SUCCESS } from '../../sdk/ElixirChatEventTypes';
import {
  WIDGET_REPLY_MESSAGE,
  WIDGET_TEXTAREA_RESIZE,
  WIDGET_FULLSCREEN_PREVIEW_CLOSE,
  WIDGET_SCREENSHOT_REQUEST_SUCCESS,
  WIDGET_SCREENSHOT_REQUEST_ERROR,
  WIDGET_MUTE_TOGGLE,
  WIDGET_POPUP_OPEN,
} from '../ElixirChatWidgetEventTypes';

export interface IDefaultWidgetTextareaProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IDefaultWidgetTextareaState {
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
  screenshotFallback: null | object;
}

export class ChatTextarea extends Component<IDefaultWidgetTextareaProps, IDefaultWidgetTextareaState> {

  container = React.createRef();
  inputFile = React.createRef();
  textarea: HTMLTextAreaElement = null;

  state = {
    textareaText: '',
    textareaAttachments: [],
    textareaResponseToMessageId: null,
    isSubmittingMessage: false,
    isDraggingAttachments: false,
    hasCanceledDraggingAttachments: false,
    screenshotFallback: null,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;

    const savedTypedText = this.getLocallySavedTypedText();
    this.setState(savedTypedText);

    elixirChatWidget.on(TYPING_STATUS_SUBSCRIBE_SUCCESS, () => {
      elixirChatWidget.dispatchTypedText(savedTypedText.textareaText);
    });

    elixirChatWidget.on(WIDGET_SCREENSHOT_REQUEST_SUCCESS, this.onScreenshotRequestSuccess);
    elixirChatWidget.on(WIDGET_SCREENSHOT_REQUEST_ERROR, elixirChatWidget.openPopup);

    elixirChatWidget.on(WIDGET_FULLSCREEN_PREVIEW_CLOSE, this.focusTextarea);
    elixirChatWidget.on(WIDGET_MUTE_TOGGLE, this.focusTextarea);
    elixirChatWidget.on(WIDGET_POPUP_OPEN, this.focusTextarea);
    elixirChatWidget.on(WIDGET_POPUP_OPEN, this.onVerticalResize);

    elixirChatWidget.on(WIDGET_REPLY_MESSAGE, messageId => {
      this.setState({ textareaResponseToMessageId: messageId });
      this.updateLocallySavedTypedText({ textareaResponseToMessageId: messageId });
      this.onVerticalResize();
      this.focusTextarea();
    });

    this.focusTextarea();
    this.setState({ screenshotFallback: getScreenshotCompatibilityFallback() });

    elixirChatWidget.widgetIFrameDocument.body.addEventListener('dragover', this.onWidgetPopupDrag);
    elixirChatWidget.widgetIFrameDocument.body.addEventListener('drop', this.onBodyDrop);

    window.addEventListener('dragover', this.cancelWidgetPopupDrag);
    window.addEventListener('beforeunload', this.preventLoosingUploadingFiles);
  }

  componentWillUnmount(){
    const { elixirChatWidget } = this.props;
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('dragover', this.onWidgetPopupDrag);
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('drop', this.onBodyDrop);
    window.removeEventListener('dragover', this.cancelWidgetPopupDrag);

    elixirChatWidget.off(WIDGET_POPUP_OPEN, this.focusTextarea);
    elixirChatWidget.off(WIDGET_POPUP_OPEN, this.onVerticalResize);
  }

  preventLoosingUploadingFiles = (e) => {
    const { isSubmittingMessage } = this.state;
    if (isSubmittingMessage) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

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

  onBodyDrop = (e) => {
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
    setTimeout(() => {
      this.textarea.focus();
    });
  };

  onVerticalResize = () => {


    const { elixirChatWidget } = this.props;
    requestAnimationFrame(() => {
      const containerElement = this.container.current;
      if (containerElement) {
        elixirChatWidget.triggerEvent(WIDGET_TEXTAREA_RESIZE, containerElement.offsetHeight);
      }
    });
  };

  onTextareaChange = (e): void => {
    const { elixirChatWidget } = this.props;
    const textareaText = e.target.value;
    elixirChatWidget.dispatchTypedText(textareaText);
    this.updateLocallySavedTypedText({ textareaText });
    this.setState({ textareaText });
  };

  getLocallySavedTypedText = () => {
    let currentState = { textareaText: '', textareaResponseToMessageId: null };
    try {
      const { textareaText = '', textareaResponseToMessageId = null } = JSON.parse(
        localStorage.getItem('elixirchat-typed-text')
      );
      currentState = { textareaText, textareaResponseToMessageId };
    }
    catch (e) {}
    return currentState;
  };

  updateLocallySavedTypedText = (diff) => {
    const updatedState = {
      ...this.getLocallySavedTypedText(),
      ...diff
    };
    setToLocalStorage('elixirchat-typed-text', updatedState);
  };

  onTextareaKeyDown = (e) => {
    const {
      textareaText,
      textareaAttachments,
      textareaResponseToMessageId,
    } = this.state;

    if(e.key === 'Enter' && e.shiftKey === false) { // Press "Enter" without holding Shift
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
    this.setState({ textareaResponseToMessageId: null });
    this.updateLocallySavedTypedText({ textareaResponseToMessageId: null });
    this.onVerticalResize();
    this.focusTextarea();
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
    this.setState({
      textareaAttachments: [
        ...textareaAttachments,
        ...enrichedNewAttachments,
      ]
    }, () => {
      this.onVerticalResize();
      this.focusTextarea();
    });
  };

  removeAttachment = attachmentId => {
    const { textareaAttachments } = this.state;
    this.setState({
      textareaAttachments: textareaAttachments.filter(item => item.id !== attachmentId)
    });
    this.onVerticalResize();
    this.focusTextarea();
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
    elixirChatWidget.closePopup();
    elixirChatWidget.takeScreenshot();
  };

  onScreenshotRequestSuccess = (screenshot) => {
    const { elixirChatWidget } = this.props;
    const { textareaText } = this.state;

    this.addAttachments([{
      name: 'Скриншот экрана',
      file: screenshot.file,
      isScreenshot: true,
    }]);

    elixirChatWidget.openPopup();
    const updatedText = textareaText.trim() ? textareaText : 'Вот скриншот моего экрана';
    this.setState({ textareaText: updatedText });
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

  onMessageSubmit = () => {
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
      this.updateLocallySavedTypedText({
        textareaText: '',
        textareaResponseToMessageId: null,
      });
    }
  };

  render() {
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
                <span>
                  {generateReplyMessageQuote(responseToMessage, elixirChatWidget)}
                </span>
              </span>
              <span className="elixirchat-chat-textarea__reply-to-remove icon-close-thick"
                onClick={this.onRemoveReplyTo}/>
            </div>
          )}

          <div className="elixirchat-chat-textarea__actions">
            {!Boolean(screenshotFallback) && (
              <Tooltip className="elixirchat-chat-textarea__actions-tooltip" title="Сделать скриншот">
                <span className="elixirchat-chat-textarea__actions-button">
                  <button className="elixirchat-chat-textarea__actions-screenshot" onClick={this.onScreenShotClick}>
                    <i className="icon-screenshot"/>
                  </button>
                </span>
              </Tooltip>
            )}
            <Tooltip className="elixirchat-chat-textarea__actions-tooltip" title="Прикрепить файл">
              <span className="elixirchat-chat-textarea__actions-button">
                <span className="elixirchat-chat-textarea__actions-attach">
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
              </span>
            </Tooltip>
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
