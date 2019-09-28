import React, { Component } from 'react';
import cn from 'classnames';

export interface IImagePreviewProps {
  elixirChatWidget: any;
}

export interface IImagePreviewState {
  currentPreview: {},
  displaySize: {
    width: number;
    height: number;
  };
  marginTop: number;
  isVisible: boolean;
  isLoading: boolean;
}

export class ImagePreview extends Component<IImagePreviewProps, IImagePreviewState> {

  state = {
    currentPreview: {},
    displaySize: {
      width: 0,
      height: 0,
    },
    marginTop: 0,
    isVisible: false,
    isLoading: false,
  };

  previewHorizontalPaddings = 100;
  previewVerticalPaddings = 120;

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.onIFrameReady(() => {
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('keyup', this.onIframeBodyKeyup);
    });
  }

  componentWillUnmount() {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('keyup', this.onIframeBodyKeyup);
  }

  componentDidUpdate(prevProps) {
    const { preview } = this.props;
    if (prevProps.preview.url !== preview.url) {
      this.setPreview(preview);
    }
  }

  setPreview = (preview) => {
    const { width, height, url } = preview;
    if (preview && url && width && height) {
      const displaySize = this.calculateImagePreviewSize(width, height);
      const marginTop = this.calculateImagePreviewTopMargin(displaySize.height);
      this.setState({
        currentPreview: preview,
        displaySize,
        marginTop,
        isVisible: true,
        isLoading: true,
      });
    }
    else {
      this.setState({
        currentPreview: {},
        displaySize: {
          width: 0,
          height: 0,
        },
        marginTop: 0,
        isVisible: false,
        isLoading: false,
      });
    }
  };

  calculateImagePreviewSize = (imageNativeWidth, imageNativeHeight) => {
    const maxImageWidth = window.innerWidth - this.previewHorizontalPaddings; // window viewport width minus horizontal paddings
    let width = imageNativeWidth;
    let height = imageNativeHeight;
    if (imageNativeWidth > maxImageWidth) {
      const ratio = maxImageWidth / imageNativeWidth;
      width = maxImageWidth;
      height = Math.round(imageNativeHeight * ratio);
    }
    return { width, height };
  };

  calculateImagePreviewTopMargin = (imageDisplayHeight) => {
    const availableVerticalSpace = window.innerHeight - this.previewVerticalPaddings;
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
    const { gallery } = this.props;
    const { isVisible, currentPreview } = this.state;

    if (!isVisible) {
      return false;
    }
    const currentPreviewIndex = gallery.map(image => image.id).indexOf(currentPreview.id);
    let nextPreviewIndex = currentPreviewIndex + delta;
    if (nextPreviewIndex < 0) {
      nextPreviewIndex = gallery.length - 1;
    }
    else if (nextPreviewIndex >= gallery.length) {
      nextPreviewIndex = 0;
    }
    this.setPreview(gallery[nextPreviewIndex]);
  };

  onClose = () => {
    const { onClose } = this.props;
    this.setState({ isVisible: false });
    onClose();
  };

  onImageLoad = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const {
      currentPreview,
      displaySize,
      marginTop,
      isLoading,
      isVisible,
    } = this.state;

    return (
      <div className={cn({
        'elixirchat-widget-image-preview': true,
        'elixirchat-widget-image-preview--visible': isVisible,
      })} onClick={this.onClose}>
        <div className="elixirchat-widget-image-preview__inner">
          {currentPreview.url && (
            <img className={cn({
              'elixirchat-widget-image-preview__img': true,
              'elixirchat-widget-image-preview__img--loading': isLoading,
            })}
              onLoad={this.onImageLoad}
              style={{ marginTop: marginTop }}
              width={displaySize.width}
              height={displaySize.height}
              src={currentPreview.url}
              alt={currentPreview.name}/>
          )}
        </div>
      </div>
    );
  }
}
