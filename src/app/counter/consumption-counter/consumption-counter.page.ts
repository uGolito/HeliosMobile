import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';


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

  constructor(public navCtrl: NavController, private route: Router) {
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

}



