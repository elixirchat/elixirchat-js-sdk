import React, { Component } from 'react';
import cn from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import { randomDigitStringId } from '../../utilsCommon';
import { inflect } from '../../utilsWidget';
import { DefaultWidgetTextareaStyles } from './styles';

export interface IDefaultWidgetTextareaProps {
  elixirChatWidget: any;
  currentlyTypingUsers: Array<any>;
  onVerticalResize: any;
}

export interface IDefaultWidgetTextareaState {
  // typedText: string;
  // replyToId: string | null;
  // attachments: Array<File>;
  areTextareaActionsCollapsed: boolean;
}

export class DefaultWidgetTextarea extends Component<IDefaultWidgetTextareaProps, IDefaultWidgetTextareaState> {

  container = React.createRef();
  textarea: HTMLTextAreaElement = null;

  state = {
    // typedText: '',
    // replyToId: null,
    // attachments: [],
    areTextareaActionsCollapsed: false,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.injectIframeStyles(DefaultWidgetTextareaStyles);
    elixirChatWidget.onToggleChatVisibility((isOpen) => {
      if (isOpen) {
        this.updateVerticalHeight({ scrollToBottom: true });
        this.textarea.focus();
      }
    });
  }

  // onReplyClick = (messageId): void => { // TODO: figure is replyTo will be implemented in widget
  //   this.setState({
  //     replyToId: messageId
  //   });
  // };

  onTextareaChange = (e): void => {
    const { elixirChatWidget, onChange } = this.props;
    elixirChatWidget.dispatchTypedText(e.target.value);
    onChange({
      typedText: e.target.value,
    });
    // this.setState({
    //   typedText: e.target.value,
    // });
  };

  onTextareaKeyDown = (e) => {
    // const { typedText, replyToId, attachments } = this.state;
    // const { onMessageSubmit, onChange } = this.props;

    const {
      onMessageSubmit,
      onChange,
      typedText,
      replyToId,
      attachments,
    } = this.props;

    if(e.keyCode === 13 && e.shiftKey === false) { // Press "Enter" without holding Shift
      e.preventDefault();
      if (typedText.trim() || attachments.length) {
        onMessageSubmit({ typedText, attachments, replyToId });
        onChange({
          typedText: '',
          attachments: [],
          replyToId: null,
        });
        // this.setState({
        //   typedText: '',
        //   attachments: [],
        //   replyToId: null,
        // });
        this.updateVerticalHeight();
      }
    }
  };

  onRemoveReplyTo = () => {
    // this.props.onRemoveReplyTo();
    this.updateVerticalHeight();
  };

  addAttachments = newAttachments => {
    // this.setState({
    //   attachments: [
    //     ...this.state.attachments,
    //     ...attachments.map(item => ({ ...item, id: randomDigitStringId(6) }))
    //   ]
    // });

    const { attachments, onChange } = this.props;
    onChange({
      attachments: [
        ...attachments,
        ...newAttachments.map(item => ({ ...item, id: randomDigitStringId(6) }))
      ]
    });

    this.updateVerticalHeight();
  };

  removeAttachment = attachmentId => {
    // this.setState({
    //   attachments: this.state.attachments.filter(item => item.id !== attachmentId)
    // });

    const { attachments, onChange } = this.props;
    onChange({
      attachments: attachments.filter(item => item.id !== attachmentId)
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

  onScreenShotClick = (): void => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.toggleChatVisibility();
    elixirChatWidget.takeScreenshot().then(screenshot => {
      this.addAttachments([{
        name: 'Скриншот экрана',
        file: screenshot.file,
        isScreenshot: true,
      }]);
      elixirChatWidget.toggleChatVisibility();
    }).catch(() => {
      elixirChatWidget.toggleChatVisibility();
    });
  };

  onInputFileChange = (e) => {
    const attachments = Array.from(e.target.files).map(file => ({
      name: file.name,
      file,
    }));
    this.addAttachments(attachments);
  };

  updateVerticalHeight = (options: { scrollToBottom: boolean }) => {
    setTimeout(() => {
      const newHeight = this.container.current.offsetHeight;
      this.setState({
        areTextareaActionsCollapsed: newHeight < 60
      });
      this.props.onVerticalResize(newHeight, options);
    }, 0);
  };

  render(): void {

    const {
      areTextareaActionsCollapsed,
    } = this.state;

    const {
      typedText,
      replyToId,
      attachments,
      currentlyTypingUsers,
    } = this.props;

    return (
      <div className="elixirchat-chat-textarea" ref={this.container}>

        {Boolean(currentlyTypingUsers.length) && (
          <div className="elixirchat-chat-typing">
            {inflect('ru-RU', currentlyTypingUsers.length, ['человек пишет...', 'человека пишут...', 'человек пишут...'])}
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
          value={typedText}>
        </TextareaAutosize>

        {Boolean(attachments.length) && (
          <ul className="elixirchat-chat-attachment-list">
            {attachments.map(attachment => (
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
