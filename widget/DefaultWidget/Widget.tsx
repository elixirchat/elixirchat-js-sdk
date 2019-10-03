import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { generateFontFaceRule, unlockNotificationSoundAutoplay } from '../../utilsWidget';
import { Chat } from './Chat';
import { IFrameWrapper } from './IFrameWrapper';
import { ImagePreview } from './ImagePreview';
import styles from './styles';
import assets from './assets';

export interface IWidgetProps {
  elixirChatWidget: any;
}

export interface IWidgetState {
  isIFrameOpen: boolean;
  isIFrameOpeningAnimation: boolean;
  outsideIframeStyles: null | string;
  insideIframeStyles: null | string;
  unreadCount: number;
  isImagePreviewOpen: boolean;
  currentImagePreview: any,
  imagePreviewGallery: Array<any>,
}

export class Widget extends Component<IWidgetProps, IWidgetState> {

  state = {
    isIFrameOpen: false,
    isIFrameOpeningAnimation: false,
    outsideIframeStyles: null,
    insideIframeStyles: null,
    unreadCount: 0,
    isImagePreviewOpen: false,
    currentImagePreview: {},
    imagePreviewGallery: [],
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    const { outsideIframeStyles, insideIframeStyles } = this.generateStyles();
    document.body.addEventListener('click', unlockNotificationSoundAutoplay);

    this.setState({
      outsideIframeStyles,
      insideIframeStyles,
    });

    elixirChatWidget.onToggleChatVisibility(this.onToggleButton);
    elixirChatWidget.onSetUnreadCount((unreadCount) => this.setState({ unreadCount }));
  }

  generateStyles = () => {
    const { elixirChatWidget } = this.props;
    const fontFaceGraphikNormal = generateFontFaceRule('Graphik', 'normal', assets.fontGraphikRegularWeb);
    const fontFaceGraphikBold = generateFontFaceRule('Graphik', 'bold', assets.fontGraphikBoldWeb);
    const fontFaceElixirIcons = generateFontFaceRule('elixirchat-icons', null, assets.fontElixirchatIcons);

    const outsideIframeStyles = [
      styles.icons,
      styles.Widget,
      styles.ImagePreview,
      fontFaceGraphikNormal,
      fontFaceElixirIcons,
    ].join('\n');

    const insideIframeStyles = [
      styles.icons,
      styles.Chat,
      styles.ChatMessages,
      styles.ChatTextarea,
      fontFaceGraphikNormal,
      fontFaceGraphikBold,
      fontFaceElixirIcons,
      elixirChatWidget.iframeStyles,
    ].join('\n');

    return {
      outsideIframeStyles,
      insideIframeStyles,
    };
  };

  onToggleButton = async () => {
    await this.setState({
      isIFrameOpen: !this.state.isIFrameOpen,
      isIFrameOpeningAnimation: true,
    });
    setTimeout(() => {
      this.setState({ isIFrameOpeningAnimation: false });
    });
  };

  onImagePreviewOpen = (currentImagePreview, imagePreviewGallery) => {
    this.setState({
      isImagePreviewOpen: true,
      currentImagePreview,
      imagePreviewGallery,
    });
  };

  onImagePreviewClose = () => {
    this.setState({
      isImagePreviewOpen: false,
      currentImagePreview: {},
      imagePreviewGallery: [],
    });
  };

  render() {
    const { elixirChatWidget } = this.props;
    const {
      isIFrameOpen,
      isIFrameOpeningAnimation,
      outsideIframeStyles,
      insideIframeStyles,
      unreadCount,
      currentImagePreview,
      imagePreviewGallery,
      isImagePreviewOpen,
    } = this.state;

    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: outsideIframeStyles }}/>
        <button className="elixirchat-widget-button" onClick={elixirChatWidget.toggleChatVisibility}>
          <span className={cn({
            'elixirchat-widget-button-counter': true,
            'elixirchat-widget-button-counter--has-unread': unreadCount,
          })}>{Boolean(unreadCount) && unreadCount}</span>
        </button>

        <ImagePreview
          elixirChatWidget={elixirChatWidget}
          preview={currentImagePreview}
          gallery={imagePreviewGallery}
          onClose={this.onImagePreviewClose}/>

        <IFrameWrapper elixirChatWidget={elixirChatWidget} className={cn({
          'elixirchat-widget-iframe': true,
          'elixirchat-widget-iframe--visible': isIFrameOpen,
          'elixirchat-widget-iframe--opening': isIFrameOpeningAnimation,
        })}>
          <Fragment>
            <style dangerouslySetInnerHTML={{ __html: insideIframeStyles }}/>
            <Chat elixirChatWidget={elixirChatWidget}
              isImagePreviewOpen={isImagePreviewOpen}
              onImagePreviewOpen={this.onImagePreviewOpen} />
          </Fragment>
        </IFrameWrapper>
      </Fragment>
    );
  }
}


export function renderWidgetReactComponent(container, elixirChatWidget) {
  let component;
  ReactDOM.render((
    <Widget ref={(widget) => {component = widget}} elixirChatWidget={elixirChatWidget} />
  ), container);
  return component;
}
