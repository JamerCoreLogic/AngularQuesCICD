import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramListComponent } from './program-list.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MAnageProgramService } from '@agenciiq/aq-programs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { AQUserInfo } from '@agenciiq/login';
import { AQSession } from 'src/app/global-settings/session-storage';

describe('ProgramListComponent', () => {
  let component: ProgramListComponent;
  let fixture: ComponentFixture<ProgramListComponent>;
  let mockProgramService: any;
  let mockLoaderService: any;
  let mockRouter: any;
  let mockPopupService: any;
  let mockUserInfo: any;
  let mockSession: any;

  beforeEach(async () => {
    mockProgramService = {
      ManagePrograms: jasmine.createSpy().and.returnValue(of({
        data: {
          getProgramsList: [
            { programName: 'Program A', programId: 1 },
            { programName: 'Program B', programId: 2 }
          ]
        }
      }))
    };

    mockLoaderService = {
      show: jasmine.createSpy(),
      hide: jasmine.createSpy()
    };

    mockRouter = {
      navigateByUrl: jasmine.createSpy()
    };

    mockPopupService = {};

    mockUserInfo = {
      UserId: jasmine.createSpy().and.returnValue(101)
    };

    mockSession = {
      setData: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      declarations: [ProgramListComponent],
      providers: [
        { provide: MAnageProgramService, useValue: mockProgramService },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: Router, useValue: mockRouter },
        { provide: PopupService, useValue: mockPopupService },
        { provide: AQUserInfo, useValue: mockUserInfo },
        { provide: AQSession, useValue: mockSession }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProgramList on init and populate dataSource', () => {
    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(mockProgramService.ManagePrograms).toHaveBeenCalledWith(101, undefined);
    expect(component.dataSource.length).toBe(2);
    expect(mockLoaderService.hide).toHaveBeenCalled();
  });

  it('should handle no records scenario', () => {
    mockProgramService.ManagePrograms.and.returnValue(of({ data: { getProgramsList: [] } }));
    component.getProgramList();
    expect(component.NoRecordsMessage).toBe('');
  });

  it('should handle error scenario in getProgramList', () => {
    mockProgramService.ManagePrograms.and.returnValue(throwError(() => new Error('Error')));
    component.getProgramList();
    expect(mockLoaderService.hide).toHaveBeenCalled();
  });

  it('should update sorting on sortPrograms', () => {
    component.sortPrograms('programName');
    expect(component.sortedColumnName).toEqual({ columnName: 'programName', isAsc: false });
  });

  it('should navigate to program form on addAqProgramForm', () => {
    const programData = { programName: 'Test Program' };
    component.addAqProgramForm('add', programData);
    expect(mockSession.setData).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('agenciiq/programs/aqProgram');
  });

  it('should unsubscribe in ngOnDestroy', () => {
    const subSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['programListSubscription'] = subSpy;
    component.ngOnDestroy();
    expect(subSpy.unsubscribe).toHaveBeenCalled();
  });
});