import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeFPDComponent } from './welcome-fpd.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('WelcomeFPDComponent', () => {
  let component: WelcomeFPDComponent;
  let fixture: ComponentFixture<WelcomeFPDComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<WelcomeFPDComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [WelcomeFPDComponent],
      imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeFPDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome header text', () => {
    const headerElement = fixture.debugElement.query(By.css('.welcome_page_header h1'));
    expect(headerElement.nativeElement.textContent).toBe('WELCOME TO THE FPD NETWORK !');
  });

  it('should display success message', () => {
    const successMessage = fixture.debugElement.query(By.css('.welcome_fpd_txt p'));
    expect(successMessage.nativeElement.textContent).toContain('Thank you for taking the time to complete our application!');
  });

  it('should display email instructions', () => {
    const emailInstructions = fixture.debugElement.queryAll(By.css('.welcome_fpd_txt p'))[1];
    expect(emailInstructions.nativeElement.textContent).toContain('Check your email for log-in credentials');
  });

  it('should display notification header', () => {
    const notificationHeader = fixture.debugElement.query(By.css('.notified_header h2'));
    expect(notificationHeader.nativeElement.textContent).toBe('Get notified faster by adding us to your contacts:');
  });

  it('should display QR code image', () => {
    const qrCodeImage = fixture.debugElement.query(By.css('.qr_code img'));
    expect(qrCodeImage.nativeElement.getAttribute('src')).toBe('../../../assets/assets/image/qr code.jpg');
    expect(qrCodeImage.nativeElement.alt).toBe('qr_code');
    expect(qrCodeImage.nativeElement.width).toBe(140);
  });

  it('should display contact email link', () => {
    const emailLink = fixture.debugElement.query(By.css('.welcome_fpd_txt a'));
    expect(emailLink.nativeElement.href).toContain('mailto:recruiting@fpdsolutions.com');
    expect(emailLink.nativeElement.textContent).toBe('recruiting@fpdsolutions.com');
  });

  it('should have close button with tooltip', () => {
    const closeButton = fixture.debugElement.query(By.css('.clse button'));
    expect(closeButton).toBeTruthy();
    
    const tooltip = fixture.debugElement.query(By.css('[matTooltip]'));
    expect(tooltip.attributes['matTooltip']).toBe('Close');
    expect(tooltip.attributes['matTooltipPosition']).toBe('above');
  });

  it('should close dialog when close button is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css('.clse button'));
    closeButton.nativeElement.click();
    fixture.detectChanges();
    
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should have proper styling classes', () => {
    const container = fixture.debugElement.query(By.css('.container'));
    expect(container.styles['max-width']).toBe('992px');

    const header = fixture.debugElement.query(By.css('.welcome_page_header'));
    expect(header.styles['height']).toBe('57px');
    
    // Get computed style for background color
    const headerElement = header.nativeElement;
    const computedStyle = window.getComputedStyle(headerElement);
    expect(computedStyle.backgroundColor).toBe('rgb(0, 177, 195)');
  });

  it('should have proper layout structure', () => {
    const container = fixture.debugElement.query(By.css('.container'));
    const row = fixture.debugElement.query(By.css('.row'));
    const header = fixture.debugElement.query(By.css('.welcome_page_header'));
    const content = fixture.debugElement.query(By.css('.welcome_fpd_txt'));
    
    expect(container).toBeTruthy();
    expect(row).toBeTruthy();
    expect(header).toBeTruthy();
    expect(content).toBeTruthy();
  });
});
