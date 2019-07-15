export interface IScreenshot {
  dataUrl: string,
  file: File,
}

export class ScreenshotTaker {

  public mediaOptions: any = {};
  public width: number = 0;
  public height: number = 0;

  protected stream: MediaStream;
  protected canvas: HTMLCanvasElement;
  protected video: HTMLVideoElement;

  constructor() {
    this.initialize();
  }

  initialize(): void {
    this.width = screen.width;
    this.canvas = document.createElement('canvas');
    this.video = document.createElement('video');
  }

  protected setVideoCanvasSize(): void {
    const { video, canvas, width } = this;
    this.height = video.videoHeight / (video.videoWidth / width);
    video.width = width;
    video.height = this.height;
    canvas.width = width;
    canvas.height = this.height;
  }

  protected captureVideoFrame(): IScreenshot {
    const { canvas, width, height, video } = this;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/png');
    const file = this.base64ToFile(dataUrl);
    return { dataUrl, file };
  };

  protected stopMediaStream(): void {
    this.stream.getTracks()[0].stop();
  }

  protected getMediaStream(): Promise<MediaStream> {
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
    return new Promise((resolve, reject) => {
      this.getMediaStream().then(stream => {
        this.stream = stream;
        this.video.srcObject = this.stream;
        this.video.oncanplay = () => {
          this.setVideoCanvasSize();
          setTimeout(() => {
            const screenshot: IScreenshot = this.captureVideoFrame();
            this.stopMediaStream();
            this.openScreenshotInNewTab(screenshot.dataUrl);
            resolve(screenshot);
          }, 500);
        };
        this.video.play();
      }).catch(reject);
    });
  };

  public base64ToFile(dataUrl: string): File {
    const blobBin = atob(dataUrl.split(',')[1]);
    const blobArray = [];
    for (let i = 0; i < blobBin.length; i++) {
      blobArray.push(blobBin.charCodeAt(i));
    }
    const blob = new Blob([ new Uint8Array(blobArray) ], {
      type: 'image/png'
    });
    const fileName = `Screenshot ${new Date().toLocaleString()}.png`;
    return new File([blob], fileName);
  }

  // TODO: remove once server screenshot upload ready
  protected openScreenshotInNewTab(dataUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = dataUrl;
      const newTab = window.open('');
      if (newTab) {
        newTab.document.body.appendChild(image);
        image.setAttribute('width', '100%');
        resolve();
      }
      else {
        reject({
          message: 'You must allow popups to see the screenshot'
        });
      }
    });
  }
}