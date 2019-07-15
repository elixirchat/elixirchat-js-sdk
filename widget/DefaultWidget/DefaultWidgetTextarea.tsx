import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import widgetTextareaStyles from './iframeStyles/DefaultWidgetTextareaStyles';

export interface IDefaultWidgetTextareaProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetTextareaState {
  replyToId: string | null;
  currentlyTypingUsers: Array<any>;
  typedText: string;
  attachments: Array<File>;
}

export class DefaultWidgetTextarea extends Component<IDefaultWidgetTextareaProps, IDefaultWidgetTextareaState> {

  state = {
    replyToId: null,
    typedText: '',
    attachments: [],
  };

  componentDidMount(): void {
    this.props.elixirChatWidget.injectIframeStyles(widgetTextareaStyles);
  }

  componentDidUpdate(prevProps): void {

  }

  onScreenShotClick = (): void => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.takeScreenshot().then(screenshot => {
      console.log('Screenshot', screenshot.file);
      this.setState({
        test: screenshot.file.name,
      });
    });
  };

  onReplyClick = (messageId): void => { // TODO: figure is replyTo will be implemented in widget
    this.setState({
      replyToId: messageId
    });
  };

  onTextareaChange = (e): void => {
    this.props.elixirChatWidget.dispatchTypedText(e.target.value);
    this.setState({
      typedText: e.target.value,
    });
  };

  onTextareaKeyDown = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) { // Press "Enter" without holding Shift
      e.preventDefault();
      const { typedText, replyToId, attachments } = this.state;
      if (typedText.trim()) {
        this.props.elixirChatWidget.sendMessage({
          text: typedText,
          responseToMessageId: replyToId,
          attachments,
        });
        this.setState({
          typedText: '',
          replyToId: null,
        });
      }
    }
  };

  render(): void {

    const { elixirChatWidget } = this.props;
    const { typedText, replyToId } = this.state;

    return (
      <div className="elixirchat-chat-textarea">

        <div className="elixirchat-chat-textarea__actions">
          <button className="elixirchat-chat-textarea__actions-screenshot"
            onClick={this.onScreenShotClick}
            title="Сделать скриншот"/>
          <button className="elixirchat-chat-textarea__actions-attach"
            title="Прикрепить файл"/>
        </div>

        <textarea className="elixirchat-chat-textarea__textarea"
          placeholder="Напишите сообщение..."
          onChange={this.onTextareaChange}
          onKeyDown={this.onTextareaKeyDown}
          value={typedText}>
        </textarea>
      </div>
    );
  }
}
