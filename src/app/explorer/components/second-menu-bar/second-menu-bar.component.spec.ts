import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecondMenuBarComponent } from './second-menu-bar.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SecondMenuBarComponent', () => {
  let component: SecondMenuBarComponent;
  let fixture: ComponentFixture<SecondMenuBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondMenuBarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Structure', () => {
    it('should have main container with correct class', () => {
      const container = fixture.debugElement.query(By.css('.nxe-second-menu-bar'));
      expect(container).toBeTruthy();
    });

    it('should have left section with breadcrumbs', () => {
      const leftSection = fixture.debugElement.query(By.css('.nxe-second-menu-bar-left'));
      expect(leftSection).toBeTruthy();
      
      const breadcrumbs = leftSection.query(By.css('app-breadcrumbs'));
      expect(breadcrumbs).toBeTruthy();
    });

    it('should have right section', () => {
      const rightSection = fixture.debugElement.query(By.css('.nxe-second-menu-bar-right'));
      expect(rightSection).toBeTruthy();
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should initialize without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });
});
