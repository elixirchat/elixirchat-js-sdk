import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import {
  _get,
  _last,
  randomDigitStringId,
  getJSONFromLocalStorage,
} from '../../utilsCommon';

import {
  isWebImage,
  getImageDimensions,
  playNotificationSound,
  unlockNotificationSoundAutoplay,
} from '../../utilsWidget';

import { IMessage } from '../../sdk/serializers/serializeMessage';
import { ChatMessages } from './ChatMessages';
import { ChatTextarea } from './ChatTextarea';
import {
  JOIN_ROOM_SUCCESS,
  OPERATOR_ONLINE_STATUS_CHANGE,
} from '../../sdk/ElixirChatEventTypes';

import {
  WIDGET_IFRAME_READY,
  SCREENSHOT_REQUEST_SUCCESS,
} from '../ElixirChatWidgetEventTypes';

export interface IDefaultWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetState {
  messages: Array<IMessage>;
  room: any;
  client: any;
  textareaText: string;
  textareaResponseToMessageId: string | null;
  textareaAttachments: Array<{ id: string, file: File, name: string, isScreenshot: boolean }>;
  isLoadingPreviousMessages: boolean;
  isDraggingAttachments: boolean;
  widgetTitle: string;
  areAnyOperatorsOnline: boolean;
  areNotificationsMuted: boolean;
}

export class Chat extends Component<IDefaultWidgetProps, IDefaultWidgetState> {

  // container: { current: HTMLElement } = React.createRef();
  // scrollBlock: { current: HTMLElement } = React.createRef();
  chatMessages: { current: Component } = React.createRef();
  messageChunkSize: number = 20;

  state = {
    messages: [],
    room: {},
    client: {},
    textareaText: '',
    textareaResponseToMessageId: null,
    textareaAttachments: [],
    isLoadingPreviousMessages: false,
    isDraggingAttachments: false,
    widgetTitle: '',
    areAnyOperatorsOnline: false,
    areNotificationsMuted: false,
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;

    window.__this = this;

    elixirChatWidget.on(WIDGET_IFRAME_READY, () => {
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('click', unlockNotificationSoundAutoplay);
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('dragover', this.onBodyDrag);
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('drop', this.onBodyDrop);
    });

    elixirChatWidget.on(JOIN_ROOM_SUCCESS, () => {
      this.setState({ widgetTitle: elixirChatWidget.widgetTitle });
      elixirChatWidget.fetchMessageHistory(this.messageChunkSize);
    });

    // elixirChatWidget.on(MESSAGES_HISTORY_SET, this.scrollToBottom);// TODO: replace w/ FETCH_INITIAL

    elixirChatWidget.on(OPERATOR_ONLINE_STATUS_CHANGE, areAnyOperatorsOnline => {
      this.setState({ areAnyOperatorsOnline });
    });

    const areNotificationsMuted = getJSONFromLocalStorage('elixirchat-notifications-muted', false);
    this.setState({ areNotificationsMuted });
  }

  componentWillUnmount(){
    const { elixirChatWidget } = this.props;
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('dragover', this.onBodyDrag);
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('drop', this.onBodyDrop);
  }

  onBodyDrag = (e) => {
    e.preventDefault();
    this.setState({ isDraggingAttachments: true });
  };

  onBodyDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let textareaAttachments = [ ...this.state.textareaAttachments ];
    let attachmentFiles;
    if (e.dataTransfer.items) {
      attachmentFiles = Array.from(e.dataTransfer.items)
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile());
    }
    else {
      attachmentFiles = Array.from(e.dataTransfer.files);
    }
    for (let i = 0; i < attachmentFiles.length; i++) {
      const file = attachmentFiles[i];
      const imageBlobUrl = URL.createObjectURL(attachmentFiles[i]);
      const dimensions = await getImageDimensions(imageBlobUrl);
      textareaAttachments.push({
        id: randomDigitStringId(6),
        name: file.name,
        file,
        ...dimensions,
      });
    }
    this.setState({ textareaAttachments, isDraggingAttachments: false });
  };

  changeMessageById = (messageId, data) => {
    const { messages } = this.state;
    const changedMessages = messages.map(message => {
      if (message.id === messageId) {
        const changedMessage = { ...message };
        for (let key in data) {
          changedMessage[key] = data[key];
        }
        return changedMessage;
      }
      else {
        return { ...message };
      }
    });
    this.setState({ messages: changedMessages });
  };



  onSubmitRetry = async (message) => {
    // const { elixirChatWidget } = this.props;
    //
    // this.changeMessageById(message.id, {
    //   isSubmitting: true,
    //   isSubmissionError: false,
    // });
    // elixirChatWidget.sendMessage({
    //   text: message.text,
    //   attachments: message.attachments.map(attachment => attachment.originalFileObject).filter(file => file),
    //   responseToMessageId: _get(message, 'responseToMessage.id'),
    //   tempId: message.tempId,
    // }).catch(() => {
    //   this.changeMessageById(message.id, {
    //     isSubmitting: false,
    //     isSubmissionError: true,
    //   });
    // });
  };

  toggleMute = () => {
    const { areNotificationsMuted } = this.state;
    localStorage.setItem('elixirchat-notifications-muted', JSON.stringify(!areNotificationsMuted));
    this.setState({ areNotificationsMuted: !areNotificationsMuted });
  };

  render(): void {
    const { elixirChatWidget } = this.props;
    const {
      widgetTitle,
      isDraggingAttachments,
      areAnyOperatorsOnline,
      areNotificationsMuted,
      isLoadingPreviousMessages,
    } = this.state;

    return (
      <div className="elixirchat-chat-container">

        <h2 className="elixirchat-chat-header">
          {widgetTitle && (
            <Fragment>
              {areAnyOperatorsOnline && (
                <i className="elixirchat-chat-header__indicator"/>
              )}
              {widgetTitle}
            </Fragment>
          )}

          <button className="elixirchat-chat-header__mute"
            title={areNotificationsMuted ? 'Включить звук уведомлений' : 'Выключить звук уведомлений'}
            onClick={this.toggleMute}>
            <i className={areNotificationsMuted ? 'icon-speaker-mute' : 'icon-speaker'}/>
          </button>

          <button className="elixirchat-chat-header__close"
            title="Закрыть чат"
            onClick={elixirChatWidget.togglePopup}>
            <i className="icon-close-thin"/>
          </button>
        </h2>

        <i className={cn({
          'elixirchat-chat-scroll-progress-bar': true,
          'elixirchat-chat-scroll-progress-bar--animating': isLoadingPreviousMessages,
        })}/>

        <ChatMessages ref={this.chatMessages} onSubmitRetry={this.onSubmitRetry} elixirChatWidget={elixirChatWidget}/>
        <ChatTextarea elixirChatWidget={elixirChatWidget}/>

        {isDraggingAttachments && (
          <Fragment>
            <div className="elixirchat-chat-draggable-backdrop"/>
            <div className="elixirchat-chat-draggable-area">
              <i className="elixirchat-chat-draggable-area__icon icon-file"/>
              <div>Перетащите файлы для загрузки</div>
            </div>
          </Fragment>
        )}

      </div>
    );
  }
}
