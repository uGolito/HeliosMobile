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


import '@capacitor-community/camera-preview';


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
    x1: 100,
    y1: 300,
    x2: 550,
    y2: 350
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
      position: 'rear',
      toBack: true
     };
     CameraPreview.start(cameraPreviewOpts);
     this.cameraActive = true;
   }

  base64Image: string | undefined;

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



