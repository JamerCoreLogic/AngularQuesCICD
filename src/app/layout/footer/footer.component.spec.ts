import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockVersionData = ['item1', 'item2', 'item3', 'item4', 'item5', 
                          'item6', 'item7', 'item8', 'item9', 'item10', 
                          'item11', 'version 1.0.0'];

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['getHeartbeat']);
    authServiceSpyObj.getHeartbeat.and.returnValue(of(mockVersionData));

    await TestBed.configureTestingModule({
      imports: [
        MatTooltipModule
      ],
      declarations: [FooterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj }
      ],
      schemas: [NO_ERRORS_SCHEMA] // This will ignore unknown attributes and elements
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    jasmine.clock().install();
    // Set a fixed date for testing
    jasmine.clock().mockDate(new Date(2024, 0, 1)); // January 1, 2024
    
    // Initialize component directly without accessing template
    component.ngOnInit();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentYear to the current year on init', () => {
    expect(component.currentYear).toBe(2024);
  });

  it('should call versionDetails during initialization', () => {
    spyOn(component, 'versionDetails');
    component.ngOnInit();
    expect(component.versionDetails).toHaveBeenCalled();
  });

  it('should fetch version details from AuthService', () => {
    // Reset the value to ensure we're testing the right thing
    component.versionData = undefined;
    
    // Set up the mock to return the expected data
    authServiceSpy.getHeartbeat.and.returnValue(of(mockVersionData));
    
    // Call the method
    component.versionDetails();
    
    // Verify expectations
    expect(authServiceSpy.getHeartbeat).toHaveBeenCalled();
    expect(component.versionData).toBe('version 1.0.0');
  });

  it('should handle error when fetching version details', () => {
    // Test with null response
    // Reset the component's versionData first
    component.versionData = 'reset value';
    
    // Configure the spy to return null
    authServiceSpy.getHeartbeat.and.returnValue(of(null));
    
    // Call the method
    component.versionDetails();
    
    // Check expectation - should be undefined or null depending on implementation
    expect(component.versionData).not.toBe('version 1.0.0');
    
    // Test with empty array
    // Reset the component's versionData first
    component.versionData = 'reset value';
    
    // Configure the spy to return empty array
    authServiceSpy.getHeartbeat.and.returnValue(of([]));
    
    // Call the method
    component.versionDetails();
    
    // Check expectation - should be undefined when accessing out of bounds index
    expect(component.versionData).toBeUndefined();
  });
});
