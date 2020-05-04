import React, { Component } from 'react';
import cn from 'classnames';
import { ElixirChatWidget } from '../ElixirChatWidget';
import {IMAGE_PREVIEW_CLOSE, IMAGE_PREVIEW_OPEN, WIDGET_IFRAME_READY} from '../ElixirChatWidgetEventTypes';

export interface IFullScreenPreviewProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IFullScreenPreviewState {
  preview: object,
  gallery: Array<object>,
  displaySize: {
    width: number;
    height: number;
  };
  marginTop: number;
  isVisible: boolean;
  isSlideAnimation: boolean;
}

export class FullScreenPreview extends Component<IFullScreenPreviewProps, IFullScreenPreviewState> {

  state = {
    preview: {},
    gallery: [],
    displaySize: {
      width: 0,
      height: 0,
    },
    marginTop: 0,
    isVisible: false,
    isSlideAnimation: false,
  };

  HORIZONTAL_PADDINGS = 100;
  VERTICAL_PADDINGS = 120;

  video = React.createRef();

  componentDidMount() {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.on(WIDGET_IFRAME_READY, () => {
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('keyup', this.onIframeBodyKeyup);
    });

    elixirChatWidget.on(IMAGE_PREVIEW_OPEN, (preview, gallery) => {
      this.setState({ preview, gallery, isVisible: true });
      this.updatePreviewDimensions(preview);
    });
  }

  componentWillUnmount() {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('keyup', this.onIframeBodyKeyup);
  }

  updatePreviewDimensions = (preview) => {
    const { width, height, url } = preview;
    if (preview && url && width && height) {
      const displaySize = this.calculateFullScreenPreviewSize(width, height);
      const marginTop = this.calculateFullScreenPreviewTopMargin(displaySize.height);
      this.setState({ displaySize, marginTop });
      this.animateSlide();
    }
  };

  calculateFullScreenPreviewSize = (imageNativeWidth, imageNativeHeight) => {
    const maxImageWidth = window.innerWidth - this.HORIZONTAL_PADDINGS; // window viewport width minus horizontal paddings
    let width = imageNativeWidth;
    let height = imageNativeHeight;
    if (imageNativeWidth > maxImageWidth) {
      const ratio = maxImageWidth / imageNativeWidth;
      width = maxImageWidth;
      height = Math.round(imageNativeHeight * ratio);
    }
    return { width, height };
  };

  calculateFullScreenPreviewTopMargin = (imageDisplayHeight) => {
    const availableVerticalSpace = window.innerHeight - this.VERTICAL_PADDINGS;
    if (availableVerticalSpace < imageDisplayHeight) {
      return 0;
    }
    else {
      return (availableVerticalSpace - imageDisplayHeight) / 2;
    }
  };

  onIframeBodyKeyup = (e) => {
    if (e.which === 27 /* Esc */) {
      this.onClose();
    }
    else if (e.which === 37 /* Arrow left */) {
      this.onArrowNavigation(-1);
    }
    else if (e.which === 39 /* Arrow right */) {
      this.onArrowNavigation(1);
    }
  };

  onArrowNavigation = (delta) => {
    const { isVisible, preview, gallery } = this.state;

    if (!isVisible) {
      return false;
    }
    const currentPreviewIndex = gallery.map(image => image.id).indexOf(preview.id);
    let nextPreviewIndex = currentPreviewIndex + delta;
    if (nextPreviewIndex < 0) {
      nextPreviewIndex = gallery.length - 1;
    }
    else if (nextPreviewIndex >= gallery.length) {
      nextPreviewIndex = 0;
    }

    const nextPreview = gallery[nextPreviewIndex];
    this.setState({ preview: nextPreview });
    this.updatePreviewDimensions(nextPreview);
    this.animateSlide();
  };

  animateSlide = () => {
    this.setState({ isSlideAnimation: true });
    setTimeout(() => {
      this.setState({ isSlideAnimation: false });
    }, 200);
  };

  onClose = () => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.triggerEvent(IMAGE_PREVIEW_CLOSE);
    this.setState({ isVisible: false });
  };

  render() {
    const {
      preview,
      displaySize,
      marginTop,
      isSlideAnimation,
      isVisible,
    } = this.state;

    return (
      <div className={cn({
        'elixirchat-widget-full-screen-preview': true,
        'elixirchat-widget-full-screen-preview--visible': isVisible,
      })} onClick={this.onClose}>
        <div className="elixirchat-widget-full-screen-preview__inner">
          {preview.url && preview.previewType === 'image' && (
            <img className={cn({
              'elixirchat-widget-full-screen-preview__img': true,
              'elixirchat-widget-full-screen-preview__img--animated': isSlideAnimation,
            })}
              style={{ marginTop: marginTop }}
              width={displaySize.width}
              height={displaySize.height}
              src={preview.url}
              alt={preview.name}/>
          )}
          {preview.url && preview.previewType === 'video' && (
            <video className="elixirchat-widget-full-screen-preview__video"
              ref={this.video}
              controls={true}
              autoPlay={true}
              // width={previewWidth}
              // height={previewHeight}
              // style={{ marginTop: previewTopMargin }}
              src={preview.url}/>
          )}
        </div>
      </div>
    );
  }
}
