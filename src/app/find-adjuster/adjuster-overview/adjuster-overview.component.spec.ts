import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdjusterOverviewComponent } from './adjuster-overview.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatLabel } from '@angular/material/form-field';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

describe('AdjusterOverviewComponent', () => {
  let component: AdjusterOverviewComponent;
  let fixture: ComponentFixture<AdjusterOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjusterOverviewComponent ],
      imports: [
        SharedMaterialModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjusterOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.Arrow).toBeFalse();
    expect(component.isToggleList).toBeFalse();
    expect(component.menuTrigger).toBeUndefined();
  });

  it('should handle menuTrigger input', () => {
    const mockMenuTrigger = {} as MatMenuTrigger;
    component.menuTrigger = mockMenuTrigger;
    expect(component.menuTrigger).toBeTruthy();
  });

  it('should toggle Arrow and isToggleList when toggleList is called', () => {
    // Initial state
    expect(component.Arrow).toBeFalse();
    expect(component.isToggleList).toBeFalse();

    // First toggle
    component.toggleList();
    expect(component.Arrow).toBeTrue();
    expect(component.isToggleList).toBeTrue();

    // Second toggle
    component.toggleList();
    expect(component.Arrow).toBeFalse();
    expect(component.isToggleList).toBeFalse();
  });

  it('should emit toggleArrow event when toggleList is called', () => {
    // Create spy for the output event
    spyOn(component.toggleArrow, 'emit');

    // Call toggleList
    component.toggleList();

    // Verify emit was called with the correct value
    expect(component.toggleArrow.emit).toHaveBeenCalledWith(true);

    // Toggle again
    component.toggleList();

    // Verify emit was called with the new value
    expect(component.toggleArrow.emit).toHaveBeenCalledWith(false);
  });

  it('should render adjuster list title', () => {
    const titleElement = fixture.debugElement.query(By.css('mat-label'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Adjuster List');
  });

  it('should render filter button with correct icon', () => {
    const buttonElement = fixture.debugElement.query(By.css('button[mat-icon-button]'));
    expect(buttonElement).toBeTruthy();

    const iconElement = buttonElement.query(By.css('mat-icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.nativeElement.textContent.trim()).toBe('menu');
  });

  it('should toggle icon class when filter button is clicked', () => {
    const buttonElement = fixture.debugElement.query(By.css('button[mat-icon-button]'));
    const iconElement = buttonElement.query(By.css('mat-icon'));

    // Initial state
    expect(iconElement.nativeElement.classList.contains('toggle-list')).toBeFalse();

    // Click button
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    // Check if class was added
    expect(iconElement.nativeElement.classList.contains('toggle-list')).toBeTrue();

    // Click again
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    // Check if class was removed
    expect(iconElement.nativeElement.classList.contains('toggle-list')).toBeFalse();
  });

  it('should render check icon image', () => {
    const imgElement = fixture.debugElement.query(By.css('img'));
    expect(imgElement).toBeTruthy();
    expect(imgElement.attributes['src']).toContain('check.png');
    expect(imgElement.attributes['alt']).toBe('check');
    expect(imgElement.styles['width']).toBe('24px');
  });

  it('should render mat-card with correct structure', () => {
    const cardElement = fixture.debugElement.query(By.css('mat-card'));
    expect(cardElement).toBeTruthy();

    const cardContentElement = cardElement.query(By.css('mat-card-content'));
    expect(cardContentElement).toBeTruthy();

    // Check for flex layout
    const computedStyle = window.getComputedStyle(cardContentElement.nativeElement);
    expect(computedStyle.display).toBe('flex');
  });

  it('should handle ngOnInit lifecycle hook', () => {
    spyOn(console, 'error');
    component.ngOnInit();
    expect(console.error).not.toHaveBeenCalled();
  });
});
