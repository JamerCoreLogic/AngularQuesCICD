import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AQSessionService {

  constructor() { }

  clearSession(): boolean {
    sessionStorage.clear();
    return true;
}

}
