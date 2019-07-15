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
}

export class DefaultWidgetTextarea extends Component<IDefaultWidgetTextareaProps, IDefaultWidgetTextareaState> {

  state = {
    replyToId: null,
    typedText: '',
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

  onReplyClick = (messageId): void => {
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

  sendMessage = (): void => {
    const { typedText, replyToId } = this.state;
    this.props.elixirChatWidget.sendMessage({
      text: typedText,
      responseToMessageId: replyToId,
    });
    this.setState({
      typedText: '',
      replyToId: null,
    });
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
          value={typedText}>
        </textarea>

        <button className="elixirchat-chat-submit" onClick={this.sendMessage}>Submit</button>

        {Boolean(replyToId) && (
          <blockquote className="elixirchat-chat-reply-to">Reply to: ${replyToId}</blockquote>
        )}

      </div>
    );
  }
}
