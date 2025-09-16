import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThanksFpdComponent } from './thanks-fpd.component';
import { CommunicationHeaderComponent } from '../communication-header/communication-header.component';
import { CommunicationFooterComponent } from '../communication-footer/communication-footer.component';
import { By } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

describe('ThanksFpdComponent', () => {
  let component: ThanksFpdComponent;
  let fixture: ComponentFixture<ThanksFpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        ThanksFpdComponent,
        CommunicationHeaderComponent,
        CommunicationFooterComponent
      ],
      imports: [
        MatTooltipModule,
        BrowserAnimationsModule,
        SharedMaterialModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThanksFpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header and footer components', () => {
    const header = fixture.debugElement.query(By.css('app-communication-header'));
    const footer = fixture.debugElement.query(By.css('app-communication-footer'));
    
    expect(header).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  it('should display thank you message', () => {
    const headerElement = fixture.debugElement.query(By.css('.front__text-header'));
    expect(headerElement.nativeElement.textContent).toContain('THANK YOU FOR RESPONDING !');
  });

  it('should display subscription message', () => {
    const hoverText = fixture.debugElement.query(By.css('.front__text-hover'));
    expect(hoverText.nativeElement.textContent).toContain('Now Subscribe to our Blog');
  });

  it('should render all social media links', () => {
    const socialLinks = fixture.debugElement.queryAll(By.css('.social-icon'));
    expect(socialLinks.length).toBe(4); // Facebook, Twitter, LinkedIn, Instagram
  });

  it('should have correct Facebook link', () => {
    const facebookLink = fixture.debugElement.query(By.css('a[href="https://www.facebook.com/FieldProsDirect"]'));
    expect(facebookLink).toBeTruthy();
    expect(facebookLink.nativeElement.href).toContain('facebook.com/FieldProsDirect');
  });

  it('should have social media icons with correct classes', () => {
    const socialIcons = fixture.debugElement.queryAll(By.css('.fab'));
    const expectedClasses = ['fa-facebook', 'fa-twitter', 'fa-linkedin', 'fa-instagram'];
    
    socialIcons.forEach((icon, index) => {
      expect(icon.nativeElement.classList.contains(expectedClasses[index])).toBeTrue();
    });
  });

  it('should have proper structure with front and back sections', () => {
    const frontSection = fixture.debugElement.query(By.css('.front'));
    const backSection = fixture.debugElement.query(By.css('.back'));
    
    expect(frontSection).toBeTruthy();
    expect(backSection).toBeTruthy();
  });






  it('should initialize without errors in ngOnInit', () => {
    expect(() => {
      component.ngOnInit();
    }).not.toThrow();
  });
});
