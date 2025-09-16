import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedAdjusterService {
  constructor() {
    this.loadInitialState();
   }

  private searchText = '';
  private radiusValue: number=40233.6;
  private filterText:string=''
  public dateRange: {
    start: Date | null,
    end: Date | null
  } = {
    start: null,
    end: null
  };
  companyNameFilter:any
  surveyTitleFilter:any
  surveyNameFilter:any

  private searchTextSource = new BehaviorSubject<string>('');
  searchText$ = this.searchTextSource.asObservable();

 
  private radiusSubject = new BehaviorSubject<number>(40233.6);
  radius$ = this.radiusSubject.asObservable();

  private filterSubject = new BehaviorSubject<any>('');
  filterSubject$ = this.filterSubject.asObservable();

  private companyNamevalueSubject = new BehaviorSubject<any>('');
  companyNamevalueSubject$ = this.companyNamevalueSubject.asObservable();

  private surveyTitleSubject = new BehaviorSubject<any>('');
  surveyTitleSubject$ = this.surveyTitleSubject.asObservable();

  private surveyNameSubject = new BehaviorSubject<any>('');
  surveyNameSubject$ = this.surveyNameSubject.asObservable();

  private filterOperatorSubject = new BehaviorSubject<any>('');
  filterOperatorSubject$ = this.filterOperatorSubject.asObservable();

  private isFilterSubject = new BehaviorSubject<boolean>(false);
  isFilterSubject$ = this.isFilterSubject.asObservable();

  private adjusterHoveredSubject = new BehaviorSubject<{ id: string | null, action: 'hover' | 'unhover' } | null>(null);
  adjusterHovered$ = this.adjusterHoveredSubject.asObservable();

  private adjusterSelectedSubject = new BehaviorSubject<{userId: string | null, isSelected: boolean} | null>(null);
  adjusterSelected$ = this.adjusterSelectedSubject.asObservable();

  private adjusterSelectedListSubject = new BehaviorSubject<string[]>([]);
  adjusterSelectedList$ = this.adjusterSelectedListSubject.asObservable().pipe(debounceTime(50));

private loadInitialState() {
    const savedFilterState = localStorage.getItem('findAdjusterSearch');
    if (savedFilterState) {
      const savedData = JSON.parse(savedFilterState);
      if (savedData.radius) {
        // Assuming radius is stored in meters, convert to miles if necessary
        let data = savedData.radius / 1609.34;
        this.radiusSubject.next(data);
      }
      if (savedData.searchText) {
        this.searchTextSource.next(savedData.searchText);
      }
      if (savedData.filter) {
        this.filterSubject.next(savedData.filter);
        this.isFilterSubject.next(true)
      }
      if (savedData.companyNameFilter) {
        this.companyNamevalueSubject.next(savedData.companyNameFilter);
      }
      if (savedData.surveyTitleFilter) {
        this.surveyTitleSubject.next(savedData.surveyTitleFilter);
      }
      if (savedData.surveyNameFilter) {
        
        this.surveyNameSubject.next(savedData.surveyNameFilter);
      }



      // if (savedData.startDate && savedData.endDate) {
      //   this.dateRange.start=savedData.startDate
      //   this.dateRange.end=savedData.endDate
      //   this.dateForFilterSubject.next(this.dateRange);
      // }
    }
  }
  setRadius(radius: number) {
    this.radiusSubject.next(radius);
  }
  
  setSearchText(text: string) {
    this.searchTextSource.next(text);
  }

  setFilter(text:string){
  this.filterSubject.next(text)
  }

  setcompanyNamevalue(text:string){
    this.companyNamevalueSubject.next(text)
  }


  getCompanyNamevalue(){
    return this.companyNameFilter
  }

  setSurveyTitle(text:string){
    // console.log("setSurveyTitle",text)
    this.surveyTitleSubject.next(text)
  }
  getSurveyTitle(){
    return this.surveyTitleSubject.getValue()
  }

  setSurveyName(text:string){
    // console.log("setSurveyName",text)
    this.surveyNameSubject.next(text)
  }
  getSurveyName(){
    return this.surveyNameSubject.getValue()
  }

  setOperator(text:string){
    // console.log("setOperator",text)
    if (text != null && text != undefined && text != '') {
      text  === 'and' ? ' AND ' : ' OR '
      this.filterOperatorSubject.next(text)
    }else{
      this.filterOperatorSubject.next('')
    }
    
  }

  getOperator(){
    return this.filterOperatorSubject.getValue().toUpperCase()
  }

  // setDateForFilter(date:any){
  //   this.dateForFilterSubject.next(date)
  //   }


  isFilterApplyed(text:boolean){
    this.isFilterSubject.next(text)
    }


  saveState(search: string, radius: number ,filterdata:string ,companyNameFilter:string ,surveyNameFilter:string,surveyTitleFilter:string) {
    this.searchText = search;
    this.radiusValue = radius;
    this.filterText= filterdata;
    // this.dateRange=range,
    this.companyNameFilter=companyNameFilter
    this.surveyNameFilter=surveyNameFilter
    this.surveyTitleFilter=surveyTitleFilter
  }

  getState() {
    return { search: this.searchText, radius: this.radiusValue , filter:this.filterText};
  }

  getCurrentSearchText(): string {
    return this.searchTextSource.getValue();
  }
  

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return this.kmToMiles(distance);
  }

  // New method to calculate driving distance using Google Distance Matrix API
  calculateDrivingDistance(originLat: number, originLng: number, destLat: number, destLng: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const distanceMatrixService = new google.maps.DistanceMatrixService();
      
      const origin = new google.maps.LatLng(originLat, originLng);
      const destination = new google.maps.LatLng(destLat, destLng);
      
      distanceMatrixService.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL, // Use miles
        },
        (response, status) => {
          if (status === google.maps.DistanceMatrixStatus.OK) {
            if (response?.rows[0]?.elements[0]?.status === 'OK') {
              // Distance in meters, convert to miles
              const distanceInMeters = response.rows[0].elements[0].distance.value;
              const distanceInMiles = this.convertMetersToMiles(distanceInMeters);
              resolve(distanceInMiles);
            } else {
              // If route not found, fall back to straight-line distance
              const straightDistance = this.calculateDistance(originLat, originLng, destLat, destLng);
              resolve(straightDistance);
            }
          } else {
            // In case of error, fall back to straight-line distance
            const straightDistance = this.calculateDistance(originLat, originLng, destLat, destLng);
            resolve(straightDistance);
          }
        }
      );
    });
  }

  // Calculate driving distances for multiple adjusters in batches
  calculateBatchDrivingDistances(searchLat: number, searchLng: number, adjusters: any[]): Promise<any[]> {
    // Google Distance Matrix API allows up to 25 origins/destinations in a single request
    const BATCH_SIZE = 25;
    const batches: any[][] = [];
    
    // Split the adjusters into batches
    for (let i = 0; i < adjusters.length; i += BATCH_SIZE) {
      batches.push(adjusters.slice(i, i + BATCH_SIZE));
    }
    
    // Process each batch
    const batchPromises: Promise<any[]>[] = batches.map(batch => {
      return new Promise<any[]>((resolve, reject) => {
        const distanceMatrixService = new google.maps.DistanceMatrixService();
        const origins = [new google.maps.LatLng(searchLat, searchLng)];
        const destinations = batch.map(adjuster => 
          new google.maps.LatLng(parseFloat(adjuster.latitude), parseFloat(adjuster.longitude))
        );
        
        distanceMatrixService.getDistanceMatrix(
          {
            origins: origins,
            destinations: destinations,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
          },
          (response, status) => {
            if (status === google.maps.DistanceMatrixStatus.OK) {
              const results = batch.map((adjuster, index) => {
                const element = response?.rows[0]?.elements[index];
                
                if (element?.status === 'OK') {
                  // Use driving distance
                  const drivingDistance = element.distance.text;
                  return {
                    ...adjuster,
                    distance: drivingDistance,
                    drivingDistance: drivingDistance,
                    drivingDuration: element.duration.text
                  };
                } else {
                  // Fallback to straight-line distance
                  const distance = this.calculateDistance(
                    searchLat, 
                    searchLng, 
                    parseFloat(adjuster.latitude), 
                    parseFloat(adjuster.longitude)
                  );
                  return { ...adjuster, distance: distance };
                }
              });
              
              resolve(results);
            } 
            
          }
        );
      });
    });
    
    // Combine all batch results
    return Promise.all(batchPromises)
      .then(batchResults => {
        // Flatten the array of batches back to a single array
        // console.log("batchResults", batchResults);
        return batchResults.reduce((acc: any[], curr: any[]) => [...acc, ...curr], [] as any[]);
      });
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  kmToMiles(km: number): number {
    return km * 0.621371;
  }

  convertMetersToMiles(meters: number): number {
    return meters * 0.000621371;
  }

  calculateZoom(radius: number): number {
    const minZoom = 5;
    const maxZoom = 11;
    const maxSliderValue = 1000000;
    const minSliderValue = 1;
    const normalizedSliderValue = (radius - minSliderValue) / (maxSliderValue - minSliderValue);
    let calculatedZoom = maxZoom - normalizedSliderValue * (maxZoom - minZoom);
    calculatedZoom = Math.floor(calculatedZoom);
    const zoom = Math.max(minZoom, Math.min(maxZoom, calculatedZoom));
    return radius > 1000 ? zoom - 2 : zoom + 2;
  }

  setHoveredAdjuster(id: string | null, action: 'hover' | 'unhover') {
    this.adjusterHoveredSubject.next({ id, action });
  }
  
  setSelectedAdjuster(userId: string | null, isSelected: boolean) {
    this.adjusterSelectedSubject.next({ userId, isSelected });
}
  
    setSelectedAdjusterList(userIdList: string[]) {
      this.adjusterSelectedListSubject.next(userIdList);
      // console.log("userIdList",userIdList);
    }
    getCurrentSelectedAdjusterList(): string[] {
      return this.adjusterSelectedListSubject.getValue();
    }
 



  
}
