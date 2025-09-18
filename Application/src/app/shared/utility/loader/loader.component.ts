import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
    selector: 'app-loader',
    template: `
  <div class="loader" [hidden]="isloading">
  <img src="assets/images/loader.gif" alt="loader image" />
  </div>
  `,
    styles: [`
    
  `],
    standalone: false
})
export class LoaderComponent implements OnInit {

  isloading: boolean = true;

  constructor(
    private _loaderService: LoaderService
  ) { }

  ngOnInit() {
    this._loaderService.isLoading.subscribe(resp => {
     
      this.isloading = resp;    
    })
  }
}
