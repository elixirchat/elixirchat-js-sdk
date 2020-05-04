import React, { Component } from 'react';
import cn from 'classnames';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { IMAGE_PREVIEW_CLOSE, IMAGE_PREVIEW_OPEN, WIDGET_IFRAME_READY } from '../ElixirChatWidgetEventTypes';
import { fitDimensionsIntoLimits } from '../../utilsWidget';

export interface IFullScreenPreviewProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IFullScreenPreviewState {
  preview: object,
  gallery: Array<object>,
  previewWidth: number,
  previewHeight: number,
  previewTopMargin: number,
  isVisible: boolean;
  isSlideAnimation: boolean;
}

export class FullScreenPreview extends Component<IFullScreenPreviewProps, IFullScreenPreviewState> {

  state = {
    preview: {},
    gallery: [],
    previewWidth: 0,
    previewHeight: 0,
    previewTopMargin: 0,
    isVisible: false,
    isSlideAnimation: false,
  };

  HORIZONTAL_PADDINGS = 100;
  VERTICAL_PADDINGS = 80;

  video = React.createRef();

  componentDidMount() {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.on(WIDGET_IFRAME_READY, () => {
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('keyup', this.onIframeBodyKeyup);
    });

    elixirChatWidget.on(IMAGE_PREVIEW_OPEN, (preview, gallery) => {
      this.setState({ preview, gallery, isVisible: true });
      this.updatePreviewDimensions(preview);
      this.animateSlide();
    });
  }

  componentWillUnmount() {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('keyup', this.onIframeBodyKeyup);
  }

  updatePreviewDimensions = (preview) => {
    if (preview.previewType === 'image') {
      this.setImageDimensions(preview);
    }
    else if (preview.previewType === 'video') {
      this.setVideoDimensions(preview);
    }
  };

  setImageDimensions = (preview) => {
    const { width, height } = preview;
    const maxPreviewWidth = window.innerWidth - this.HORIZONTAL_PADDINGS;
    const [ previewWidth, previewHeight ] = fitDimensionsIntoLimits(width, height, maxPreviewWidth, null);
    const previewTopMargin = this.calculatePreviewTopMargin(previewHeight);
    this.setState({
      isLoading: false,
      previewWidth,
      previewHeight,
      previewTopMargin,
    });
  };

  setVideoDimensions = (preview) => {
    const { width, height } = preview;
    const maxPreviewWidth = window.innerWidth - this.HORIZONTAL_PADDINGS;
    const maxPreviewHeight = window.innerHeight - this.VERTICAL_PADDINGS;
    const [ previewWidth, previewHeight ] = fitDimensionsIntoLimits(width, height, maxPreviewWidth, maxPreviewHeight);
    const previewTopMargin = this.calculatePreviewTopMargin(previewHeight);
    this.setState({
      isLoading: false,
      previewWidth,
      previewHeight,
      previewTopMargin,
    }, () => {
      this.video.current.focus();
    });
  };

  calculatePreviewTopMargin = (previewHeight) => {
    const availableVerticalSpace = window.innerHeight - this.VERTICAL_PADDINGS;
    if (availableVerticalSpace < previewHeight) {
      return 0;
    }
    else {
      return (availableVerticalSpace - previewHeight) / 2;
    }
  };

  onIframeBodyKeyup = (e) => {
    if (e.key === 'Escape') {
      this.onClose();
    }
    else if (e.key === 'ArrowLeft') {
      this.onArrowNavigation(-1);
    }
    else if (e.key === 'ArrowRight') {
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
      previewWidth,
      previewHeight,
      previewTopMargin,
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
              width={previewWidth}
              height={previewHeight}
              style={{ marginTop: previewTopMargin }}
              src={preview.url}
              alt={preview.name}/>
          )}
          {preview.url && preview.previewType === 'video' && (
            <video  className={cn({
              'elixirchat-widget-full-screen-preview__video': true,
              'elixirchat-widget-full-screen-preview__video--animated': isSlideAnimation,
            })}
              ref={this.video}
              controls={true}
              autoPlay={true}
              width={previewWidth}
              height={previewHeight}
              style={{ marginTop: previewTopMargin }}
              src={preview.url}/>
          )}
        </div>
      </div>
    );
  }
}
