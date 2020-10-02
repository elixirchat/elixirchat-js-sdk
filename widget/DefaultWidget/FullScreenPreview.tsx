import React, { Component } from 'react';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { cn } from '../../utilsCommon';
import { fitDimensionsIntoLimits, isWithinElement } from '../../utilsWidget';
import {
  WIDGET_FULLSCREEN_PREVIEW_CLOSE,
  WIDGET_FULLSCREEN_PREVIEW_OPEN,
  WIDGET_IFRAME_READY,
} from '../ElixirChatWidgetEventTypes';

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

  horizontalPaddings: number = 100;
  verticalPaddings: number = 80;

  video = React.createRef();
  inner = React.createRef();
  nav = React.createRef();

  componentDidMount() {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.on(WIDGET_FULLSCREEN_PREVIEW_OPEN, ({ preview, sender, gallery }) => {
      this.setState({ preview, sender, gallery, isVisible: true });
      this.updatePreviewDimensions(preview);
      this.animateSlide();
    });
    elixirChatWidget.on(WIDGET_IFRAME_READY, () => {
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('keyup', this.onKeyNavigation);
    });
    document.body.addEventListener('keyup', this.onKeyNavigation);
  }

  componentWillUnmount() {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('keyup', this.onKeyNavigation);
    document.body.removeEventListener('keyup', this.onKeyNavigation);
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
    const maxPreviewWidth = window.innerWidth - this.horizontalPaddings;
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
    const maxPreviewWidth = window.innerWidth - this.horizontalPaddings;
    const maxPreviewHeight = window.innerHeight - this.verticalPaddings;
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
    const availableVerticalSpace = window.innerHeight - this.verticalPaddings;
    if (availableVerticalSpace < previewHeight) {
      return 0;
    }
    else {
      return (availableVerticalSpace - previewHeight) / 2;
    }
  };

  onKeyNavigation = (e) => {
    const { preview } = this.state;

    if (e.key === 'Escape') {
      this.closePreview();
    }
    else if (e.key === 'ArrowLeft' && preview.previewType !== 'video') {
      this.navigateToFollowingPreview(-1);
    }
    else if (e.key === 'ArrowRight' && preview.previewType !== 'video') {
      this.navigateToFollowingPreview(1);
    }
  };

  navigateToFollowingPreview = (delta) => {
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

  closePreview = () => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.triggerEvent(WIDGET_FULLSCREEN_PREVIEW_CLOSE);
    this.setState({ isVisible: false });
  };

  onContainerClick = (e) => {
    const isWithinInner = isWithinElement(e.target, this.inner.current);
    const isWithinNav = isWithinElement(e.target, this.nav.current);
    if (!isWithinInner && !isWithinNav) {
      this.closePreview();
    }
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
      })} onClick={this.onContainerClick}>

        <div ref={this.nav}>
          <span
            className="elixirchat-widget-full-screen-preview__nav elixirchat-widget-full-screen-preview__nav--prev"
            onClick={() => this.navigateToFollowingPreview(-1)}>
            <i className="elixirchat-widget-full-screen-preview__nav-icon icon-chevron-down"/>
          </span>
          <span
            className="elixirchat-widget-full-screen-preview__nav elixirchat-widget-full-screen-preview__nav--next"
            onClick={() => this.navigateToFollowingPreview(1)}>
            <i className="elixirchat-widget-full-screen-preview__nav-icon icon-chevron-down"/>
          </span>
        </div>

        <div className="elixirchat-widget-full-screen-preview__inner"
          ref={this.inner}
          style={{ marginTop: previewTopMargin }}>
          {preview.url && preview.previewType === 'image' && (
            <img className={cn({
              'elixirchat-widget-full-screen-preview__img': true,
              'elixirchat-widget-full-screen-preview__img--animated': isSlideAnimation,
            })}
              width={previewWidth}
              height={previewHeight}
              src={preview.url}
              alt={preview.name}
              onClick={this.closePreview}/>
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
              src={preview.url}/>
          )}
        </div>
      </div>
    );
  }
}
