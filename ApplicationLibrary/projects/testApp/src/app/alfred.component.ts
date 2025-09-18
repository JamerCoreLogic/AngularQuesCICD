import { Component, OnInit } from '@angular/core';
import { AQAlfredAlertsService } from 'projects/aqalfred/src/lib/services/alfred-alerts/aqalfred-alerts.service';

@Component({
    selector: 'app-alfred',
    template: `
    <lib-alfred-alrets [DataSource]="AlfredAlerts"></lib-alfred-alrets>
  `,
    styles: [],
    standalone: false
})
export class AlfredComponent implements OnInit {

  AlfredAlerts: any[] = [];

  constructor( private alfredAlerts: AQAlfredAlertsService) { }

  ngOnInit() {   
    this.alfredAlerts.AlfredAlerrts(1,4,0).subscribe(data => {
      this.AlfredAlerts = data.data.alfredAlert;     
    }); 
  }

}
