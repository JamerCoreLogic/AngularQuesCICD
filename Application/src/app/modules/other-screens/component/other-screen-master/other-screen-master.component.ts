import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-other-screen-master',
    templateUrl: './other-screen-master.component.html',
    styleUrls: ['./other-screen-master.component.sass'],
    standalone: false
})
export class OtherScreenMasterComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}
