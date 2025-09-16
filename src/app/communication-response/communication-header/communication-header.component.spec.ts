import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunicationHeaderComponent } from './communication-header.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CommunicationHeaderComponent', () => {
  let component: CommunicationHeaderComponent;
  let fixture: ComponentFixture<CommunicationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationHeaderComponent ],
      imports: [ 
        MatTooltipModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with navbar', () => {
    const headerElement = fixture.debugElement.query(By.css('header'));
    const navbarElement = fixture.debugElement.query(By.css('nav'));
    
    expect(headerElement).toBeTruthy();
    expect(navbarElement).toBeTruthy();
    expect(navbarElement.classes['navbar']).toBeTruthy();
    expect(navbarElement.classes['navbar-expand-lg']).toBeTruthy();
    expect(navbarElement.classes['navbar-light']).toBeTruthy();
  });

  it('should render container-fluid div', () => {
    const containerElement = fixture.debugElement.query(By.css('.container-fluid'));
    expect(containerElement).toBeTruthy();
  });

  it('should render navbar-brand with logo image', () => {
    const navbarBrand = fixture.debugElement.query(By.css('.navbar-brand'));
    const logoImage = fixture.debugElement.query(By.css('img'));
    
    expect(navbarBrand).toBeTruthy();
    expect(logoImage).toBeTruthy();
    
    const imgElement = logoImage.nativeElement;
    const srcPath = imgElement.getAttribute('src');
    expect(srcPath).toContain('assets/assets/image/FPD Solutions Logo.png');
    expect(imgElement.alt).toBe('logo');
    expect(imgElement.width).toBe(250);
  });

  it('should have correct tooltip configuration', () => {
    const logoImage = fixture.debugElement.query(By.css('img'));
    
    expect(logoImage.attributes['matTooltip']).toBe('Field Pros Direct');
    expect(logoImage.attributes['matTooltipPosition']).toBe('right');
    expect(logoImage.attributes['matTooltipClass']).toBe('bg-light text-dark border border-info');
  });

  it('should have proper image styling classes', () => {
    const logoImage = fixture.debugElement.query(By.css('img'));
    expect(logoImage.classes['img-fluid']).toBeTruthy();
  });

  it('should have target="_blank" attribute on logo image', () => {
    const logoImage = fixture.debugElement.query(By.css('img'));
    expect(logoImage.attributes['target']).toBe('_blank');
  });
});
