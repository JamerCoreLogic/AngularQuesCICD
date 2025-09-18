import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading = new Subject<boolean>();
  show() {
    this.isLoading.next(false);
  }
  hide() {
      this.isLoading.next(true);
  }

  constructor() { 
    // this.isLoading.subscribe(data => 
    //   console.log('Is Loader : ',data)
    //   );
  }
}
