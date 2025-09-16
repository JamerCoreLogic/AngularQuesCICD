import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplorerComponent } from './explorer.component';
import { ExplorerService } from './services/explorer.service';
import { CURRENT_VIEW } from './injection-tokens/tokens';
import { BehaviorSubject } from 'rxjs';
import { AvialableView } from './shared/types';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExplorerComponent', () => {
  let component: ExplorerComponent;
  let fixture: ComponentFixture<ExplorerComponent>;
  let explorerService: jasmine.SpyObj<ExplorerService>;
  let currentViewSubject: BehaviorSubject<AvialableView>;
  let secureViewSubject: BehaviorSubject<{ type: 'video' | 'pdf' | 'image', url: string } | null>;

  beforeEach(async () => {
    currentViewSubject = new BehaviorSubject<AvialableView>(AvialableView.List);
    secureViewSubject = new BehaviorSubject<{ type: 'video' | 'pdf' | 'image', url: string } | null>(null);

    const explorerServiceSpy = jasmine.createSpyObj('ExplorerService', ['clear'], {
      secureView$: secureViewSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [ExplorerComponent],
      providers: [
        { provide: ExplorerService, useValue: explorerServiceSpy },
        { provide: CURRENT_VIEW, useValue: currentViewSubject }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    explorerService = TestBed.inject(ExplorerService) as jasmine.SpyObj<ExplorerService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('View Management', () => {
    it('should initialize with list view', () => {
      expect(component.view).toBe(AvialableView.List);
    });

    it('should update view when current view changes', () => {
      currentViewSubject.next(AvialableView.Icon);
      expect(component.view).toBe(AvialableView.Icon);
    });

    it('should expose AvialableView enum', () => {
      expect(component.avialableView).toBe(AvialableView);
    });
  });

  describe('Secure View Management', () => {
    it('should initialize with null secure view', () => {
      expect(component.secureView).toBeNull();
    });

    it('should update secure view when it changes', () => {
      const mockSecureView = {
        type: 'pdf' as const,
        url: 'test.pdf'
      };

      secureViewSubject.next(mockSecureView);
      expect(component.secureView).toEqual(mockSecureView);
    });
  });

  describe('Cleanup', () => {
    it('should clear explorer service and unsubscribe on destroy', () => {
      const unsubscribeSpy = spyOn(component['sub'], 'unsubscribe');
      
      component.ngOnDestroy();
      
      expect(explorerService.clear).toHaveBeenCalled();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
