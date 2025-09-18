import { Injectable } from '@angular/core';
import { AQDialogModule } from './aqdialog.module';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AQDialogService {

   DialogMessage = new Subject<boolean>();
   Response = new Subject<Boolean>();

  constructor() {

  }

  ShowDialog() {
    this.DialogMessage.next(true);  
  }


}
