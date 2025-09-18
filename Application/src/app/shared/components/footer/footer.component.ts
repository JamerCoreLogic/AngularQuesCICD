import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass'],
  standalone: false
})
export class FooterComponent implements OnInit {

  appVersion;
  formanizer;
  amplify;
  chatbot;
  identifier: any
  environment = environment;
  constructor(private _router: Router) {
    this.appVersion = environment.AppVersion;
    this.formanizer = environment.formanizer;
    this.amplify = environment.Amplify;
    this.chatbot = environment.Chatbot
  }

  ngOnInit() {
    let host = window.location.host;
    if (host.includes('localhost')) {
      host = 'convelo.agenciiq.net';
    }
    this.identifier = host;
  }



}
