import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-decline-response',
  templateUrl: './decline-response.component.html',
  styleUrls: ['./decline-response.component.scss']
})
export class DeclineResponseComponent implements OnInit {

  constructor(private router:Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  thanksPange(){
    this.router.navigate(['login']);
    this.dialog.closeAll();
    
  }
}
