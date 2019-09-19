import React, { Component } from 'react';
import cn from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import { randomDigitStringId } from '../../utilsCommon';
import { inflect, getImageDimensions } from '../../utilsWidget';
import { DefaultWidgetTextareaStyles } from './styles';

export interface IDefaultWidgetTextareaProps {
  elixirChatWidget: any;
  currentlyTypingUsers: Array<any>;
  onVerticalResize: any;
}

export interface IDefaultWidgetTextareaState {
  areTextareaActionsCollapsed: boolean;
}

export class DefaultWidgetTextarea extends Component<IDefaultWidgetTextareaProps, IDefaultWidgetTextareaState> {

  container = React.createRef();
  inputFile = React.createRef();
  textarea: HTMLTextAreaElement = null;

  state = {
    areTextareaActionsCollapsed: false,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.injectIframeStyles(DefaultWidgetTextareaStyles);
    elixirChatWidget.onToggleChatVisibility((isOpen) => {
      if (isOpen) {
        this.updateVerticalHeight({ forceScrollToBottom: true });
        this.textarea.focus();
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { textareaAttachments, textareaResponseToMessageId } = this.props;
    const didResponseToMessageIdChange = textareaResponseToMessageId !== prevProps.textareaResponseToMessageId;
    const didAttachmentsChange = textareaAttachments !== prevProps.textareaAttachments;
    if (didResponseToMessageIdChange || didAttachmentsChange) {
      this.updateVerticalHeight();
      this.textarea.focus();
    }
  }

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
    const clipboardItem = (event.clipboardData || event.originalEvent.clipboardData).items[0];
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

  updateVerticalHeight = (options: { forceScrollToBottom: boolean }) => {
    setTimeout(() => {
      const newHeight = this.container.current.offsetHeight;
      this.setState({
        areTextareaActionsCollapsed: newHeight < 60,
      });
      this.props.onVerticalResize(newHeight, options);
    }, 0);
  };

  render(): void {
    const { areTextareaActionsCollapsed } = this.state;
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
            {inflect('ru-RU', currentlyTypingUsers.length, ['человек пишет...', 'человека пишут...', 'человек пишут...'])}
          </div>
        )}

        {Boolean(responseToMessage) && (
          <div className="elixirchat-chat-textarea__reply-to">
            <span className="elixirchat-chat-textarea__reply-to-text">
              <i className="elixirchat-chat-textarea__reply-to-icon"/>
              <span title={responseToMessage.text}>
                {responseToMessage.text && responseToMessage.text.substr(0, 100)}
                {!responseToMessage.text && (
                  responseToMessage.sender.firstName + ' ' + responseToMessage.sender.lastName
                )}
              </span>
            </span>
            <span className="elixirchat-chat-textarea__reply-to-remove" onClick={this.onRemoveReplyTo}/>
          </div>
        )}

        <div className={cn({
          'elixirchat-chat-textarea__actions': true,
          'elixirchat-chat-textarea__actions--collapsed': areTextareaActionsCollapsed,
        })}>
          <button className="elixirchat-chat-textarea__actions-screenshot"
            onClick={this.onScreenShotClick}
            title="Сделать скриншот"/>

          <span className="elixirchat-chat-textarea__actions-attach"
            title="Прикрепить файл">
            <input
              className="elixirchat-chat-textarea__actions-attach-input"
              id="DefaultWidget-file-upload"
              type="file"
              ref={this.inputFile}
              multiple={true}
              onChange={this.onInputFileChange}/>
            <label className="elixirchat-chat-textarea__actions-attach-label" htmlFor="DefaultWidget-file-upload"/>
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
                  'elixirchat-chat-attachment-icon--screenshot': attachment.isScreenshot,
                })}/>
                <span className="elixirchat-chat-attachment-filename">{attachment.name}</span>
                <i className="elixirchat-chat-attachment-remove"
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
