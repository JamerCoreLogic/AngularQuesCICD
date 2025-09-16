import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';

import { SearchLocationComponent } from './search-location.component';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';

describe('SearchLocationComponent', () => {
  let component: SearchLocationComponent;
  let fixture: ComponentFixture<SearchLocationComponent>;
  let sharedAdjusterServiceSpy: jasmine.SpyObj<SharedAdjusterService>;
  
  const searchTextSubject = new BehaviorSubject<string>('');

  beforeEach(async () => {
    sharedAdjusterServiceSpy = jasmine.createSpyObj('SharedAdjusterService', ['setSearchText']);
    sharedAdjusterServiceSpy.searchText$ = searchTextSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatTooltipModule,
        NoopAnimationsModule
      ],
      declarations: [SearchLocationComponent],
      providers: [
        { provide: SharedAdjusterService, useValue: sharedAdjusterServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  

  it('should update searchText when sharedAdjusterService.searchText$ emits', () => {
    searchTextSubject.next('New York');
    expect(component.searchText).toBe('New York');
  });

  it('should call setSearchText when searchLocation is called', () => {
    component.searchText = 'Atlanta';
    component.searchLocation();
    expect(sharedAdjusterServiceSpy.setSearchText).toHaveBeenCalledWith('Atlanta');
  });

  it('should update searchText when input value changes', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'Chicago';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    
    expect(component.searchText).toBe('Chicago');
  });

  it('should call searchLocation when enter key is pressed in input', () => {
    spyOn(component, 'searchLocation');
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true
    });
    
    inputElement.dispatchEvent(enterEvent);
    fixture.detectChanges();
    
    expect(component.searchLocation).toHaveBeenCalled();
  });

  it('should call searchLocation when search button is clicked', () => {
    spyOn(component, 'searchLocation');
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    
    buttonElement.click();
    fixture.detectChanges();
    
    expect(component.searchLocation).toHaveBeenCalled();
  });

  it('should handle ngOnChanges when searchText changes', () => {
    component.searchText = 'Initial';
    
    // Simulate ngOnChanges with a changes object
    const changes = {
      searchText: {
        currentValue: 'Updated',
        previousValue: 'Initial' as string,
        firstChange: false,
        isFirstChange: () => false
      }
    };
    
    component.ngOnChanges(changes);
    
    expect(sharedAdjusterServiceSpy.setSearchText).toHaveBeenCalledWith('Updated');
  });

  it('should not call setSearchText on first change', () => {
    // Simulate ngOnChanges with a changes object for first change
    const changes = {
      searchText: {
        currentValue: 'Initial',
        previousValue: undefined as string | undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    };
    
    component.ngOnChanges(changes);
    
    expect(sharedAdjusterServiceSpy.setSearchText).not.toHaveBeenCalled();
  });
});
