import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear:any
  versionData: any

  constructor(private LS:AuthService) { }

  ngOnInit(): void {
    this.currentYear=(new Date()).getFullYear()
    this.versionDetails()
    
  }
  versionDetails(){
    this.LS.getHeartbeat().subscribe((data:any)=>{
      this.versionData=data[11]
    })
  }

 

}
