import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmissionReceivedComponent } from './submission-received.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

describe('SubmissionReceivedComponent', () => {
  let component: SubmissionReceivedComponent;
  let fixture: ComponentFixture<SubmissionReceivedComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);

    await TestBed.configureTestingModule({
      declarations: [ SubmissionReceivedComponent ],
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

    fixture = TestBed.createComponent(SubmissionReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render opportunity accepted heading', () => {
    const headingElement = fixture.debugElement.query(By.css('h2'));
    expect(headingElement.nativeElement.textContent.trim()).toBe('Opportunity Accepted');
  });

  it('should render thank you message', () => {
    const paragraphElement = fixture.debugElement.query(By.css('p'));
    const actualText = paragraphElement.nativeElement.textContent
      .trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, ' ');

    const expectedText = 'Thank you for your response and for your willingness to help us out with this assignment. If you are matched with this claim, someone will contact you to to discuss the fee schedule and finalize the assignment.';
    expect(actualText).toBe(expectedText);
  });

  it('should render Done button', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.nativeElement.textContent.trim()).toBe('Done');
  });

  it('should have correct CSS classes for styling', () => {
    const mainDiv = fixture.debugElement.query(By.css('.sub_recevied'));
    const contentDiv = fixture.debugElement.query(By.css('.recevied_content'));
    const button = fixture.debugElement.query(By.css('button'));

    expect(mainDiv).toBeTruthy();
    expect(contentDiv).toBeTruthy();
    
    // Check if elements have the required classes
    expect(mainDiv.nativeElement.classList.contains('sub_recevied')).toBeTrue();
    expect(contentDiv.nativeElement.classList.contains('recevied_content')).toBeTrue();
    expect(button.nativeElement.classList.contains('grn-dark')).toBeTrue();
  });

  it('should have correct title attribute on anchor tag', () => {
    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor.attributes['title']).toBe('Opportunity Accepted');
  });

  it('should navigate to login and close dialog when thanksPange is called', () => {
    component.thanksPange();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
    expect(mockDialog.closeAll).toHaveBeenCalled();
  });

  it('should call thanksPange method when Done button is clicked', () => {
    spyOn(component, 'thanksPange');
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    expect(component.thanksPange).toHaveBeenCalled();
  });

  it('should initialize without errors in ngOnInit', () => {
    expect(() => {
      component.ngOnInit();
    }).not.toThrow();
  });

  it('should have proper structure of nested elements', () => {
    const mainDiv = fixture.debugElement.query(By.css('.sub_recevied'));
    const contentDiv = fixture.debugElement.query(By.css('.recevied_content'));
    const anchor = fixture.debugElement.query(By.css('a'));
    const heading = fixture.debugElement.query(By.css('h2'));
    const paragraph = fixture.debugElement.query(By.css('p'));

    expect(mainDiv).toBeTruthy();
    expect(contentDiv).toBeTruthy();
    expect(anchor).toBeTruthy();
    expect(heading).toBeTruthy();
    expect(paragraph).toBeTruthy();

    // Check element nesting using contains() instead of direct parent comparison
    expect(mainDiv.nativeElement.contains(contentDiv.nativeElement)).toBeTrue();
    expect(contentDiv.nativeElement.contains(anchor.nativeElement)).toBeTrue();
    expect(anchor.nativeElement.contains(heading.nativeElement)).toBeTrue();
  });
});
