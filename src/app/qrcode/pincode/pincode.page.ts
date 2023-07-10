import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket/socket.service';
import { DataService } from '../../services/data/data.service';
import { first } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.page.html',
  styleUrls: ['./pincode.page.scss'],
})
export class PincodePage implements OnInit {
  code :any;
  myResponse : any;
  zoneSubscription!: Subscription;
  pincode = ['','','','']

  constructor(private route: Router, private dataService: DataService, private socketService : SocketService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.code = this.dataService.zoneId;
  }

  onConfirm() {
    let codePin = this.pincode.join(""); 
    this.dataService.apiRequest('building/single', { 'zoneId' : '61714a7923ccb226672366a6', 'pincode' : codePin}).pipe(first()).subscribe(response => {
      if (response['message'].status == 401) {
        this.snackBar.open('Le code PIN n\'est pas bon', 'OK', {duration: 3000});
      }
      if (response['message'].status == 200) {
        this.dataService.buildingDetails.next(response['message']);
        this.myResponse = response['message'].zone;
        this.socketService.zoneSubscribe([this.myResponse._id]);
        //this.route.navigate(['/thermostat']);
        this.route.navigate(['consumption-counter']);
      }
    })    
  }

  navigation(url : String) {
    this.route.navigate(['/'+url]);
  }

  maFonction(code: any) {
    document.getElementById('code'+code)?.focus();    
  }

  maFonction2(code: any) {
    this.pincode[code] = '';
  }
}

