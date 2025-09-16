import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationFooterComponent } from './communication-footer.component';

describe('CommunicationFooterComponent', () => {
  let component: CommunicationFooterComponent;
  let fixture: ComponentFixture<CommunicationFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunicationFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentYear with the current year on ngOnInit', () => {
    const currentYear = new Date().getFullYear();
    component.ngOnInit();
    expect(component.currentYear).toBe(currentYear);
  });

  it('should display the current year in the template', () => {
    const currentYear = new Date().getFullYear();
    component.ngOnInit();
    fixture.detectChanges();
    
    const footerElement: HTMLElement = fixture.nativeElement;
    const paragraphText = footerElement.querySelector('p')?.textContent;
    
    expect(paragraphText).toContain(currentYear.toString());
    expect(paragraphText).toContain('FPD Solutions All Rights Reserved.');
  });

  it('should have the correct copyright text format', () => {
    const currentYear = new Date().getFullYear();
    component.ngOnInit();
    fixture.detectChanges();
    
    const footerElement: HTMLElement = fixture.nativeElement;
    const paragraphText = footerElement.querySelector('p')?.textContent?.trim();
    const expectedText = `© ${currentYear} FPD Solutions All Rights Reserved.`;
    
    expect(paragraphText).toBe(expectedText);
  });

  it('should render footer with correct CSS class', () => {
    const footerElement: HTMLElement = fixture.nativeElement;
    const divElement = footerElement.querySelector('div');
    
    expect(divElement).toBeTruthy();
    expect(divElement?.classList.contains('footer')).toBeTruthy();
  });
});
