import { logEvent } from './utils';


export class ScreenshotTaker {

  public debug: boolean = false;
  public mediaOptions: any = {};
  public width: number = 0;
  public height: number = 0;

  protected stream: MediaStream;
  protected canvas: HTMLCanvasElement;
  protected video: HTMLVideoElement;

  constructor({ debug = false }: { debug: boolean }) {
    this.debug = debug;
    this.initialize();
  }

  initialize(){

    this.width = screen.width;
    // this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    // this.video = <HTMLVideoElement>document.getElementById('video');

    this.canvas = document.createElement('canvas');
    this.video = document.createElement('video');

    // this.video.addEventListener('canplay', this.onVideoCanPlay);
  }

  // protected onVideoCanPlay = (e: any) => {
  //   const { video, canvas, width } = this;
  //   this.height = video.videoHeight / (video.videoWidth / width);
  //   video.width = width;
  //   video.height = this.height;
  //   canvas.width = width;
  //   canvas.height = this.height;
  //
  //   setTimeout(() => {
  //     this.captureVideoFrame();
  //   }, 1000);
  // };

  protected setVideoCanvasSize(): void {
    const { video, canvas, width } = this;
    this.height = video.videoHeight / (video.videoWidth / width);

    console.log('___ width, height', width, this.height);

    video.width = width;
    video.height = this.height;
    canvas.width = width;
    canvas.height = this.height;
  }

  protected captureVideoFrame(): { dataUrl: string, file: Blob } {
    const { canvas, width, height, video, stream } = this;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/png');
    const file = this.base64ToFile(dataUrl);
    return { dataUrl, file };
  };

  public takeScreenshot = () => {
    return new Promise((resolve, reject) => {
      try {
        const mediaDevices: any = navigator.mediaDevices;
        mediaDevices.getDisplayMedia(this.mediaOptions)
          .then(captureStream => {
            this.stream = captureStream;
            this.video.srcObject = this.stream;
            this.video.play();

            this.video.addEventListener('canplay', () => {
              this.setVideoCanvasSize();
              setTimeout(() => {
                const screenshot = this.captureVideoFrame();
                this.stream.getTracks()[0].stop();
                logEvent(this.debug, 'Captured screenshot', screenshot);
                resolve(screenshot);
                this.TEMP_openScreenshotInNewTab(screenshot.dataUrl); // TODO: remove once server screenshot upload ready
              }, 600);
            });
          })
          .catch(e => {
            // log
            reject(e);
          })
      }
      catch (e) {
        // log
        reject(e);
      }
    });
  };

  public destroy = (): void => {
    this.video.remove();
    this.canvas.remove();
  };

  public base64ToFile(dataUrl){
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
  protected TEMP_openScreenshotInNewTab(dataUrl){
    const image = new Image();
    image.src = dataUrl;
    const newWindow = window.open('');
    if (newWindow) {
      newWindow.document.write(image.outerHTML);
    }
    else {
      logEvent(this.debug, 'You must allow popups to see the screenshot', { dataUrl }, 'error')
    }
  }
}
