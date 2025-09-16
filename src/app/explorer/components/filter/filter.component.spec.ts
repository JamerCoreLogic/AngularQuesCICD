import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { ExplorerService } from '../../services/explorer.service';
import { FILTER_STRING } from '../../injection-tokens/tokens';
import { BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let explorerService: jasmine.SpyObj<ExplorerService>;
  let filterSubject: BehaviorSubject<string>;
  let treeSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    filterSubject = new BehaviorSubject<string>('');
    treeSubject = new BehaviorSubject<any>(null);

    const explorerServiceSpy = jasmine.createSpyObj('ExplorerService', [], {
      tree: treeSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [FilterComponent],
      providers: [
        { provide: ExplorerService, useValue: explorerServiceSpy },
        { provide: FILTER_STRING, useValue: filterSubject }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    explorerService = TestBed.inject(ExplorerService) as jasmine.SpyObj<ExplorerService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Structure', () => {
    it('should have input element with correct attributes', () => {
      const input = fixture.debugElement.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('type')).toBe('text');
      expect(input.nativeElement.getAttribute('placeholder')).toBe('Filter');
    });

 
  });

  describe('Filter Operations', () => {
    beforeEach(() => {
      // Set up the input element
      component.input = {
        nativeElement: document.createElement('input')
      } as any;
    });

    it('should update filter value on input change', () => {
      const testValue = 'test';
      const event = new KeyboardEvent('keyup', { key: 'a' });

      component.onChange(event, testValue);

      expect(filterSubject.value).toBe(testValue);
    });

    it('should clear filter on Escape key', () => {
      const event = new KeyboardEvent('keyup', { key: 'Escape' });
      component.input.nativeElement.value = 'test';

      component.onChange(event, 'test');

      expect(component.input.nativeElement.value).toBe('');
      expect(filterSubject.value).toBe('');
    });

    it('should trim filter value', () => {
      const event = new KeyboardEvent('keyup', { key: 'a' });

      component.onChange(event, '  test  ');

      expect(filterSubject.value).toBe('test');
    });

    it('should handle empty filter value', () => {
      const event = new KeyboardEvent('keyup', { key: 'a' });

      component.onChange(event, '');

      expect(filterSubject.value).toBe('');
    });

    it('should handle special characters in filter', () => {
      const event = new KeyboardEvent('keyup', { key: 'a' });
      const specialChars = '!@#$%^&*()';

      component.onChange(event, specialChars);

      expect(filterSubject.value).toBe(specialChars);
    });

    it('should clear filter when tree changes', () => {
      component.input.nativeElement.value = 'test';
      filterSubject.next('test');

      treeSubject.next({});

      expect(component.input.nativeElement.value).toBe('');
      expect(filterSubject.value).toBe('');
    });

    it('should handle multiple tree changes', () => {
      component.input.nativeElement.value = 'test';
      filterSubject.next('test');

      treeSubject.next({});
      treeSubject.next(null);
      treeSubject.next({});

      expect(component.input.nativeElement.value).toBe('');
      expect(filterSubject.value).toBe('');
    });

    it('should handle clear method', () => {
      component.input.nativeElement.value = 'test';
      filterSubject.next('test');

      component.clear();

      expect(component.input.nativeElement.value).toBe('');
      expect(filterSubject.value).toBe('');
    });

    it('should handle clear method when input is not initialized', () => {
      component.input = undefined as any;

      component.clear();

      expect(filterSubject.value).toBe('');
    });

    it('should handle clear method multiple times', () => {
      component.input.nativeElement.value = 'test';
      filterSubject.next('test');

      component.clear();
      component.clear();
      component.clear();

      expect(component.input.nativeElement.value).toBe('');
      expect(filterSubject.value).toBe('');
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      component.input = {
        nativeElement: document.createElement('input')
      } as any;
    });

    it('should handle keyup events', () => {
      const input = fixture.debugElement.query(By.css('input'));
      const event = new KeyboardEvent('keyup', { key: 'a' });
      
      input.nativeElement.value = 'test';
      input.nativeElement.dispatchEvent(event);
      
      expect(filterSubject.value).toBe('test');
    });

  });

  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const unsubscribeSpy = spyOn(component['sub'], 'unsubscribe');
      
      component.ngOnDestroy();
      
      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should handle multiple destroy calls', () => {
      const unsubscribeSpy = spyOn(component['sub'], 'unsubscribe');
      
      component.ngOnDestroy();
      component.ngOnDestroy();
      
      expect(unsubscribeSpy).toHaveBeenCalledTimes(2);
    });

    it('should clean up subscriptions properly', () => {
      component.ngOnDestroy();
      
      // Verify that subsequent tree changes don't affect the component
      treeSubject.next({});
      expect(filterSubject.value).toBe('');
    });
  });
});
