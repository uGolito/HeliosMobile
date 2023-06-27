// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
// import { NavController } from '@ionic/angular';
// import * as Tesseract from 'tesseract.js';
// import { createWorker } from 'tesseract.js';


// @Component({
//   selector: 'app-consumption-counter',
//   templateUrl: './consumption-counter.page.html',
//   styleUrls: ['./consumption-counter.page.scss'],
// })
// export class ConsumptionCounterPage {
//   ocrResult: string | undefined;
//   worker: Tesseract.Worker | undefined;
//   workerReady = false;
//   image: any;

//   constructor(public navCtrl: NavController, private route: Router) {
//     this.loadWorker();
//    }

//   async takePhoto() {
//     const image = await Camera.getPhoto({
//       quality: 90,
//       allowEditing: true,
//       resultType: CameraResultType.DataUrl,
//       source: CameraSource.Camera,
//     });
//     console.log(image);
//     this.image = image.dataUrl;
//   }
  
//   async loadWorker() {
//     this.worker = await createWorker();
    
//     await this.worker?.loadLanguage('fra');
//     await this.worker?.initialize('fra');

//     this.workerReady = true;
//   }

//   async recognizeImages() {
//   const result = await this.worker?.recognize(this.image);
//   this.ocrResult = result?.data.text.replace(/\D/g, "");
//   const ocrDigits = this.ocrResult?.split('');
//   // Réinitialiser les tableaux des valeurs
//   this.numValues = [];
//   this.num2Values = [];
//   // Remplir les valeurs des numValues
//   if (ocrDigits && ocrDigits.length > 0) {
//     for (let i = 0; i < 6; i++) {
//       if (ocrDigits[i]) {
//         this.numValues.push(ocrDigits[i]);
//       } else {
//         this.numValues.push('0');
//         this.num2Values.push('0');
//       }
//     }
//   }
//   // Remplir les valeurs des num2Values
//   if (ocrDigits && ocrDigits.length >= 6) {
//     for (let i = 6; i < 9; i++) {
//       if (ocrDigits[i]) {
//         this.num2Values.push(ocrDigits[i]);
//       } else {
//         this.num2Values.push('0');
//       }
//     }
//   }
//   // Mettre à jour les valeurs des index utilisées pour les bindings des inputs
//     for (let i = 0; i < this.numValues.length; i++) {
//       this.index[i] = this.numValues[i];
//     }
//     for (let i = 0; i < this.num2Values.length; i++) {
//       this.index[6 + i] = this.num2Values[i];
//     }
//   }   

//   enterDigits() {
//     this.navCtrl.navigateRoot('/input-comsuption');
//   }


//   numValues: string[] = [];
//   num2Values: string[] = [];
//   joinedValues: any;

//   numbers: any[] = [0, 0, 0, 0, 0]; // Tableau pour stocker les nombres
//   decimals: number[] = [0, 0, 0]; // Tableau pour stocker les décimales
//   index = ['','','','','','',''];

//   addNumValue(value: string, index: number) {
//     console.log(value);
//     this.numValues[index] = value;
//   }

//   addNum2Value(value: string, index : number) {
//     this.num2Values[index] = value;
//   }

//   getJoinedValues() {
//     this.joinedValues = this.numValues.join('')+','+this.num2Values.join('');
//     console.log(this.joinedValues);
//   }

//   ngOnInit() {
//   }

//   navigation(url : String) {
//     this.route.navigate(['/'+url]);
//   }

//   maFonction(code: any) {
//     document.getElementById('code'+code);    
//   }

//   maFonction2(code: any) {
//     this.index[code] = '';
//   }

// }

import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { matFromImageData, cvtColor, COLOR_RGBA2GRAY, resize, adaptiveThreshold, bitwise_not, findContours, drawContours, contourArea } from '@techstark/opencv-js';
import * as Tesseract from 'tesseract.js';
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import { createWorker } from 'tesseract.js';


@Component({
  selector: 'app-consumption-counter',
  templateUrl: './consumption-counter.page.html',
  styleUrls: ['./consumption-counter.page.scss'],
})
export class ConsumptionCounterPage implements AfterViewInit {
  @ViewChild('previewCanvas', { static: false }) previewCanvas!: ElementRef;
  ocrResult: any;
  image: any;

  private cameraPreviewOpts: CameraPreviewOptions = {
    position: 'rear',
    parent: 'camera-preview-container',
    width: window.innerWidth,
    height: window.innerHeight,
    toBack: true,
  };

  private captureOpts: CameraPreviewPictureOptions = {
    quality: 90,
  };

  async ngAfterViewInit() {
    await CameraPreview.start(this.cameraPreviewOpts);
  }
  async takePhoto() {
    const cameraPreviewElement = this.previewCanvas.nativeElement;
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    
    if (image.webPath) {
      const imageBlob = await fetch(image.webPath).then(r => r.blob());
      const imageObjectURL = URL.createObjectURL(imageBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const sourceX = 0; // Définissez la position de votre rectangle ici
        const sourceY = 0; // Définissez la position de votre rectangle ici
        const sourceWidth = img.width; // Définissez la taille de votre rectangle ici
        const sourceHeight = 20; // La hauteur de votre rectangle
        const destWidth = sourceWidth;
        const destHeight = sourceHeight;
        const destX = canvas.width / 2 - destWidth / 2;
        const destY = canvas.height / 2 - destHeight / 2;
        context?.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        const finalImage = canvas.toDataURL();
        this.image = finalImage;
      };
      img.src = imageObjectURL;
    }
  }
  
  async recognizeImages() {
    const worker = Tesseract.createWorker({
      logger: m => console.log(m)
    });
    await (await worker).load();
    await (await worker).loadLanguage('fra');
    await (await worker).initialize('fra');
    const { data: { text } } = await (await worker).recognize(this.image);
    this.ocrResult = text.replace(/\D/g,'');
    await (await worker).terminate();
  }

  index = ['','','','','','',''];
  numValues: string[] = [];
  num2Values: string[] = [];
  joinedValues: any;

  addNumValue(value: string, index: number) {
    console.log(value);
    this.numValues[index] = value;
  }

  addNum2Value(value: string, index : number) {
    this.num2Values[index] = value;
  }

  maFonction(code: any) {
    document.getElementById('code'+code);    
  }

  maFonction2(code: any) {
    this.index[code] = '';
  }

  getJoinedValues() {
    this.joinedValues = this.numValues.join('')+','+this.num2Values.join('');
    console.log(this.joinedValues);
}
}


  

