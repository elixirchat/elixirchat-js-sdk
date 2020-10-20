import { ElixirChat } from './ElixirChat';
import { detectPlatform } from '../utilsCommon';
import { WIDGET_SCREENSHOT_REQUEST_ERROR, WIDGET_SCREENSHOT_REQUEST_SUCCESS } from '../widget/ElixirChatWidgetEventTypes';

export interface IScreenshot {
  dataUrl: string,
  file: File,
}

export class ScreenshotTaker {

  public mediaOptions: any = {
    video: {
      width: screen.width * window.devicePixelRatio,
      height: screen.height * window.devicePixelRatio,
    },
  };
  public width: number = 0;
  public height: number = 0;

  public elixirChat: ElixirChat;
  public stream: MediaStream;
  public canvas: HTMLCanvasElement;
  public video: HTMLVideoElement;

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
    this.initialize();
  }

  initialize(): void {
    this.width = screen.width * window.devicePixelRatio;
    this.canvas = document.createElement('canvas');
    this.video = document.createElement('video');
  }

  private setVideoCanvasSize(): void {
    const { video, canvas, width } = this;
    this.height = video.videoHeight / (video.videoWidth / width);
    video.width = width;
    video.height = this.height;
    canvas.width = width;
    canvas.height = this.height;
  }

  private captureVideoFrame(): IScreenshot {
    const { canvas, width, height, video } = this;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/png');
    const file = this.base64ToFile(dataUrl);
    return { dataUrl, file };
  };

  private stopMediaStream(): void {
    this.stream.getTracks()[0].stop();
  }

  private getMediaStream(): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      try {
        const mediaDevices: any = navigator.mediaDevices;
        mediaDevices.getDisplayMedia(this.mediaOptions)
          .then(resolve)
          .catch(reject);
      }
      catch (e) {
        reject({
          message: 'MediaDevices.getDisplayMedia is not supported in this browser'
        });
      }
    });
  }

  public takeScreenshot = (): Promise<IScreenshot> => {
    const { triggerEvent } = this.elixirChat;

    return new Promise((resolve, reject) => {
      this.getMediaStream()
        .then(stream => {
          this.stream = stream;
          this.video.srcObject = this.stream;

          this.video.oncanplay = () => {
            this.setVideoCanvasSize();

            setTimeout(() => {
              const screenshot: IScreenshot = this.captureVideoFrame();
              this.stopMediaStream();
              triggerEvent(WIDGET_SCREENSHOT_REQUEST_SUCCESS, screenshot);
              resolve(screenshot);
            }, 500);
          };
          this.video.play();
        })
        .catch(error => {
          triggerEvent(WIDGET_SCREENSHOT_REQUEST_ERROR, error);
          reject(error);
        });
    });
  };

  public base64ToFile(dataUrl: string): File {
    const blobBin = atob(dataUrl.split(',')[1]);
    const blobArray = [];
    for (let i = 0; i < blobBin.length; i++) {
      blobArray.push(blobBin.charCodeAt(i));
    }
    const blob = new Blob([ new Uint8Array(blobArray) ]);
    const fileName = `Screenshot ${new Date().toLocaleString()}.png`;

    return new File([blob], fileName, {
      type: 'image/png',
    });
  }
}


export function getScreenshotCompatibilityFallback(): null | { pressKey: null | string } {
  let getDisplayMedia;
  try {
    getDisplayMedia = navigator.mediaDevices.getDisplayMedia;
  }
  catch (e) {}

  if (getDisplayMedia) {
    return null;
  }
  else {
    const platform = detectPlatform();

    if (platform.isMac) {
      return {
        pressKey: 'Cmd+Control+Shift+3',
      }
    }
    else if (platform.isWindows) {
      return {
        pressKey: 'PrtSc',
        pressKeySecondary: 'Fn+PrtSc'
      };
    }
    else {
      return {
        pressKey: null,
      };
    }
  }
}
