import { Component, OnInit,Input,OnChanges,SimpleChanges,ViewChild,AfterViewInit,ChangeDetectorRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { GoogleMap,MapCircle, MapInfoWindow, MapMarker } from '@angular/google-maps'
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';
import {MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LossViewProfileComponent } from '../loss-view-profile/loss-view-profile.component';
interface EnhancedMarker extends google.maps.LatLngLiteral {
  name: string;
  location: string;
  email: string;
  distance: number;
  userId: string;
  fileTracId: number;
  userTypeName: string;
  isHovered?: boolean;
  isSelected?: boolean;
  icon?: any;
  homeLat?: number;
  homeLng?: number;
  homeIcon?: any; 
  homeDistance?:number;
  deploymentInfo?: {
    address: string,
    city: string,
    state: string,
    zip: string,
    country: string
  } | any;
  mobile?: string;
}
@Component({
  selector: 'loss-map-view',
  templateUrl: './loss-map-view.component.html',
  styleUrls: ['./loss-map-view.component.scss']
})
export class LossMapViewComponent  implements OnInit,AfterViewInit {
  @Input() center!: google.maps.LatLngLiteral;
  @Input() circleCenter!: google.maps.LatLngLiteral;
  @Input() radius!: number;
  // @Input() markerPositions: google.maps.LatLngLiteral[]= [];
  @Input() set markerPositions(markers: EnhancedMarker[]) {
    this._markerPositions = markers.map(marker => ({
      ...marker,
      icon: this.getMarkerIcon(marker), // Initialize icon based on type and state
      homeIcon: marker.homeLat && marker.homeLng ? this.getHomeIcon(marker) : undefined ,
      deploymentInfo: marker.homeLat && marker.homeLng ? {
        address: marker.deploymentInfo?.address,
        city: marker.deploymentInfo.city,
        state: marker.deploymentInfo.state,
        zip: marker.deploymentInfo.zip,
        country: marker.deploymentInfo.country
      } : undefined
    
    }));
    this.cdr.markForCheck(); // Update the view
    // console.log("_markerPositions",this._markerPositions);
    
  }
  get markerPositions(): EnhancedMarker[] {
    return this._markerPositions;
  }
  private _markerPositions: EnhancedMarker[] = [];
  @Input() zoom!: number;
  @Input() options!: google.maps.MapOptions;
  @Input() adjusters: any[] = [];
  @Output() markerPositionsUpdated: EventEmitter<google.maps.LatLngLiteral[]> = new EventEmitter();
  @Output() radiusValue: EventEmitter<any> = new EventEmitter();
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('circle') circle!: MapCircle;
  @ViewChild(GoogleMap) map!: GoogleMap;
  legends: { name: string; icon: string }[] = [];
  circleOptions: google.maps.CircleOptions = {
    strokeColor: '#00b1c3',
    strokeOpacity: .4,
    editable: true,
  };
  centerMarkerIcon = {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    fillColor: 'yellow',
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 5

};


selectedAdjuster: any;
  infoWindowOptions: google.maps.InfoWindowOptions = {
    maxWidth: 200,
  };

  constructor(private cdr:ChangeDetectorRef, private sharedAS:SharedAdjusterService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.generateLegend();
    //console.log("this.center map comp",this.center);
    this.sharedAS.radius$.subscribe(radius => {
      this.radius = radius;
      if (this.circle) {
        this.updateCircleRadius();
      }
    });
    this.sharedAS.adjusterHovered$.subscribe(event => {
      this.sharedAS.adjusterHovered$.subscribe(event => {
        if (event) { // Check if event is not null
            this.updateMarkerStates({userId: event.id, action: event.action});
        }
    });
      
    });
  
    this.sharedAS.adjusterSelected$.subscribe(event => {
      if (event) { // Check if event is not null
        this.updateMarkerStates({userId: event.userId, action: event.isSelected ? 'select' : 'deselect'});
    }
  });
    
  }
  updateMarkerStates(data: {userId: string | null, action: 'hover' | 'unhover' | 'select' | 'deselect'}): void {
    this.markerPositions = this.markerPositions.map(marker => {
        if (marker.userId === data.userId) {
            if (data.action === 'select') {
                marker.isSelected = true; // Set as selected
            } else if (data.action === 'deselect') {
                marker.isSelected = false; // Set as not selected
            } else if (data.action === 'hover') {
                marker.isHovered = true;
            } else if (data.action === 'unhover') {
                marker.isHovered = false;
            }
        } else if (['hover', 'unhover'].includes(data.action)) {
            marker.isHovered = false; // Reset hover for all other markers
        }
        marker.icon = this.getMarkerIcon(marker);  // Update the icon based on new state
        return marker;
    });
    this.cdr.markForCheck();  // Manually trigger change detection
}



getMarkerIcon(marker: EnhancedMarker): google.maps.Icon {
  let iconName = 'default.png';  // Default icon
  let scaledSize = new google.maps.Size(24, 24);  // Default size

  // Choose the icon based on user type
  if (marker.userTypeName === 'Internal user') {
    iconName = 'internal-user.png';
    scaledSize = new google.maps.Size(28, 28);  // Slightly larger for visibility
  } else if (marker.userTypeName === 'External User' && marker.fileTracId && marker.fileTracId > 0) {
    iconName = 'external-user.png';
  } else {
    iconName = 'external-user-default.png';
  }

  // If the marker is selected or hovered, increase the icon size
  if (marker.isSelected || marker.isHovered) {
    scaledSize = new google.maps.Size(48, 48);  // Larger size when hovered or selected
  }

  return {
    url: `./assets/assets/image/${iconName}`,
    scaledSize: scaledSize
  };
}
getHomeIcon(marker:EnhancedMarker): google.maps.Icon {
  let scaledSize = new google.maps.Size(24, 24);
  if (marker.isSelected || marker.isHovered) {
    scaledSize = new google.maps.Size(48, 48);  // Larger size when hovered or selected
  }
  return {
    url: './assets/assets/image/home-icon.png',
    scaledSize: scaledSize
  };
}





  
  
  private updateCircleRadius(): void {
    const radiusInMeters = this.radius; // Ensure this is in meters if your circle expects meters
    if (this.circle?.circle) {
      this.circle.circle.setRadius(radiusInMeters);
    }
  }
isHomeLocation:boolean=false
  openInfoWindow(marker: MapMarker, adjuster: EnhancedMarker, isDeployment: boolean = false) {
    this.isHomeLocation=isDeployment


    if (isDeployment && adjuster.deploymentInfo) {
      // Set the selectedAdjuster to the deployment info for the info window
      this.selectedAdjuster = {
        name: adjuster.name, // Name might still be the same
        email: adjuster.email, // Email might still be the same
        mobile: adjuster.mobile,
        location: adjuster.deploymentInfo.address,
        distance: adjuster.distance // Assuming distance remains relevant
      };
    } else {
      // Regular info
      this.selectedAdjuster = {
        name: adjuster.name,
        email: adjuster.email,
        location: adjuster.location,
        mobile: adjuster.mobile,
        distance: adjuster.homeDistance
      };
    }
    // this.infoWindow.open(marker);
    const dialogRef = this.dialog.open(LossViewProfileComponent, {
      data: { adjuster: adjuster,width:"41vw"},
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }
  
 
  ngAfterViewInit(): void {
    this.updateCircleRadius();
    this.addLegendToMap();
    this.circle.radiusChanged.subscribe(() => {
      const circleInstance = this.circle.circle;
      if (circleInstance) {
        let currentRadius = circleInstance.getRadius();
        const maxRadius = 1000 * 1609.34; // 1000 miles in meters
        
        if (currentRadius > maxRadius) {
          circleInstance.setRadius(maxRadius); // Enforce max radius
          currentRadius = maxRadius; // Ensure the local state is updated
        }
  
        // Update your component's state and shared service
        if (this.radius !== currentRadius) {
          this.radius = currentRadius;
          this.sharedAS.setRadius(this.radius);
          this.radiusValue.emit(this.radius); // Notify if needed
  
          // Trigger change detection manually if necessary
          this.cdr.detectChanges();
        }
      }
    });
  }
  
  trackByFn(index: number, item: any): any {
    return item.userId;  // Use a unique identifier from your item
  }

  generateLegend(): void {
    this.legends = [
      { name: 'Internal', icon: './assets/assets/image/internal-user.png' },
      { name: 'FileTrac', icon: './assets/assets/image/external-user.png' },
      { name: 'All Other', icon: './assets/assets/image/external-user-default.png' },
      { name: 'Deployed', icon: './assets/assets/image/home-icon.png' }
    ];
  }

  addLegendToMap(): void {
    try {
      if (this.map?.googleMap) {
        const legend = document.getElementById('loss-legend');
        if (legend && window?.google?.maps?.ControlPosition) {
          // Use string indexing which is safe with both string and enum values
          const controlPosition = window.google.maps.ControlPosition.RIGHT_BOTTOM;
          const controls = this.map.googleMap.controls as any;
          if (controls && controls[controlPosition]) {
            controls[controlPosition].push(legend);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to add legend to map:', error);
    }
  }
}
