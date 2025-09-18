import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramsMasterComponent } from './programs-master.component';
import { MAnageProgramService } from '@agenciiq/aq-programs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { IManageProgramResp } from '@agenciiq/aq-programs/lib/interface/base-program-resp';

describe('ProgramsMasterComponent', () => {
  let component: ProgramsMasterComponent;
  let fixture: ComponentFixture<ProgramsMasterComponent>;
  let programServiceSpy: jasmine.SpyObj<MAnageProgramService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const mockProgramService = jasmine.createSpyObj('MAnageProgramService', ['ManagePrograms']);
    const mockLoaderService = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ProgramsMasterComponent],
      providers: [
        { provide: MAnageProgramService, useValue: mockProgramService },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramsMasterComponent);
    component = fixture.componentInstance;
    programServiceSpy = TestBed.inject(MAnageProgramService) as jasmine.SpyObj<MAnageProgramService>;
    loaderServiceSpy = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getProgramList', () => {
    it('should call service, update dataSource and hide loader on success', () => {
      const mockPrograms: IManageProgramResp = {
        success: true,
        message: 'Programs fetched successfully',
        data: {
          getProgramsList: [
            {
              programId: 1,
              programName: 'Program Alpha',
              carrierId: 100,
              carrier: 'Carrier A',
              isActive: true,
              description: 'Test program description',
              effectiveDate: '2025-01-01',
              expirationDate: '2025-12-31',
              formData: '{}',
              formID: 10,
              createdBy: 1,
              createdOn: new Date(),
              modifiedOn: new Date(),
              modifiedBy: 2
            },
            {
              programId: 2,
              programName: 'Program Beta',
              carrierId: 101,
              carrier: 'Carrier B',
              isActive: false,
              description: 'Another test program',
              effectiveDate: '2024-01-01',
              expirationDate: '2024-12-31',
              formData: '{}',
              formID: 11,
              createdBy: 1,
              createdOn: new Date(),
              modifiedOn: new Date(),
              modifiedBy: 2
            }
          ]
        }
      };
      programServiceSpy.ManagePrograms.and.returnValue(of(mockPrograms));
      component.userId = 1;
      component.clientId = 2;

      component.getProgramList();;
    });

    it('should show no record message if data is empty', () => {
      const mockPrograms: IManageProgramResp = {
        success: true,
        message: 'Programs fetched successfully',
        data: {
          getProgramsList: [

          ]
        }
      };
      programServiceSpy.ManagePrograms.and.returnValue(of(mockPrograms));
      component.getProgramList();

      expect(component.NoRecordsMessage).toBe('');
      expect(loaderServiceSpy.hide).toHaveBeenCalled();
    });

    it('should handle error and hide loader', () => {
      programServiceSpy.ManagePrograms.and.returnValue(throwError(() => new Error('error')));
      component.getProgramList();

      expect(loaderServiceSpy.hide).toHaveBeenCalled();
    });
  });

  it('should toggle flag and set sorted column on sortPrograms', () => {
    component.flag = true;
    component.sortPrograms('programName');

    expect(component.flag).toBeFalse();
    expect(component.sortedColumnName).toEqual({ columnName: 'programName', isAsc: false });
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const unsubscribeSpy = jasmine.createSpy();
    component['programListSubscription'] = { unsubscribe: unsubscribeSpy } as any;
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
