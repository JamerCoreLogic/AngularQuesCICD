import { Injectable } from '@angular/core';
import { IPopup } from './popup';
import { Subject } from 'rxjs';
import { DialogService } from '../aq-dialog/dialog.service';
import { NewPopupComponent } from './newPopup.component';


@Injectable({
  providedIn: 'root'
})
export class PopupService {


  constructor(
    private dialogService: DialogService
  ) {

  }

  popupMessage = new Subject<IPopup>();

  response = new Subject<Boolean>();

  show(heading: string, message: string) {
    this.popupMessage.next({ heading: heading, message: message, display: true });
  }

  showPopup(title, message) {
    const ref = this.dialogService.open(NewPopupComponent, {
      data: {
        "title": title,
        "message": message
      }
    });
    return ref;
  }

}
