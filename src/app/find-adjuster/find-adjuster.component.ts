import Swal from 'sweetalert2';
import { AdjustersService } from '../services/adjusters.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription, catchError, debounceTime, finalize, of as observableOf, of, startWith, switchMap} from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SharedAdjusterService } from '../services/shared-adjuster.service';
import { GoogleMapsLoaderService } from '../services/google-maps-loader.service';

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
}

@Component({
  selector: 'app-find-adjuster',
  templateUrl: './find-adjuster.component.html',
  styleUrls: ['./find-adjuster.component.scss']
})
export class FindAdjusterComponent implements OnInit {
  @ViewChild('search') public searchElementRef!: ElementRef;
  @ViewChild('drawer') drawer: any;
  showList = false;
  searchText: string = ``;
  Arrow: boolean = false;

  opened = false;
  adjusters: Adjuster[] = [];

  apiLoaded: Observable<boolean> = of(false);
  zoom = 4;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDefaultUI: false,
    fullscreenControl: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'roadmap'
  };
  circleCenter: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  radius: number = 1.50;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  //add some dummy data to markers array
  // markerPositions: google.maps.LatLngLiteral[] = [];
  markerPositions: EnhancedMarker[] = [];
  deploymentMarkerPosition:EnhancedMarker[] = [];
  filterSqlString:string=""
  private searchDebouncer: Subject<{ searchText: string, radius: number ,filterString:string,companyNameFilter:string ,surveyNameFilter:string,surveyTitleFilter:string ,operator:string}> = new Subject();
  private subscriptions: Subscription = new Subscription();
  companyNameFilter: string ="";
  surveyNameFilter: string="";
  surveyTitleFilter:string="";

  public dateRange: {
    start: '',
    end:  ''
  } = {
    start:'',
    end: ''
  };
  isFirstLoad: boolean = true;
  interUserList:any[]=[]
  externalUserList:any[]=[]
  externalUserListFiletrac:any[]=[]

  constructor(private httpClient: HttpClient, private adjustersService: AdjustersService, private spinner: NgxSpinnerService,
    private authService: AuthService, private router: Router, private sharedAS: SharedAdjusterService,private gms:GoogleMapsLoaderService) {
    

    var obj = this.authService.isUserAllowed(window.location)
    if (obj.isAllow) {

    }
    else {
      this.router.navigate([obj.allowedPath]);
    }
  }

  ngOnInit() {
    this.showMap()
    this.adjustersService.showlist.subscribe(res => {
      this.showList = res;
    })
    this.center = {
      lat: 33.967,
      lng: -84.220183,
    };
    this.circleCenter = this.center;
    //console.log("drawer", this.drawer);
  this.savedFilterState()
  this.subscriptions.add(
    this.sharedAS.radius$.subscribe(res => {
      this.radius = res;
      this.searchDebouncer.next({ 
        searchText: this.searchText, 
        radius: this.radius, 
        filterString: this.filterSqlString, 
        companyNameFilter: this.companyNameFilter,
        surveyNameFilter:this.surveyNameFilter,
        surveyTitleFilter:this.surveyTitleFilter,
        operator:this.sharedAS.getOperator()


      });
    })
  );

  this.subscriptions.add(
    this.sharedAS.searchText$.subscribe(searchText => {
      this.searchText = searchText;
      this.searchDebouncer.next({ 
        searchText: this.searchText, 
        radius: this.radius, 
        filterString: this.filterSqlString, 
        companyNameFilter: this.companyNameFilter,
        surveyNameFilter:this.surveyNameFilter,
        surveyTitleFilter:this.surveyTitleFilter ,
        operator:this.sharedAS.getOperator()
      });
    })
  );

  this.subscriptions.add(
    this.sharedAS.filterSubject$.subscribe(filterString => {
      this.filterSqlString = filterString;
      this.searchDebouncer.next({ 
        searchText: this.searchText, 
        radius: this.radius, 
        filterString: this.filterSqlString, 
        companyNameFilter: this.companyNameFilter,
        surveyNameFilter:this.surveyNameFilter,
        surveyTitleFilter:this.surveyTitleFilter ,
        operator:this.sharedAS.getOperator()
      });
    })
  );

  this.subscriptions.add(
    this.sharedAS.companyNamevalueSubject$.subscribe(companyName => {
      this.companyNameFilter = companyName;
      this.searchDebouncer.next({ 
        searchText: this.searchText, 
        radius: this.radius, 
        filterString: this.filterSqlString, 
        companyNameFilter: this.companyNameFilter,
        surveyNameFilter:this.surveyNameFilter,
        surveyTitleFilter:this.surveyTitleFilter ,
        operator:this.sharedAS.getOperator()
      });
    })
  );
  this.subscriptions.add(
    this.sharedAS.surveyNameSubject$.subscribe(surveyName=>{
      this.surveyNameFilter=surveyName;
      this.searchDebouncer.next({ 
        searchText: this.searchText, 
        radius: this.radius, 
        filterString: this.filterSqlString, 
        companyNameFilter: this.companyNameFilter,
        surveyNameFilter:this.surveyNameFilter,
        surveyTitleFilter:this.surveyTitleFilter,
        operator:this.sharedAS.getOperator() 
      });
    })

  )
  this.subscriptions.add(
    this.sharedAS.surveyTitleSubject$.subscribe(surveyTitleFilter=>{
      this.surveyTitleFilter= surveyTitleFilter;
      this.searchDebouncer.next({ 
        searchText: this.searchText, 
        radius: this.radius, 
        filterString: this.filterSqlString, 
        companyNameFilter: this.companyNameFilter,
        surveyNameFilter:this.surveyNameFilter,
        surveyTitleFilter:this.surveyTitleFilter ,
        operator:this.sharedAS.getOperator()
      });

    })
  )
    
    this.searchDebouncer.pipe(
      debounceTime(300),
      // other operators
    ).subscribe({
      next: ({ searchText, radius, filterString ,companyNameFilter, surveyNameFilter,surveyTitleFilter, operator}) => {
        localStorage.setItem('findAdjusterSearch',JSON.stringify({ searchText, radius, filterString,companyNameFilter,surveyNameFilter,surveyTitleFilter,operator}));
        this.searchLocation(searchText, radius, filterString ,companyNameFilter,surveyNameFilter,surveyTitleFilter,operator);
        // console.log("search location",searchText, radius, filterString ,companyNameFilter,surveyNameFilter,surveyTitleFilter,operator)
      },
      error: (error) => console.error(error),
    });
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  showMap(){
    this.spinner.show()
    this.gms.onGoogleMapsLoaded().subscribe(isLoaded => {
      if (isLoaded) {
        // Initialize Google Maps dependent functionality
        this.apiLoaded =of(true);
        this.spinner.hide()
      
      }
      else{
        this.spinner.hide()
      }
    });
  }
  savedFilterState(){
    const savedFilterState = localStorage.getItem('findAdjusterSearch')
    if(savedFilterState){
      let savedData = JSON.parse(savedFilterState)
      // console.log("savedFilterState",savedFilterState)
      this.searchText = savedData.address
      this.radius = savedData.radius
      this.filterSqlString = savedData.filter
      this.sharedAS.saveState(this.searchText, this.radius ,this.filterSqlString ,this.companyNameFilter, this.surveyNameFilter, this.surveyTitleFilter);
      
      this.searchDebouncer.next({ searchText: this.searchText, radius: this.radius ,filterString: this.filterSqlString , companyNameFilter:this.companyNameFilter, surveyNameFilter:this.surveyNameFilter,surveyTitleFilter:this.surveyTitleFilter,operator:this.sharedAS.getOperator() }); 


    }
  }

  

  calculateZoom(radius: number): number {
  return this.sharedAS.calculateZoom(radius);
  }






  toggleDrawer2() {
    this.drawer.toggle();
    this.showList = !this.showList;
    this.Arrow = !this.Arrow;

  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
   return this.sharedAS.calculateDistance(lat1, lng1, lat2, lng2);
  }



  searchLocation(searchText: string, radius: number, filteredAdjusters:any,companyNameFilter:any, surveyNameFilter:any,surveyTitleFilter:any ,operator:any) {
    if (this.isFirstLoad && (searchText == '' || searchText?.length == 0)) {
      this.isFirstLoad = false; // Update the flag
      this.zoom = 4;
      this.drawer?.close();
      // Optionally, you might want to initiate a default search here or do nothing
      return;
    } else if (searchText == '' && searchText?.length == 0) {
      // It's not the first load, and the search text is empty, show the warning
      this.zoom = 4;
      this.drawer?.close();
      Swal.fire({
        icon: 'warning',
        title: 'Missing location!',
        text: 'Please enter a location or zip code to search for adjusters.',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      });
      return;
    }else {
      this.spinner.show();
      
      this.searchText = searchText;
      this.Arrow;
      //console.log('radius before search convert', radius);
      this.zoom=this.calculateZoom(radius);
      radius = this.convertMetersToMiles(radius);
      //console.log('radius to converted to miles search :', radius);
      this.adjusters = [];
      // console.log("survey name",surveyNameFilter)
      // console.log("survey title",surveyTitleFilter)
      
      let payload={
        address:searchText,
        radius:radius,
        filter: filteredAdjusters,
        companyNameFilter:companyNameFilter,
        surveyNameFilter:surveyNameFilter,
        surveyTitleFilter:surveyTitleFilter,
        Operator:operator
      }
     
      this.adjustersService.getAdjustersByAddress(payload).pipe(
        finalize(() => {
          this.spinner.hide();
        })
      ).subscribe(
        (response: any) => {
          // console.log("response" ,response);
          if (response.data && response.data.list && response.data.list.length > 0) {
            this.center = {
              lat: parseFloat(response.data.list[0].searchLatitude),
              lng: parseFloat(response.data.list[0].searchLongitude),
            };
            this.circleCenter = this.center;
            this.adjusters=response.data.list
            this.adjusters.sort((a: any, b: any) => {
              if (a.distance === b.distance) {  // Check if distances are the same
                // Prioritize 'Internal user'
                if (a.userTypeName === 'Internal user' && b.userTypeName !== 'Internal user') {
                  return -1;
                } else if (a.userTypeName !== 'Internal user' && b.userTypeName === 'Internal user') {
                  return 1;
                }
            
                // Prioritize 'External User' with valid 'fileTracId'
                if (a.userTypeName === 'External User' && a.fileTracId > 0 && !(b.userTypeName === 'External User' && b.fileTracId > 0)) {
                  return -1;
                } else if (b.userTypeName === 'External User' && b.fileTracId > 0 && !(a.userTypeName === 'External User' && a.fileTracId > 0)) {
                  return 1;
                }
              }
              // Default to sorting by distance if above conditions are not met
              return a.distance - b.distance;
            });
            
           
            
            // console.log('somelist',this.adjusters)
            this.markerPositions = [];
            this.markerPositions = this.adjusters.map((adjuster:any) => ({
              lat: parseFloat(adjuster.latitude),
              lng: parseFloat(adjuster.longitude),
              name: adjuster.name,
              location: adjuster.address1,
              email: adjuster.emailAddress,
              mobile: adjuster.mobile,
              distance: adjuster.distance,
              homeDistance:adjuster.homeDistance,
              userId: adjuster.userId,
              fileTracId: adjuster.fileTracId,
              userTypeName: adjuster.userTypeName,
              isHovered: false,
              isSelected: false,
              homeLat: adjuster.homeLatitude ? parseFloat(adjuster.homeLatitude) : null,
              homeLng: adjuster.homeLongitude ? parseFloat(adjuster.homeLongitude) : null,
              deploymentInfo: adjuster.homeLatitude && adjuster.homeLongitude ? {
                  address: adjuster.deploymentLocationAddress1,
                  city: adjuster.deploymentCity,
                  state: adjuster.deploymentState,
                  zip: adjuster.deploymentZip,
                  country: adjuster.deploymentCountry
              } : null
            }));
            this.interUserList=[]
            this.externalUserList=[]
            this.externalUserListFiletrac=[]
           this.markerPositions.forEach(item=>{
            if (item.userTypeName=="Internal user"){
          
              this.interUserList.push(item)
            }else if( item.userTypeName=="External User" && item.fileTracId && item.fileTracId >0){
              this.externalUserListFiletrac.push(item)
            }else if( item.userTypeName=="External User" && !item.fileTracId ){
              this.externalUserList.push(item)
            }
           })
            
           let testData=[...this.externalUserList,...this.externalUserListFiletrac,...this.interUserList]
          this.markerPositions=testData
        
            // console.log('markerPositions after filter by distance', this.markerPositions);
            this.drawer.open();
            this.Arrow= true
          }
          else {
            this.markerPositions = [];
            this.adjusters = [];
            if (response.message?.trim().toLowerCase() === 'invalid address'.toLowerCase()) {
              Swal.fire({
                title: 'Invalid Address',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                  this.zoom = 4;
                  this.drawer?.close()
                }
                })
                localStorage.removeItem('findAdjusterSearch')
            }else{
              Swal.fire({
                title: 'No Adjusters Found',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              });
              this.drawer?.close();
            }


          }
          
          this.spinner.hide();
        },
        (error) => {
          console.error('Error fetching adjusters:', error);
          this.spinner.hide();
        }
      );
    }

  }

  // private filterAdjustersByDistance(center: google.maps.LatLngLiteral, radius: number) {
  //   this.adjusters = this.adjusters.filter((adjuster: Adjuster) => {
  //     const distance = this.calculateDistance(
  //       center.lat,
  //       center.lng,
  //       parseFloat(adjuster.latitude),
  //       parseFloat(adjuster.longitude)
  //     );
  //     ////console.log('distance in miles', distance);
  //     ////console.log('radius in miles', radius);
  //     return distance <= radius;
  //   });
  //   if (this.adjusters?.length == 0) {
  //     Swal.fire({
  //       title: 'No Adjusters Found',
  //       icon: 'warning',
  //       confirmButtonText: 'Ok',
  //       confirmButtonColor: '#ffa022',
  //     });
  //   }
  // }

  convertMetersToMiles(meters: number): number {
    return meters * 0.000621371;
  }
  // onAdjustersUpdated(data:any){
  //   console.log("onAdjustersUpdated",data)

  // }


}
export interface Adjuster {
  latitude: string;
  longitude: string;
  distance: number;
}
