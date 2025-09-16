import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';

@Component({
  selector: 'radius-slider',
  templateUrl: './radius-slider.component.html',
  styleUrls: ['./radius-slider.component.scss']
})
export class RadiusSliderComponent implements OnInit {
  // @Output() radiusChange = new EventEmitter<number>();
  radius: number = 25;
  radiusDisplay: string = this.radius + ' miles';
  constructor(private sharedAS:SharedAdjusterService) { }
  ngOnInit(): void {
    this.loadSavedRadius();
  this.sharedAS.radius$.subscribe((radius)=>{
    // console.log(radius)
    this.radius=radius/1609.34;
    this.radiusDisplay = this.radius.toFixed(0) + ' miles';
  })
  }

  loadSavedRadius() {
    const savedFilterState = localStorage.getItem('findAdjusterSearch');
    if (savedFilterState) {
      const savedData = JSON.parse(savedFilterState);
      if (savedData && savedData.radius) {
        // Since the radius is stored in meters, convert it to miles for display
        // but use the stored value (in meters) directly for internal state.
        this.radius = this.sharedAS.convertMetersToMiles(savedData.radius); 
        this.updateRadiusDisplay();
        // No need to convert back to meters before setting because it's already in meters
        this.sharedAS.setRadius(savedData.radius);
      }
    }
  }
  updateRadiusDisplay() {
    this.radiusDisplay = `${this.radius.toFixed(0)} miles`;
  }


  onRadiusChange(newRadius: string | null) { 
    if (newRadius !== null) {

      const radiusInMiles = parseFloat(newRadius); // Convert from string to float
      if (!isNaN(radiusInMiles)) {
        this.radius = radiusInMiles;
        const radiusInMeters = radiusInMiles * 1609.34; // Convert from miles to meters
        // this.radiusChange.emit(radiusInMeters);
        this.sharedAS.setRadius(radiusInMeters)
      }
      this.radiusDisplay = this.radius.toFixed(0) + ' miles';
    }
    }

formatLabel(value: number) {
  if (value >= 1) {
    return value.toFixed(0)  + 'M';
  }
  return value;
}
radiusIncrease() {
  if (this.radius < 1000) {  // Check if radius is below the upper limit
    this.radius = this.radius + 10;
    if (this.radius > 1000) { // Ensure radius doesn't exceed the upper limit
      this.radius = 1000;
    }
    this.radiusDisplay = this.radius.toFixed(0) + ' miles';
    const radiusInMeters = this.radius * 1609.34; // Convert from miles to meters
    // this.radiusChange.emit(radiusInMeters);
    this.sharedAS.setRadius(radiusInMeters)
  }
}

radiusDecrease() {
  if (this.radius > 1) {  // Check if radius is above the lower limit
    this.radius = this.radius - 10;
    if (this.radius < 1) {  // Ensure radius doesn't go below the lower limit
      this.radius = 1;
    }
    this.radiusDisplay = this.radius.toFixed(0) + ' miles';
    const radiusInMeters = this.radius * 1609.34; // Convert from miles to meters
    // this.radiusChange.emit(radiusInMeters);
    this.sharedAS.setRadius(radiusInMeters)
  }
}



onKeyDown(event: KeyboardEvent) {
  // Allow numeric keys, backspace, and delete
  if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Tab' || (event.key >= '0' && event.key <= '9')) {
    return;
  }
  event.preventDefault();
}


}
