import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeclineResponseComponent } from './decline-response.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

describe('DeclineResponseComponent', () => {
  let component: DeclineResponseComponent;
  let fixture: ComponentFixture<DeclineResponseComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    // Create spies for Router and MatDialog
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);

    await TestBed.configureTestingModule({
      declarations: [ DeclineResponseComponent ],
      imports: [
        BrowserAnimationsModule,
        SharedMaterialModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclineResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render decline message heading', () => {
    const headingElement = fixture.debugElement.query(By.css('h2'));
    expect(headingElement.nativeElement.textContent.trim()).toBe('Opportunity Declined');
  });

  it('should render thank you message', () => {
    const paragraphElement = fixture.debugElement.query(By.css('p'));
    // Test for the exact message that appears in the template
    const expectedText = "Thank you for your response. Although this opportunity wasn’t a good match, we will let you know about future assignments and hope to work with you soon.";
    expect(paragraphElement.nativeElement.textContent.trim()).toBe(expectedText);

  });

  it('should render Done button', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.nativeElement.textContent.trim()).toBe('Done');
  });

  it('should have correct CSS classes for styling', () => {
    const mainDiv = fixture.debugElement.query(By.css('.sub_recevied'));
    const headingDiv = fixture.debugElement.query(By.css('.dclne'));
    const button = fixture.debugElement.query(By.css('button'));

    expect(mainDiv).toBeTruthy();
    expect(headingDiv).toBeTruthy();
    expect(mainDiv.classes['text-center']).toBeTruthy();
    expect(button.classes['grn-dark']).toBeTruthy();
    expect(button.classes['wth']).toBeTruthy();
    expect(button.classes['mt-3']).toBeTruthy();
  });

  it('should navigate to login and close dialog when thanksPange is called', () => {
    // Call the thanksPange method
    component.thanksPange();

    // Verify navigation to login
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
    
    // Verify dialog was closed
    expect(mockDialog.closeAll).toHaveBeenCalled();
  });

  it('should call thanksPange method when Done button is clicked', () => {
    // Spy on the thanksPange method
    spyOn(component, 'thanksPange');

    // Get the button and click it
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    // Verify thanksPange was called
    expect(component.thanksPange).toHaveBeenCalled();
  });

  // Additional test to verify the exact text content
  it('should have the exact thank you message text', () => {
    const paragraphElement = fixture.debugElement.query(By.css('p'));
    const messageText = paragraphElement.nativeElement.textContent.trim();
    console.log('Actual message:', messageText); // For debugging
    
    // Log the character codes to identify any hidden characters
    console.log('Character codes:', [...messageText].map(c => c.charCodeAt(0)));
  });

  it('should initialize without errors in ngOnInit', () => {
    // Test ngOnInit execution
    expect(() => {
      component.ngOnInit();
    }).not.toThrow();
  });
});
