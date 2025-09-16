import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communication-footer',
  templateUrl: './communication-footer.component.html',
  styleUrls: ['./communication-footer.component.scss']
})
export class CommunicationFooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

}
