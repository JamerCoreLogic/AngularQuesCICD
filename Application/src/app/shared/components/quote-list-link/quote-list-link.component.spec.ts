import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuoteListLinkComponent } from './quote-list-link.component';
import { AQSession } from 'src/app/global-settings/session-storage';
import { EventEmitter } from '@angular/core';

describe('QuoteListLinkComponent', () => {
  let component: QuoteListLinkComponent;
  let fixture: ComponentFixture<QuoteListLinkComponent>;
  let mockSessionService: jasmine.SpyObj<AQSession>;

  beforeEach(waitForAsync(() => {
    const sessionSpy = jasmine.createSpyObj('AQSession', ['removeSession']);
    TestBed.configureTestingModule({
      declarations: [QuoteListLinkComponent],
      providers: [{ provide: AQSession, useValue: sessionSpy }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteListLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockSessionService = TestBed.inject(AQSession) as jasmine.SpyObj<AQSession>;
    component.TransferViewPolicyParam = new EventEmitter<any>();

    component.item = {
      data: [
        { status: 'Open' },
        { status: 'InProgress' },
        { status: 'Closed' }
      ]
    }
  });

  it('should remove sessions and emit correct view policy data', () => {
    const quoteId = 123;
    const formId = 456;
    const item = { some: 'data' };
    const actionName = 'View';

    spyOn(component.TransferViewPolicyParam, 'emit');

    component.setViewPolicyData(quoteId, formId, item, actionName);

    expect(mockSessionService.removeSession).toHaveBeenCalledWith('IsNavigationFromFQ');
    expect(mockSessionService.removeSession).toHaveBeenCalledWith('IsNavigationFrom');

    expect(component.TransferViewPolicyParam.emit).toHaveBeenCalledWith({
      quoteId: quoteId,
      formId: formId,
      actionName: actionName,
      quoteDetails: item
    });
  });

  it('should set identifier to "convelo.agenciiq.net" if host includes localhost', () => {
    component.ngOnInit();
    expect(component.identifier).toBe('convelo.agenciiq.net');
  });

  it('should return true if the status exists (case-insensitive)', () => {
    expect(component.IsStageAvailable('open')).toBeTrue();
    expect(component.IsStageAvailable('INPROGRESS')).toBeTrue();
    expect(component.IsStageAvailable('closed')).toBeTrue();
  });

  it('should return false if the status does not exist', () => {
    expect(component.IsStageAvailable('Pending')).toBeFalse();
  });

  it('should return correct count for a given status (case insensitive)', () => {
    component.item = {
      data: [
        { status: 'Open' },
        { status: 'Closed' },
        { status: 'open' },
        { status: 'InProgress' }
      ]
    };

    const count = component.StageCount('OPEN');
    expect(count).toBe(2);
  });

  it('should return 0 if no stages match the given status', () => {
    component.item = {
      data: [
        { status: 'Open' },
        { status: 'Closed' },
        { status: 'InProgress' }
      ]
    };

    const count = component.StageCount('Resolved');
    expect(count).toBe(0);
  });
});
