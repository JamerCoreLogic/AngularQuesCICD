import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommunicationResponseComponent } from './communication-response.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { CommunicationHeaderComponent } from './communication-header/communication-header.component';
import { CommunicationFooterComponent } from './communication-footer/communication-footer.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DeclineResponseComponent } from './decline-response/decline-response.component';

describe('CommunicationResponseComponent', () => {
  let component: CommunicationResponseComponent;
  let fixture: ComponentFixture<CommunicationResponseComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockCommunicationService: jasmine.SpyObj<CommunicationService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSpinner: jasmine.SpyObj<NgxSpinnerService>;

  const mockOpDetails = {
    adjusterRequestId: 123,
    title: 'Test Title',
    assignment: 'Test Assignment',
    location: 'Test Location',
    description: 'This is a test description that is long enough to trigger read more functionality',
    claimType: 'Test Claim'
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({ token: 'test+token' })
    });
    mockCommunicationService = jasmine.createSpyObj('CommunicationService', 
      ['GetDataForBindUIScreen', 'SubmitResponce']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [ 
        CommunicationResponseComponent,
        CommunicationHeaderComponent,
        CommunicationFooterComponent 
      ],
      imports: [
        SharedMaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CommunicationService, useValue: mockCommunicationService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: NgxSpinnerService, useValue: mockSpinner }
      ]
    })
    .compileComponents();

    mockCommunicationService.GetDataForBindUIScreen.and.returnValue(of({ 
      data: [mockOpDetails] 
    }));

    fixture = TestBed.createComponent(CommunicationResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with data from route params', () => {
    expect(component.encryptedData).toBe('test+token');
    expect(mockCommunicationService.GetDataForBindUIScreen).toHaveBeenCalledWith('test+token');
  });

  it('should load opportunity details on init', () => {
    expect(component.opDatails).toEqual(mockOpDetails);
  });

  it('should toggle read more state', () => {
    component.showMore = false;
    component.toggleReadMore();
    expect(component.showMore).toBeTrue();
    
    component.toggleReadMore();
    expect(component.showMore).toBeFalse();
  });

  it('should check for read more functionality with long description', () => {
    const longDesc = 'Word1 Word2 Word3 Word4 Word5 Word6 Word7 Word8';
    component.checkForReadMore(longDesc);
    
    expect(component.shouldShowMoreToggle).toBeTrue();
    expect(component.shortDescription).toBe('Word1 Word2 Word3 Word4 Word5 Word6...');
  });

  it('should not show read more for short descriptions', () => {
    const shortDesc = 'Word1 Word2 Word3';
    component.checkForReadMore(shortDesc);
    
    expect(component.shouldShowMoreToggle).toBeFalse();
    expect(component.shortDescription).toBe('');
  });

  it('should handle null input', () => {
    
    component.checkForReadMore(null);
    expect(component.shouldShowMoreToggle).toBeFalse();
  });

  it('should handle undefined input', () => {
   
    component.checkForReadMore(undefined);
    expect(component.shouldShowMoreToggle).toBeFalse();
  });

  it('should handle empty description', () => {
    component.checkForReadMore('');
    expect(component.shouldShowMoreToggle).toBeFalse();
    expect(component.shortDescription).toBe('');
  });

  it('should navigate to submit page on accept', () => {
    component.encryptedData = 'test-data';
    component.accept();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['communication/submit'], 
      { queryParams: { data: 'test-data' } }
    );
  });

  it('should handle decline action successfully', fakeAsync(() => {
    const mockDialogRef = { afterClosed: () => of(true) };
    mockDialog.open.and.returnValue(mockDialogRef as any);
    mockCommunicationService.SubmitResponce.and.returnValue(of({ success: true }));
    
    component.opDatails = { adjusterRequestId: 123 };
    component.decline();
    tick();

    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockCommunicationService.SubmitResponce).toHaveBeenCalled();
    expect(mockDialog.open).toHaveBeenCalledWith(
      DeclineResponseComponent,
      {
        data: 'right click',
        panelClass: 'decline'
      }
    );
    expect(mockSpinner.hide).toHaveBeenCalled();
  }));

  it('should handle decline action error', fakeAsync(() => {
    mockCommunicationService.SubmitResponce.and.returnValue(throwError(() => new Error('Test error')));
    
    component.opDatails = { adjusterRequestId: 123 };
    component.decline();
    tick();

    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalled();
  }));

  it('should render opportunity details correctly', () => {
    const titleElement = fixture.debugElement.query(By.css('.opp')).nativeElement;
    expect(titleElement.textContent).toContain(mockOpDetails.title);
  });

  it('should render read more button when description is long', () => {
    component.shouldShowMoreToggle = true;
    component.shortDescription = 'Short description...';
    fixture.detectChanges();
    
    const readMoreButton = fixture.debugElement.query(By.css('.read-more-trigger'));
    expect(readMoreButton).toBeTruthy();
  });

  it('should render header and footer components', () => {
    const header = fixture.debugElement.query(By.css('app-communication-header'));
    const footer = fixture.debugElement.query(By.css('app-communication-footer'));
    
    expect(header).toBeTruthy();
    expect(footer).toBeTruthy();
  });
});
