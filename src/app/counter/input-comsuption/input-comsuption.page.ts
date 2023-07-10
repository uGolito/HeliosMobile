import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-comsuption',
  templateUrl: './input-comsuption.page.html',
  styleUrls: ['./input-comsuption.page.scss'],
})
export class InputComsuptionPage implements OnInit {
  numValues: string[] = [];
  num2Values: string[] = [];
  joinedValues: any;

  numbers: any[] = [0, 0, 0, 0, 0]; // Tableau pour stocker les nombres
  decimals: number[] = [0, 0, 0]; // Tableau pour stocker les décimales
  index = ['','','','','','',''];

  constructor(private route: Router) { }

  addNumValue(value: string) {
    this.numValues.push(value);
  }

  addNum2Value(value: string) {
    this.num2Values.push(value);
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
    document.getElementById('code'+code)?.focus();    
  }

  maFonction2(code: any) {
    this.index[code] = '';
  }

}
