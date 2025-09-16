import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit, OnDestroy {
  private maintenanceInterval: any;
  constructor(private auth:AuthService ,private router:Router) { }

  ngOnInit(): void {
    this.checkMaintenance()
      this.startMaintenanceCheck();
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to prevent memory leaks
    if (this.maintenanceInterval) {
      clearInterval(this.maintenanceInterval);
    }
  }
  checkMaintenance(){
    // if (this.auth.maintenanceHandled) {
    //   return; // Exit early if already handled
    // }
    this.auth.getHeartbeat().subscribe((res:any)=>{
      // console.log(res);
      if (res[13] == "UnderMaintenace: False") {
        this.auth.maintenanceHandled = false;
        this.router.navigate(['/login']);

      }
    })
  }
  startMaintenanceCheck(): void {
    // Schedule `checkMaintenance` to run every 1 minute
    this.maintenanceInterval = setInterval(() => {
      // console.log('Checking maintenance status... in maintenance component');
      this.checkMaintenance();
    }, 9000); // 60000 ms = 1 minute
  }

}

