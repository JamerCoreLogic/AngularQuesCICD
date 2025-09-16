import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getHeartbeat().pipe(
      map((res: any) => {
        const isMaintenanceOn = res[13] === "UnderMaintenance: True";
        if (isMaintenanceOn) {
          return true; // Allow access to the maintenance page
        } else {
          this.router.navigate(['/login']); // Redirect if maintenance is off
          return false;
        }
      })
    );
  }
}