import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import { CropperPosition, LoadedImage, ImageCroppedEvent as LocalImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@awesome-cordova-plugins/camera-preview/ngx';
import 'hammerjs';

export interface ImageCroppedEvent {
  base64?: string;
  file?: File;
  width?: number;
  height?: number;
  cropperPosition?: CropperPosition;
  imagePosition?: CropperPosition;
}

@Component({
  selector: 'app-consumption-counter',
  templateUrl: './consumption-counter.page.html',
  styleUrls: ['./consumption-counter.page.scss'],
})

export class ConsumptionCounterPage {
  ocrResult: string | undefined;
  worker: Tesseract.Worker | undefined;
  workerReady = false;
  image: any;
  showBody = true;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  cameraActive: boolean = false;
  cropper: any;

  constructor(public navCtrl: NavController, private route: Router, private sanitizer: DomSanitizer, private cameraPreview: CameraPreview) {
    this.loadWorker();
   }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    console.log(image);
    this.image = image.dataUrl;
  }
  
  async loadWorker() {
    this.worker = await createWorker();
    
    await this.worker?.loadLanguage('fra');
    await this.worker?.initialize('fra');

    this.workerReady = true;
  }

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
    this.startCameraPreview();
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
  
  imageCropped(event: LocalImageCroppedEvent): void {
    if (event && event.base64 != null) {
      this.croppedImage = event.base64 ?? undefined;
      // event.blob can be used to upload the cropped image
      const imageElement = document.createElement('img');
      imageElement.src = this.croppedImage;
      document.body.appendChild(imageElement);

      this.cameraPreview.stopCamera();
      this.navCtrl.navigateRoot('/comsuption-counter');
    }
  }
  imageLoaded(image: LoadedImage) {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  startCameraPreview() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'rear',
      toBack: true,
      tapPhoto: false,
      tapFocus: false,
      previewDrag: false,
      storeToFile: false,
      disableExifHeaderStripping: false,
    };
    this.cameraPreview.startCamera(cameraPreviewOpts);
    this.cameraActive = true;
  }

  base64Image: string | undefined;

  //async captureImage() {
  //  const imageData: any = await this.cameraPreview.takePicture({ width: 800, height: 600, quality: 85 });
  //  this.base64Image = 'data:image/jpeg;base64,' + imageData;
  
    // Convert base64 image to blob
  //  const fetchRes = await fetch(this.base64Image);
  //  const blob = await fetchRes.blob();
  
    // Create a new file from the blob
  //  const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
  
    // Create a new 'change' event with the file
  //  const event = new Event('change', { bubbles: true });
  //  Object.defineProperty(event, 'target', {
  //    writable: false,
  //    value: { files: [file] }
  //  });
  
    // Trigger the 'change' event
  //  this.fileChangeEvent(event);
  //}
  async captureImage() {
    this.showBody = false;
    // Add code to show overlay or preview
    // For example, you can create an HTML element to display the overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    document.body.appendChild(overlay);

    // Create a cropping rectangle overlay
    const cropperElement = document.createElement('div');
    cropperElement.style.position = 'absolute';
    cropperElement.style.top = '50%';
    cropperElement.style.left = '50%';
    cropperElement.style.transform = 'translate(-50%, -50%)';
    cropperElement.style.width = '80%';
    cropperElement.style.height = '50%';
    cropperElement.style.border = '2px dashed white';
    cropperElement.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    overlay.appendChild(cropperElement);
  
    // Add a button to the overlay
    const captureButton = document.createElement('button');
    captureButton.innerText = 'Capture';
    captureButton.style.position = 'absolute';
    captureButton.style.bottom = '20px';
    captureButton.style.left = '50%';
    captureButton.style.transform = 'translateX(-50%)';
    overlay.appendChild(captureButton);
  
    // Capture the image when the button is clicked
    captureButton.addEventListener('click', async () => {
      // Capture the image
      // Get the position of the cropping rectangle
      const cropperPosition = cropperElement.getBoundingClientRect();

      // Capture the image within the cropping rectangle
      const imageData: any = await this.cameraPreview.takePicture({
        width: cropperPosition.width,
        height: cropperPosition.height,
        quality: 85
      });
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
  
      // Remove the overlay
      document.body.removeChild(overlay);
  
      // Convert base64 image to blob
      const fetchRes = await fetch(this.base64Image);
      const blob = await fetchRes.blob();
  
      // Create a new file from the blob
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
  
      // Create a new 'change' event with the file
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', {
        writable: false,
        value: { files: [file] }
      });
  
      // Trigger the 'change' event
      this.fileChangeEvent(event);
      
      // Crop the image based on the cropper position
      const croppedEvent: ImageCroppedEvent = {
        base64: this.croppedImage,
        file: file,
        width: this.cropper.position?.width ?? 100,
        height: 50,
        cropperPosition: this.cropper.position
      };
      this.imageCropped(croppedEvent as LocalImageCroppedEvent);

      // Close the camera preview
      this.cameraPreview.stopCamera();
      
      // Navigate back to the consumption-counter page
      this.navCtrl.navigateRoot('/consumption-counter');

      this.showBody = true;
    });
  }
}



