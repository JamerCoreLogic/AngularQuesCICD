import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from '../StaticVariable';
import { AuthService } from './auth.service';
declare global {
  interface Window {
    initMap: () => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private loaded = new BehaviorSubject<boolean>(false);
  private GOOGLE_MAPS_API_URL = AppSettings.googleMapsApiKey;
  private apiKey: string;

  constructor(private auth: AuthService) {
    this.initializeGoogleMaps();
  }

  private initializeGoogleMaps(): void {
    this.auth.getHeartbeat().subscribe((res: any) => {
      if (res[14]) {
        this.apiKey = `${this.GOOGLE_MAPS_API_URL}${res[14].split(':')[1].trim()}&callback=initMap`;
        console.log("Google Maps API URL configured:", this.apiKey);
        this.loadGoogleMaps();
      } else {
        console.error("Google Maps API key not found in heartbeat response");
      }
    });
  }

  private loadGoogleMaps(): void {
    if (window['google'] && window['google']['maps']) {
      // Google Maps is already loaded
      this.loaded.next(true);
    } else {
      // Load Google Maps script
      const script = document.createElement('script');
      script.src = this.apiKey;
      script.async = true;
      script.defer = true;
      window.initMap = () => this.loaded.next(true);
      document.head.appendChild(script);
    }
  }

  public onGoogleMapsLoaded(): Observable<boolean> {
    return this.loaded.asObservable();
  }
}
