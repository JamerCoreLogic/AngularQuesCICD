import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSwitcherComponent } from './view-switcher.component';
import { CURRENT_VIEW } from '../../injection-tokens/tokens';
import { BehaviorSubject } from 'rxjs';
import { AvialableView } from '../../shared/types';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewSwitcherComponent', () => {
  let component: ViewSwitcherComponent;
  let fixture: ComponentFixture<ViewSwitcherComponent>;
  let currentViewSubject: BehaviorSubject<AvialableView>;

  beforeEach(async () => {
    currentViewSubject = new BehaviorSubject<AvialableView>(AvialableView.List);

    await TestBed.configureTestingModule({
      declarations: [ViewSwitcherComponent],
      providers: [
        { provide: CURRENT_VIEW, useValue: currentViewSubject }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose AvialableView enum', () => {
    expect(component.avialableView).toBe(AvialableView);
  });

  describe('View Switching', () => {
    it('should switch to Icon view', () => {
      component.setView(AvialableView.Icon);
      expect(currentViewSubject.value).toBe(AvialableView.Icon);
    });

    it('should switch to List view', () => {
      component.setView(AvialableView.List);
      expect(currentViewSubject.value).toBe(AvialableView.List);
    });

    it('should maintain current view until changed', () => {
      const initialView = currentViewSubject.value;
      expect(initialView).toBe(AvialableView.List);

      component.setView(AvialableView.Icon);
      expect(currentViewSubject.value).toBe(AvialableView.Icon);

      // View should stay as Icon until changed
      expect(currentViewSubject.value).toBe(AvialableView.Icon);
    });
  });
});
