import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submission-received',
  templateUrl: './submission-received.component.html',
  styleUrls: ['./submission-received.component.scss']
})
export class SubmissionReceivedComponent implements OnInit {

  constructor(private router:Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  thanksPange(){
    this.router.navigate(['login']);
    this.dialog.closeAll();
    
  }
  

}
