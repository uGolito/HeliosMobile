import { Component, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import { CropperPosition, LoadedImage, ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
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
  photoTaken = false;
  cropPosition = {x1: 100, y1: 50, x2: 300, y2: 200};
  
  imageChangedEvent: any = '';
  croppedImage: any = '';

  cameraActive: boolean = false;
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
    
    this.cameraActive = true;
    this.showBody = true;
  }

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
    if (this.photoTaken) {
      setTimeout(() => {
        this.cropPosition = {
          x1: 100,
          y1: 50,
          x2: 300,
          y2: 200
        };
      },2);
    }
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

    // Attendez que l'image soit chargée
  let image = new Image();
  image.onload = () => {
    // Mettez à jour le imageChangedEvent avec le nouvel événement
    let event = {
      target: {
        files: [this.dataURLtoFile(this.image, 'captured.jpg')],
      },
    };
    this.imageChangedEvent = event;
    
    // Attendre que le cropper soit prêt puis effectuer le rognage
    setTimeout(() => this.crop(), 2000);
  }
  image.src = this.image;

  this.stopCamera();
  this.showBody = true;
  this.photoTaken = true;
  }

  dataURLtoFile(dataurl: any, filename: any) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], filename, {type:mime});
  }
}



