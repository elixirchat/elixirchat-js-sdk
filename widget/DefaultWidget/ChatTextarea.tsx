import React, { Component } from 'react';
import cn from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { randomDigitStringId } from '../../utilsCommon';
import { inflect, getImageDimensions } from '../../utilsWidget';
import { getCompatibilityFallback } from '../../sdk/ScreenshotTaker';
import {WIDGET_POPUP_OPEN, WIDGET_RENDERED} from '../ElixirChatWidgetEventTypes';

export interface IDefaultWidgetTextareaProps {
  elixirChatWidget: ElixirChatWidget;
  currentlyTypingUsers: Array<any>;
  onVerticalResize: any;
}

export interface IDefaultWidgetTextareaState {
  screenshotFallback: null | object;
}

export class ChatTextarea extends Component<IDefaultWidgetTextareaProps, IDefaultWidgetTextareaState> {

  container = React.createRef();
  inputFile = React.createRef();
  textarea: HTMLTextAreaElement = null;

  state = {
    screenshotFallback: null,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.on(WIDGET_RENDERED, () => {
      if (elixirChatWidget.isWidgetPopupOpen) {
        this.focusTextarea();
      }
    });

    elixirChatWidget.on(WIDGET_POPUP_OPEN, () => {
      this.updateVerticalHeight({ forceScrollToBottom: true });
      this.focusTextarea();
    });

    this.setState({
      screenshotFallback: getCompatibilityFallback(),
    });
  }

  componentDidUpdate(prevProps) {
    const { textareaAttachments, textareaResponseToMessageId, isImagePreviewOpen } = this.props;
    const didResponseToMessageIdChange = textareaResponseToMessageId !== prevProps.textareaResponseToMessageId;
    const didAttachmentsChange = textareaAttachments !== prevProps.textareaAttachments;
    const didImagePreviewClose = !isImagePreviewOpen && prevProps.isImagePreviewOpen;
    if (didResponseToMessageIdChange || didAttachmentsChange) {
      this.updateVerticalHeight();
      this.focusTextarea();
    }
    if (didImagePreviewClose) {
      this.focusTextarea();
    }
  }

  focusTextarea = () => {
    setTimeout(() => {
      this.textarea.focus();
    });
  };

  onTextareaChange = (e): void => {
    const { elixirChatWidget, onChange } = this.props;
    const textareaText = e.target.value;
    elixirChatWidget.dispatchTypedText(textareaText);
    onChange({ textareaText });
  };

  onTextareaKeyDown = (e) => {
    const {
      onMessageSubmit,
      onChange,
      textareaText,
      textareaResponseToMessageId,
      textareaAttachments,
    } = this.props;

    if(e.keyCode === 13 && e.shiftKey === false) { // Press "Enter" without holding Shift
      e.preventDefault();
      if (textareaText.trim() || textareaAttachments.length) {
        onMessageSubmit({ textareaText, textareaResponseToMessageId, textareaAttachments });
        onChange({
          textareaText: '',
          textareaResponseToMessageId: null,
          textareaAttachments: [],
        });
      }
    }
  };

  onRemoveReplyTo = () => {
    this.props.onChange({ textareaResponseToMessageId: null });
    this.updateVerticalHeight();
  };

  addAttachments = async newAttachments => {
    const { textareaAttachments, onChange } = this.props;
    const enrichedNewAttachments = newAttachments.map(async attachment => {
      const id = randomDigitStringId(6);
      const imageBlobUrl = URL.createObjectURL(attachment.file);
      const dimensions = await getImageDimensions(imageBlobUrl);
      return {
        ...attachment,
        ...dimensions,
        id,
      };
    });
    onChange({
      textareaAttachments: [
        ...textareaAttachments,
        ...await Promise.all(enrichedNewAttachments),
      ]
    });
    this.updateVerticalHeight();
  };

  removeAttachment = attachmentId => {
    const { textareaAttachments, onChange } = this.props;
    onChange({
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
    const { elixirChatWidget, onChange, textareaText } = this.props;
    elixirChatWidget.toggleChatVisibility();
    elixirChatWidget.takeScreenshot().then(screenshot => {
      this.addAttachments([{
        name: 'Скриншот экрана',
        file: screenshot.file,
        isScreenshot: true,
      }]);

      const updatedText = textareaText.trim() ? textareaText : 'Вот скриншот моего экрана';
      onChange({ textareaText: updatedText });
      elixirChatWidget.toggleChatVisibility();

    }).catch(() => {
      elixirChatWidget.toggleChatVisibility();
    });
  };

  onInputFileChange = (e) => {
    const textareaAttachments = Array.from(e.target.files).map(file => ({
      name: file.name,
      file,
    }));
    this.addAttachments(textareaAttachments);
    this.inputFile.current.value = '';
  };

  updateVerticalHeight = async (options: { forceScrollToBottom: boolean }) => {
    const { onVerticalResize } = this.props;
    const containerElement = this.container.current;
    if (!containerElement) {
      return;
    }
    const newHeight = containerElement.offsetHeight;
    onVerticalResize(newHeight, options);
  };

  render(): void {
    const { screenshotFallback } = this.state;
    const {
      messages,
      textareaText,
      textareaResponseToMessageId,
      textareaAttachments,
      currentlyTypingUsers,
    } = this.props;

    const responseToMessage = messages.filter(message => {
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
