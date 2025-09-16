import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';

import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';
import { LossRadiusSliderComponent } from './loss-radius-slider.component';

describe('LossRadiusSliderComponent', () => {
  let component: LossRadiusSliderComponent;
  let fixture: ComponentFixture<LossRadiusSliderComponent>;
  let sharedAdjusterServiceSpy: jasmine.SpyObj<SharedAdjusterService>;
  let localStorageSpy: jasmine.Spy;
  
  // Start with a Subject instead of BehaviorSubject to prevent immediate emission
  const radiusSubject = new Subject<number>();

  beforeEach(async () => {
    sharedAdjusterServiceSpy = jasmine.createSpyObj('SharedAdjusterService', [
      'setRadius', 'convertMetersToMiles'
    ]);
    sharedAdjusterServiceSpy.radius$ = radiusSubject.asObservable();
    // Use the exact conversion factor from the component (1609.34)
    sharedAdjusterServiceSpy.convertMetersToMiles.and.callFake((meters: number) => meters / 1609.34);

    // Set up localStorage spy once
    localStorageSpy = spyOn(localStorage, 'getItem');
    localStorageSpy.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatSliderModule,
        NoopAnimationsModule
      ],
      declarations: [LossRadiusSliderComponent],
      providers: [
        { provide: SharedAdjusterService, useValue: sharedAdjusterServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossRadiusSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default radius of 25 miles', () => {
    expect(component.radius).toBe(25);
    expect(component.radiusDisplay).toBe('25 miles');
  });

  it('should update radius when sharedAdjusterService.radius$ emits', () => {
    // Emit a new radius value (50 miles in meters)
    radiusSubject.next(50 * 1609.34);
    fixture.detectChanges();
    
    expect(component.radius).toBe(50);
    expect(component.radiusDisplay).toBe('50 miles');
  });

  it('should load saved radius from localStorage', () => {
    // Update the spy's return value for this test
    localStorageSpy.and.returnValue(JSON.stringify({
      radius: 80467.2 // 50 miles in meters
    }));
    
    component.loadSavedRadius();
    
    expect(sharedAdjusterServiceSpy.convertMetersToMiles).toHaveBeenCalledWith(80467.2);
    expect(sharedAdjusterServiceSpy.setRadius).toHaveBeenCalledWith(80467.2);
  });

  it('should update radius when onRadiusChange is called with valid input', () => {
    component.onRadiusChange('50');
    
    expect(component.radius).toBe(50);
    expect(component.radiusDisplay).toBe('50 miles');
    expect(sharedAdjusterServiceSpy.setRadius).toHaveBeenCalledWith(50 * 1609.34);
  });

  it('should not update radius when onRadiusChange is called with invalid input', () => {
    component.radius = 25;
    component.radiusDisplay = '25 miles';
    
    component.onRadiusChange('invalid');
    
    expect(component.radius).toBe(25);
    expect(component.radiusDisplay).toBe('25 miles');
    expect(sharedAdjusterServiceSpy.setRadius).not.toHaveBeenCalled();
  });

  it('should format label correctly', () => {
    expect(component.formatLabel(5)).toBe('5M');
    expect(component.formatLabel(0.5)).toBe(0.5);
  });

  it('should increase radius by 10 miles when radiusIncrease is called', () => {
    component.radius = 25;
    
    component.radiusIncrease();
    
    expect(component.radius).toBe(35);
    expect(component.radiusDisplay).toBe('35 miles');
    expect(sharedAdjusterServiceSpy.setRadius).toHaveBeenCalledWith(35 * 1609.34);
  });

  it('should not increase radius beyond 1000 miles', () => {
    component.radius = 495;
    
    component.radiusIncrease();
    
    expect(component.radius).toBe(500);
    expect(component.radiusDisplay).toBe('500 miles');
    
    // Try to increase again
    component.radiusIncrease();
    
    expect(component.radius).toBe(500); // Should remain at 500
  });

  it('should decrease radius by 10 miles when radiusDecrease is called', () => {
    component.radius = 25;
    
    component.radiusDecrease();
    
    expect(component.radius).toBe(15);
    expect(component.radiusDisplay).toBe('15 miles');
    expect(sharedAdjusterServiceSpy.setRadius).toHaveBeenCalledWith(15 * 1609.34);
  });

  it('should not decrease radius below 1 mile', () => {
    component.radius = 5;
    
    component.radiusDecrease();
    
    expect(component.radius).toBe(1);
    expect(component.radiusDisplay).toBe('1 miles');
    
    // Try to decrease again
    component.radiusDecrease();
    
    expect(component.radius).toBe(1); // Should remain at 1
  });

  it('should allow numeric keys on keydown', () => {
    const event = new KeyboardEvent('keydown', { key: '5' });
    spyOn(event, 'preventDefault');
    
    component.onKeyDown(event);
    
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should prevent non-numeric keys on keydown', () => {
    const event = new KeyboardEvent('keydown', { key: 'a' });
    spyOn(event, 'preventDefault');
    
    component.onKeyDown(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should allow navigation keys on keydown', () => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'];
    
    allowedKeys.forEach(key => {
      const event = new KeyboardEvent('keydown', { key });
      spyOn(event, 'preventDefault');
      
      component.onKeyDown(event);
      
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  it('should increase radius when up arrow icon is clicked', () => {
    spyOn(component, 'radiusIncrease');
    
    const upArrowIcon = fixture.debugElement.queryAll(By.css('mat-icon'))[1].nativeElement;
    upArrowIcon.click();
    
    expect(component.radiusIncrease).toHaveBeenCalled();
  });

  it('should decrease radius when down arrow icon is clicked', () => {
    spyOn(component, 'radiusDecrease');
    
    const downArrowIcon = fixture.debugElement.queryAll(By.css('mat-icon'))[0].nativeElement;
    downArrowIcon.click();
    
    expect(component.radiusDecrease).toHaveBeenCalled();
  });
});
