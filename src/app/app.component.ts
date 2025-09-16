import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Adjuster locator';
  private maintenanceInterval: any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // console.log('App component initialized');
    this.startMaintenanceCheck();
  }
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to prevent memory leaks
    if (this.maintenanceInterval) {
      clearInterval(this.maintenanceInterval);
    }
  }

  checkMaintenance(): void {
    this.auth.getHeartbeat().subscribe((res: any) => {
      // console.log(res);
      if (res[13] === "UnderMaintenace: True") {
        Swal.fire({
          icon: 'error',
          title: 'Maintenance',
          text: 'The application is currently under maintenance. Please try again later.',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ffa022'
        }).then((result) => {
          if (result.isConfirmed) {
            this.auth.maintenanceHandled = true;
            this.router.navigate(['/maintenance']);
          }
        })
      }
    });
  }

  startMaintenanceCheck(): void {
    // Schedule `checkMaintenance` to run every 1 minute
    this.maintenanceInterval = setInterval(() => {
      // console.log('Checking maintenance status... in maintenance component');
      this.checkMaintenance();
    }, 60000); // 60000 ms = 1 minute
  }
}
