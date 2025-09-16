import { Component,Output, EventEmitter, ViewChild, ElementRef,OnInit,Input,OnDestroy, OnChanges, SimpleChanges  } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';


@Component({
  selector: 'search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})
export class SearchLocationComponent implements OnInit, OnDestroy, OnChanges{

  @ViewChild('search') public searchElementRef!: ElementRef;
  @Output() toggleDrawer = new EventEmitter<void>();
  //@Output() searchLocationEvent = new EventEmitter<{ searchText: string, radius: number }>();
  //@Output() searchTextEvent: EventEmitter<string> = new EventEmitter();
 // @Input() radius!: number;
  @Input() searchText: string = '';
//   private searchTextChanged = new Subject<string>();
// searchText$ = this.searchTextChanged.asObservable().pipe(debounceTime(500));

  opened = false;

  constructor(private sharedAS:SharedAdjusterService) { }
  ngOnInit(): void {
    // Initialize with empty string
    this.searchText = '';
    
    this.sharedAS.searchText$.subscribe(searchText => {
      // Only update if different to avoid potential feedback loop
        this.searchText = searchText;
    });
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchText']) {
      // Handle the updated searchText
      const change = changes['searchText'];
      if (change && !change.firstChange) {
        // Do something with change.currentValue
        // console.log("change",change.currentValue)
        // this.searchTextEvent.emit(change.currentValue);
        this.sharedAS.setSearchText(change.currentValue)
      }
    }
   
  }
  searchLocation() {
    //console.log("searchText",this.searchText);
    // this.searchLocationEvent.emit({ searchText: this.searchText, radius: this.radius });
    // this.toggleDrawer.emit();
    this.sharedAS.setSearchText(this.searchText)
  }

  emitSearchText() {
    // this.searchTextChanged.next(this.searchText);
  }
  ngOnDestroy() {
    // this.searchTextChanged.unsubscribe();
  }
}
