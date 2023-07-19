import { Component, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import { CropperPosition, LoadedImage, ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
//import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@awesome-cordova-plugins/camera-preview/ngx';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import 'hammerjs';


//import '@capacitor-community/camera-preview';


@Component({
  selector: 'app-consumption-counter',
  templateUrl: './consumption-counter.page.html',
  styleUrls: ['./consumption-counter.page.scss'],
})



export class ConsumptionCounterPage {
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent | any;
  ocrResult: string | undefined;
  worker: Tesseract.Worker | undefined;
  workerReady = false;
  image: any;
  showBody = true;
  //showCropper = false;
  

  imageChangedEvent: any = '';
  croppedImage: any = '';

  cameraActive: boolean = false;
  //, private cameraPreview: CameraPreview
  constructor(public navCtrl: NavController, 
              private route: Router, 
              private sanitizer: DomSanitizer, 
              private el : ElementRef, 
              private renderer: Renderer2) {
    //this.loadWorker();
  }

  openCamera() {
    const options: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview',
      toBack: true
    };
    CameraPreview.start(options);
    // const intervalId = setInterval(() => {
    //   const element = this.el.nativeElement.querySelector('#video');
    //   if (element) {
    //     clearInterval(intervalId);
    //     this.renderer.setStyle(element, 'height', '60%');
    //     this.renderer.setStyle(element, 'top', '0');
    //     this.renderer.setStyle(element, 'position', 'absolute');
    //   }
    // }, 200);
    
    this.cameraActive = true;
    this.showBody = true;
  }

  // async takePhoto() {
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: false,
  //     resultType: CameraResultType.DataUrl,
  //     source: CameraSource.Camera,
  //   });
    
  //   this.image = image.dataUrl;
  //   console.log(this.image);
  // }
  
  async loadWorker() {
      this.worker = await createWorker();
      await this.worker?.loadLanguage('eng');
      await this.worker?.initialize('eng');

  };

  async recognizeCropped() {
    if (this.worker) {
      const imageUrl = this.croppedImage.changingThisBreaksApplicationSecurity;
      const result = await this.worker?.recognize(imageUrl);
      console.log(result);
      this.ocrResult = result?.data.text.replace(/\D/g, "");
      const ocrDigits = this.ocrResult?.split('');
      // Réinitialiser les tableaux des valeurs
      this.numValues = [];
      this.num2Values = [];
      // Remplir les valeurs des numValues
      if (ocrDigits && ocrDigits.length > 0) {
        for (let i = 0; i < 6; i++) {
          if (ocrDigits[i]) {
            this.numValues.push(ocrDigits[i]);
          } else {
            this.numValues.push('0');
            this.num2Values.push('0');
          }
        }
      }
      // Remplir les valeurs des num2Values
      if (ocrDigits && ocrDigits.length >= 6) {
        for (let i = 6; i < 9; i++) {
          if (ocrDigits[i]) {
            this.num2Values.push(ocrDigits[i]);
          } else {
            this.num2Values.push('0');
          }
        }
      }
      // Mettre à jour les valeurs des index utilisées pour les bindings des inputs
      for (let i = 0; i < this.numValues.length; i++) {
        this.index[i] = this.numValues[i];
      }
      for (let i = 0; i < this.num2Values.length; i++) {
        this.index[6 + i] = this.num2Values[i];
      }
    }
  };

  async recognizeImages() {
    const result = await this.worker?.recognize(this.image);
    this.ocrResult = result?.data.text.replace(/\D/g, "");
    const ocrDigits = this.ocrResult?.split('');
    // Réinitialiser les tableaux des valeurs
    this.numValues = [];
    this.num2Values = [];
    // Remplir les valeurs des numValues
    if (ocrDigits && ocrDigits.length > 0) {
      for (let i = 0; i < 6; i++) {
        if (ocrDigits[i]) {
          this.numValues.push(ocrDigits[i]);
        } else {
          this.numValues.push('0');
          this.num2Values.push('0');
        }
      }
    }
    // Remplir les valeurs des num2Values
    if (ocrDigits && ocrDigits.length >= 6) {
      for (let i = 6; i < 9; i++) {
        if (ocrDigits[i]) {
          this.num2Values.push(ocrDigits[i]);
        } else {
          this.num2Values.push('0');
        }
      }
    }
    // Mettre à jour les valeurs des index utilisées pour les bindings des inputs
      for (let i = 0; i < this.numValues.length; i++) {
        this.index[i] = this.numValues[i];
      }
      for (let i = 0; i < this.num2Values.length; i++) {
        this.index[6 + i] = this.num2Values[i];
      }
  }   

  enterDigits() {
    this.navCtrl.navigateRoot('/input-comsuption');
  }

  cropperPositions: CropperPosition = {
    x1: 50,
    y1: 50,
    x2: 50,
    y2: 50
  }

  getOverlayStyles() {
    return {
      'top': this.cropperPositions.y1 + 'px',
      'left': this.cropperPositions.x1 + 'px',
      'width': (this.cropperPositions.x2 - this.cropperPositions.x1) + 'px',
      'height': (this.cropperPositions.y2 - this.cropperPositions.y1) + 'px'
    };
  }

  numValues: string[] = [];
  num2Values: string[] = [];
  joinedValues: any;

  numbers: any[] = [0, 0, 0, 0, 0]; // Tableau pour stocker les nombres
  decimals: number[] = [0, 0, 0]; // Tableau pour stocker les décimales
  index = ['','','','','','',''];

  addNumValue(value: string, index: number) {
    console.log(value);
    this.numValues[index] = value;
  }

  addNum2Value(value: string, index : number) {
    this.num2Values[index] = value;
  }

  getJoinedValues() {
    this.joinedValues = this.numValues.join('')+','+this.num2Values.join('');
    console.log(this.joinedValues);
  }

  ngOnInit() {
    //this.startCameraPreview();
  }

  navigation(url : String) {
    this.route.navigate(['/'+url]);
  }

  maFonction(code: any) {
    document.getElementById('code'+code);    
  }

  maFonction2(code: any) {
    this.index[code] = '';
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || event.base64 || '');
    console.log(this.croppedImage);
  }

  imageLoaded(image: LoadedImage) {
      setTimeout(() => {
        this.cropperPositions = {
          x1: 100,
          y1: 300,
          x2: 550,
          y2: 350
        };
      },2);
  }
  
  cropperReady() {
      // cropper ready
  }

  loadImageFailed() {
      // show message
  }

  crop () {
    if (this.imageCropper) {
      this.imageCropper.crop();
    }
  }

  startCameraPreview() {
     const cameraPreviewOpts: CameraPreviewOptions = {
      parent: 'cameraPreview',
      className: 'cameraPreview',
      position: 'rear'
     };
     CameraPreview.start(cameraPreviewOpts);
     this.cameraActive = true;
   }

  base64Image: string | undefined;


//   async captureImage() {
//     this.showBody = false;
//     this.cameraActive = true;
    
//     // Add code to show overlay or preview
//     // Create overlay
//     // Create overlay
// const overlay = document.createElement('div');
// overlay.style.position = 'absolute';
// overlay.style.top = '0';
// overlay.style.left = '0';
// overlay.style.width = '100%';
// overlay.style.height = '100%';
// overlay.style.background = `radial-gradient(circle at ${this.cropperPositions.x1}px ${this.cropperPositions.y1}px, transparent, rgba(0, 0, 0, 0.7))`;
    
//     // Create hole for cropper
//     const hole = document.createElement('div');
//     hole.style.position = 'absolute';
//     hole.style.top = `${this.cropperPositions.y1}px`;
//     hole.style.left = `${this.cropperPositions.x1}px`;
//     hole.style.width = `${this.cropperPositions.x2 - this.cropperPositions.x1}px`;
//     hole.style.height = `${this.cropperPositions.y2 - this.cropperPositions.y1}px`;
//     hole.style.backgroundColor = 'transparent';
    
//     overlay.appendChild(hole);
//     document.body.appendChild(overlay);
  
//      // Add a button to the overlay
//      const captureButton = document.createElement('button');
//      captureButton.innerText = 'Capture';
//      captureButton.style.position = 'absolute';
//      captureButton.style.bottom = '20px';
//      captureButton.style.left = '50%';
//      captureButton.style.transform = 'translateX(-50%)';
//      overlay.appendChild(captureButton);

  
//      // Capture the image when the button is clicked
//     captureButton.addEventListener('click', async () => {
//   //     // Capture the image
//   //     // Get the position of the cropping rectangle
//   //     const cropperPosition = cropperElement.getBoundingClientRect();

//        // Capture the image within the cropping rectangle
//       const image: any = await this.cameraPreview.takePicture({
//         width: 800,
//         height: 600,
//         quality: 85
//       });
//       this.image = 'data:image/jpeg;base64,' + image;

//            // Convert base64 image to blob
//        //const fetchRes = await fetch(this.base64Image);
//        //const blob = await fetchRes.blob();

//        // Convert blob to data URL
//        //this.imageChangedEvent = blob;


//       // Remove the overlay
//       document.body.removeChild(overlay);

//       this.cameraActive = false;
//       this.cameraPreview.stopCamera();
//     });
//  }

  async stopCamera() {
    await CameraPreview.stop();
    this.cameraActive = false;
    this.showBody = true;
  }

  async captureImage() {
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 90,
    };

    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    this.image = `data:image/jpeg;base64,${result.value}`;
    this.stopCamera();
    this.showBody = true;
  }
}



