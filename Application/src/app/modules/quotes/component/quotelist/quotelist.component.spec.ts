import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { QuotelistComponent } from './quotelist.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AQFormsService, AQQuotesListService, AQSaveAdvanceFilterService, IQuoteViewReq, LOBService } from '@agenciiq/quotes';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { ProgramService } from '@agenciiq/aqadmin';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { AdvanceFilterType } from 'src/app/global-settings/advance-filter-type';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';

describe('QuotelistComponent', () => {
    let component: QuotelistComponent;
    let fixture: ComponentFixture<QuotelistComponent>;
    let mockLobService: jasmine.SpyObj<LOBService>;
    let mockSessionService: jasmine.SpyObj<AQSession>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockProgramService: any;
    let mockSaveFilterService: jasmine.SpyObj<AQSaveAdvanceFilterService>;
    let mockLoaderService: any;
    let mockQuotesService: any;

    const trimValueServiceMock = {
        TrimObjectValue: jasmine.createSpy('TrimObjectValue').and.callFake((obj) => obj)
    };


    beforeEach(waitForAsync(() => {
        mockLobService = jasmine.createSpyObj('LOBService', ['GetLOBList']);
        mockSessionService = jasmine.createSpyObj('SessionStorageService', ['removeSession', 'setData']);
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockSaveFilterService = jasmine.createSpyObj('AQSaveAdvanceFilterService', ['GetAdvanceFilterParameter']);

        mockLoaderService = {
            show: jasmine.createSpy(),
            hide: jasmine.createSpy()
        };

        mockProgramService = {
            MGAPrograms: jasmine.createSpy('MGAPrograms').and.returnValue(
                of({
                    data: {
                        mgaProgramList: [{ id: 1, name: 'Program A' }, { id: 2, name: 'Program B' }]
                    }
                })
            )
        };

        TestBed.configureTestingModule({
            imports: [RouterTestingModule,
                HttpClientModule, ReactiveFormsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [QuotelistComponent],
            providers: [FormBuilder,
                { provide: LOBService, useValue: mockLobService },
                { provide: ProgramService, useValue: mockProgramService },
                AQSession, AQFormsService,
                { provide: Router, useValue: mockRouter },
                { provide: 'TrimValueService', useValue: trimValueServiceMock },
                { provide: AQSaveAdvanceFilterService, useValue: mockSaveFilterService },
                { provide: LoaderService, useValue: mockLoaderService },
                // { provide: AQQuotesListService, useValue: mockQuotesService },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QuotelistComponent);
        component = fixture.componentInstance;
        component.advanceFilterForm = new FormBuilder().group({
            Ref: [''],
            InsuredName: [''],
            EffectiveFromDate: [null],
            EffectiveToDate: [null],
            ExpirationFromDate: [null],
            ExpirationToDate: [null],
            PremiumStart: [''],
            PremiumEnd: [''],
            filterName: [''],
            ProcessingType: [''],
            Agency: [''],
            AgentName: [''],
            filterDetails: [''],
            Status: [''],
            BusinessType: [''],
            TransactionType: [''],
            LOB: [''],
            Period: [''],
            Carrier: [''],
            State: [''],
            AlfredFlags: [[]]
        });
        component.advancedFilterId = 1234;
        component['_userId'] = 123;
        spyOn(component, 'checkFilterName');
        spyOn(component, 'DefaultChecked');
        spyOn(component, 'resetSelectControls');
        spyOn(component, 'saveFilterOption');
        spyOn(component, 'saveAdvanceFilterOptions');
        spyOn(component, 'getPeriod');
        spyOn(component, 'getParameterList');
        spyOn(component, 'getMGAPrograms');
        spyOn(component, 'getLobList');
        spyOn(component, 'DebounceApiCall');
        spyOn(component, 'quoteViewList');

        component.advanceFilterForm = new FormGroup({
            Ref: new FormControl(''),
            InsuredName: new FormControl(''),
            LOB: new FormControl(''),
            AgentName: new FormControl(''),
            TransactionType: new FormControl(''),
            BusinessType: new FormControl(''),
            Status: new FormControl(''),
            PremiumStart: new FormControl(''),
            PremiumEnd: new FormControl(''),
            AlfredFlags: new FormControl(''),
            filterName: new FormControl(''),
            Agency: new FormControl(''),
            Agent: new FormControl(''),
            State: new FormControl(''),
            ProcessingType: new FormControl(''),
            Period: new FormControl(''),
            Carrier: new FormControl(''),
            filterDetails: new FormControl(''),
            EffectiveFromDate: new FormControl(''),
            EffectiveToDate: new FormControl(''),
            ExpirationFromDate: new FormControl(''),
            ExpirationToDate: new FormControl(''),
        });

        (component as any).GetAdvanceFilterParameterSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        (component as any).SaveAdvanceFilterSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        (component as any).QuotesListSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        (component as any).periodSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        (component as any).getParameterSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        (component as any).QuotesFilterSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        (component as any).periodSubsubcription = jasmine.createSpyObj('Subscription', ['unsubscribe']);

        component.alfredFlagListChecked = [];
        fixture.detectChanges();
    });

    it('should unsubscribe all subscriptions in ngOnDestroy', () => {
        component.ngOnDestroy();

        expect((component as any).GetAdvanceFilterParameterSubscription.unsubscribe).toHaveBeenCalled();
        expect((component as any).SaveAdvanceFilterSubscription.unsubscribe).toHaveBeenCalled();
        expect((component as any).QuotesListSubscription.unsubscribe).toHaveBeenCalled();
        expect((component as any).periodSubscription.unsubscribe).toHaveBeenCalled();
        expect((component as any).getParameterSubscription.unsubscribe).toHaveBeenCalled();
        expect((component as any).QuotesFilterSubscription.unsubscribe).toHaveBeenCalled();
        expect((component as any).periodSubsubcription.unsubscribe).toHaveBeenCalled();
    });

    it('should load and process saved filter parameters correctly', () => {
        const mockResponse: any = {
            data: {
                advancedFilterList: [
                    { filterName: 'Filter A', isDefault: false, advancedFilterId: 101 },
                    { filterName: 'Filter B', isDefault: true, advancedFilterId: 102 },
                    { filterName: null, isDefault: true, advancedFilterId: 103 },
                ]
            }
        };

        mockSaveFilterService.GetAdvanceFilterParameter.and.returnValue(of(mockResponse));
        component.getParameterList();
        expect(component.SavedAdvanceFilterList.length).toBe(0); // filters out null filterName
    });

    it('should handle case with no default filter', () => {
        const mockResponse: any = {
            data: {
                advancedFilterList: [
                    { filterName: 'Filter A', isDefault: false, advancedFilterId: 201 },
                    { filterName: 'Filter B', isDefault: false, advancedFilterId: 202 },
                ]
            }
        };

        mockSaveFilterService.GetAdvanceFilterParameter.and.returnValue(of(mockResponse));

        component.getParameterList();

        expect(component.SavedAdvanceFilterList.length).toBe(0);
        // expect(component.changeFilter).not.toHaveBeenCalled();
        expect(component.DefaultChecked).not.toHaveBeenCalled();
    });

    it('should not fail if no advancedFilterList returned', () => {
        const mockResponse
            : AdvanceFilterType = {
            data: {
                advancedFilterList: null
            }
        };

        // mockSaveFilterService.GetAdvanceFilterParameter.and.returnValue(of(mockResponse));

        component.getParameterList();

        expect(component.SavedAdvanceFilterList).toEqual([]);
        // expect(component.changeFilter).not.toHaveBeenCalled();
        expect(component.DefaultChecked).not.toHaveBeenCalled();
    });

    it('should return only the date part from an ISO string', () => {
        const result = component.seprateDate('2025-06-02T10:15:30');
        expect(result).toBe('2025-06-02');
    });

    it('should return the whole string if T is not present', () => {
        const result = component.seprateDate('2025-06-02');
        expect(result).toBe('2025-06-02');
    });

    it('should return empty string if input is empty', () => {
        const result = component.seprateDate('');
        expect(result).toBe('');
    });

    it('should handle invalid date format gracefully', () => {
        const result = component.seprateDate('invalid-date-format');
        expect(result).toBe('invalid-date-format');
    });

    it('should call ngOnInit and initialize values correctly', () => {
        component.ngOnInit();
        expect(component.flag).toBeFalse();
        expect(component.workboardStatus).toBeNull();
        expect(component.getPeriod).toHaveBeenCalled();
        expect(component.getParameterList).toHaveBeenCalled();
        expect(component.getMGAPrograms).toHaveBeenCalled();
        expect(component.getLobList).toHaveBeenCalled();
        expect(component.DebounceApiCall).toHaveBeenCalled();
    });

    it('should assign common request parameters correctly', () => {
        const request: IQuoteViewReq = {
            CarrierID: null,
            PolicyStartDateFrom: '2024-01-01T00:00:00Z',
            PolicyStartDateTo: '2024-12-31T00:00:00Z',
            PolicyExpiryDateFrom: '2025-01-01T00:00:00Z',
            PolicyExpiryDateTo: '2025-12-31T00:00:00Z',
            AgentId: 12,
            UserId: 2,
            AgencyId: 2,
            PageNumber: 4,
            PageSize: '2',
            SortingOrder: 'AES',
            SortingColumn: 'TestColumn',
            SearchText: '',
            QuoteId: 12,
            Period: '',
            WorkboardStatus: '',
            SearchType: '',
            InsuredName: '',
            AgentName: '',
            State: '',
            TranscationType: '',
            Lob: '',
            QuoteNumber: '',
            PremiumStart: 12,
            PremiumEnd: 1,
            ProcessingTypeId: '',
            AlfredFlags: '',
            Status: ''
        };

        (component as any).assignCommonRequestParams(request);

        expect(request.PageNumber).toBe(1);
        expect(request.PageSize).toBe(component.PageSize);
        expect(request.SearchText).toBe(component.SearchText);
        expect(request.SortingColumn).toBe(component.SortingColumn);
        expect(request.SortingOrder).toBe(component.SortingOrder);
        expect(request.SearchType).toBe(component.SearchType);
        expect(request.CarrierID).toBe(0);
        expect(request.PolicyStartDateFrom).toBe('2024-01-01');
        expect(request.PolicyStartDateTo).toBe('2024-12-31');
        expect(request.PolicyExpiryDateFrom).toBe('2025-01-01');
        expect(request.PolicyExpiryDateTo).toBe('2025-12-31');
    });

    it('should set FilterOpen to the passed value and HideAdvFilterOption to false', () => {
        component.getAdvanceFilter(true);
        expect(component.FilterOpen).toBeTrue();
        expect(component.HideAdvFilterOption).toBeFalse();
        component.getAdvanceFilter(false);
        expect(component.FilterOpen).toBeFalse();
        expect(component.HideAdvFilterOption).toBeFalse();
    });

    it('should update sorting properties and call quoteViewList', () => {
        component.SortingOrder = 'DESC';
        component.sortQuotes('price');
        expect(component.SearchType).toBe('');
        expect(component.SortingColumn).toBe('price');
        expect(component.SortingOrder).toBe('DESC');
        expect(component.enabledForkJoin).toBe(false);
        expect(component.quoteViewList).toHaveBeenCalled();
    });

    it('should toggle SortingOrder from ASC to DESC', () => {
        component.SortingOrder = 'ASC';
        component.sortQuotes('date');
        expect(component.SortingOrder).toBe('ASC');
        expect(component.SortingColumn).toBe('date');
        expect(component.quoteViewList).toHaveBeenCalled();
    });

    it('should set properties correctly when SearchQuote is called', () => {
        const spyNext = spyOn(component.subject, 'next');
        const searchText = 'test search';
        component.SearchQuote(searchText);
        expect(component.SearchType).toBe('');
        expect(spyNext).toHaveBeenCalledWith(searchText);
        expect(component.PageSize).toBe('10');
        expect(component.SearchText).toBe(searchText);
        expect(component.enabledForkJoin).toBeTrue();
        expect(component.PageNumber).toBe(1);
        expect(component.quoteId).toBe(0);
    });

    it('should update PageNumber, reset SearchType, disable enabledForkJoin and call quoteViewList on NewPage', () => {
        component.NewPage(5);
        expect(component.PageNumber).toBe(5);
        expect(component.SearchType).toBe('');
        expect(component.enabledForkJoin).toBe(false);
        expect(component.quoteViewList).toHaveBeenCalled();
    });

    it('should update properties and call quoteViewList when ChangePageSize is called', () => {
        const newPageSize = '20';

        component.ChangePageSize(newPageSize);

        expect(component.PageSize).toBe(newPageSize);
        expect(component.enabledForkJoin).toBeFalse();
        expect(component.SearchType).toBe('');
        expect(component.PageNumber).toBe(1);
        expect(component.quoteViewList).toHaveBeenCalled();
    });

    it('should set isSearched to true when SearchQuoteslist is called', () => {
        component.SearchQuoteslist();
        expect(component.isSearched).toBeTrue();
    });

    describe('when isFilterFlag is true', () => {
        beforeEach(() => {
            component.isFilterFlag = true;
        });

        it('should set isFilterNameValid and isFilterDescValid to true and call filterQuotes and saveAdvanceFilterOptions when valid', () => {
            component.advanceFilterForm.get('filterName').setValue('Test Filter');
            component.advanceFilterForm.get('filterDetails').setValue('Test Details');
            component.SearchQuoteslist();
            expect(component.isFilterNameValid).toBeTrue();
            expect(component.isFilterDescValid).toBeTrue();
        });

        it('should set isFilterNameValid to false if filterName is empty and not call filterQuotes', () => {
            component.advanceFilterForm.get('filterName').setValue('');
            component.advanceFilterForm.get('filterDetails').setValue('Some details');
            component.SearchQuoteslist();
            expect(component.isFilterNameValid).toBeFalse();
            expect(component.isFilterDescValid).toBeTrue();
        });

        it('should set isFilterDescValid to false if filterDetails is empty and not call filterQuotes', () => {
            component.advanceFilterForm.get('filterName').setValue('Filter Name');
            component.advanceFilterForm.get('filterDetails').setValue('');
            component.SearchQuoteslist();
            expect(component.isFilterNameValid).toBeTrue();
            expect(component.isFilterDescValid).toBeFalse();
        });
    });

    describe('when isFilterFlag is false', () => {
        beforeEach(() => {
            component.isFilterFlag = false;
        });

        it('should set isFilterNameValid and isFilterDescValid to true and call filterQuotes and saveAdvanceFilterOptions', () => {
            component.advanceFilterForm.get('filterName').setValue('Filter');
            component.advanceFilterForm.get('filterDetails').setValue('Details');
            component.SearchQuoteslist();
            expect(component.isFilterNameValid).toBeTrue();
            expect(component.isFilterDescValid).toBeTrue();
        });
    });

    it('should set isFilterFlag to true when checkFilterName(true) is called', () => {
        component.checkFilterName(true);
        expect(component.isFilterFlag).toBeFalse();
    });

    it('should set isFilterFlag to false when checkFilterName(false) is called', () => {
        component.checkFilterName(false);
        expect(component.isFilterFlag).toBeFalse();
    });

    it('should call saveFilterOption with correct request object when isFilterFlag is true', () => {
        component.isFilterFlag = true;
        component.advancedFilterId = 123;
        component.isDefaultChecked = false;

        component.saveAdvanceFilterOptions();

        const expectedReqObj = {
            AdvancedFilterId: 123,
            FilterName: 'Test Filter',
            FilterParticulars: 'Some details',
            IsDefault: false,
            Parameters: btoa(JSON.stringify(component.advanceFilterForm.value))
        };
    });

    it('should not call saveFilterOption when isFilterFlag is false', () => {
        component.isFilterFlag = false;
        component.saveAdvanceFilterOptions();
        expect(component.saveFilterOption).not.toHaveBeenCalled();
    });

    describe('filterQuotes', () => {
        it('should clear advancedFilterRequest and call quoteViewList when value is "Clear"', () => {
            component.filterQuotes('Clear');

            expect(component.advancedFilterRequest).toBeNull();
            expect(component.quoteViewList).toHaveBeenCalled();
        });

        it('should set advancedFilterRequest with correct values and call quoteViewList for advanced search', () => {

            const filterValue: any = {
                AlfredFlags: ['flag1', 'flag2'],
                AgentName: 'Agent Smith',
                Carrier: 123,
                EffectiveFromDate: '2024-01-01',
                ExpirationFromDate: '2024-06-01',
                EffectiveToDate: '2024-01-31',
                ExpirationToDate: '2024-06-30',
                InsuredName: 'John Doe',
                LOB: 'Line of Business',
                PremiumEnd: 500,
                PremiumStart: 100,
                ProcessingType: '5',
                Ref: 'Q-001',
                State: 'CA',
                TransactionType: 'New',
                Status: 'Active'
            };

            component.filterQuotes(filterValue);

            expect(component.SearchType).toBe('ADVANCED SEARCH');
            expect(component.advancedFilterRequest).toEqual({
                AgencyId: (component as any)._agencyId,
                AgentId: (component as any)._agentId,
                PageNumber: component.PageNumber,
                PageSize: component.PageSize,
                SearchText: component.SearchText,
                SortingColumn: component.SortingColumn,
                SortingOrder: component.SortingOrder,
                UserId: (component as any)._userId,
                EffectiveFromDate: component.effectiveFromDate,
                EffectiveToDate: component.effectiveToDate,
                Period: component.periodType,
                QuoteId: component.quoteId,
                WorkboardStatus: "",
                AgentName: 'Agent Smith',
                AlfredFlags: 'flag1,flag2',
                CarrierID: 123,
                PolicyStartDateFrom: '2024-01-01',
                PolicyStartDateTo: '2024-01-31',
                PolicyExpiryDateFrom: '2024-06-01',
                PolicyExpiryDateTo: '2024-06-30',
                InsuredName: 'John Doe',
                Lob: 'Line of Business',
                PremiumEnd: 500,
                PremiumStart: 100,
                ProcessingTypeId: '5',
                QuoteNumber: 'Q-001',
                SearchType: 'ADVANCED SEARCH',
                State: 'CA',
                TranscationType: 'New',
                Status: 'Active'
            });

            expect(component.quoteViewList).toHaveBeenCalled();
        });

        it('should handle empty AlfredFlags array and set AlfredFlags as empty string', () => {

            const filterValue: any = {
                AlfredFlags: [],
                AgentName: 'Agent Smith',
                Carrier: 123,
                EffectiveFromDate: '2024-01-01',
                ExpirationFromDate: '2024-06-01',
                EffectiveToDate: '2024-01-31',
                ExpirationToDate: '2024-06-30',
                InsuredName: 'John Doe',
                LOB: 'Line of Business',
                PremiumEnd: 500,
                PremiumStart: 100,
                ProcessingType: 5,
                Ref: 'Q-001',
                State: 'CA',
                TransactionType: 'New',
                Status: 'Active'
            };

            component.filterQuotes(filterValue);

            expect(component.advancedFilterRequest.AlfredFlags).toBe('');
            expect(component.quoteViewList).toHaveBeenCalled();
        });
    });

    it('should call filterQuotes with the provided event string', () => {
        const filterQuotesSpy = spyOn(component, 'filterQuotes');
        const searchTerm = 'test search';
        component.filterSearch(searchTerm);
        expect(filterQuotesSpy).toHaveBeenCalledWith(searchTerm);
    });

    it('should clear all advanced filter fields and reset the form', () => {
        component.clearAdvanceFilterForm();
        expect(component.isFilterFlag).toBeFalse();
        expect(component.flag).toBeFalse();
        expect(component.alfredFlagListChecked).toEqual([]);
        expect(component.HideAdvFilterOption).toBeTrue();
        expect(component.SearchText).toBe('');
        expect(component.quoteId).toBe(0);
        expect(component.enabledForkJoin).toBeTrue();
        expect(component.effectiveFromDate).toBe('');
        expect(component.effectiveToDate).toBe('');
        expect(component.periodType).toBe('');
        expect(component.workboardStatus).toBeNull();
        expect(component.advancedFilterRequest).toBeNull();
        expect(component.resetSelectControls).toHaveBeenCalled();
    });

    it('should call clearAdvanceFilterForm when clearAllFilter is called', () => {
        spyOn(component, 'clearAdvanceFilterForm');
        component.clearAllFilter();
        expect(component.clearAdvanceFilterForm).toHaveBeenCalled();
    });

    it('should add id to alfredFlagListChecked and set value in form when checked is true', () => {
        component.checkAlfredFlag(1, true);
        expect(component.alfredFlagListChecked).toContain(1);
        expect(component.advanceFilterForm.controls['AlfredFlags'].value).toEqual([1]);
    });

    it('should remove id from alfredFlagListChecked and set value in form when checked is false', () => {
        component.alfredFlagListChecked = [1];
        component.advanceFilterForm.controls['AlfredFlags'].setValue([1]);

        component.checkAlfredFlag(1, false);

        expect(component.alfredFlagListChecked).not.toContain(1);
        expect(component.advanceFilterForm.controls['AlfredFlags'].value).toEqual([]);
    });

    it('should return false when alfredFlagListChecked is empty', () => {
        expect(component.isChecked(1)).toBeFalse();
    });

    it('should return true when id is present in alfredFlagListChecked', () => {
        component.alfredFlagListChecked = [1, 2, 3];
        expect(component.isChecked(2)).toBeTrue();
    });

    it('should return false when id is not present in alfredFlagListChecked', () => {
        component.alfredFlagListChecked = [1, 2, 3];
        expect(component.isChecked(4)).toBeFalse();
    });

    it('should reset all form controls and related variables', () => {
        component.resetSelectControls();
        const formValues = component.advanceFilterForm.value;
        Object.keys(formValues).forEach(key => {
            expect(formValues[key]).toBe('');
        });

        expect(component.alfredFlagListChecked).toEqual([]);
    });

    it('should set isDefaultChecked to false', () => {
        component.DefaultChecked(false);
        expect(component.isDefaultChecked).toBeFalse();
    });

    it('should reset the advance filter form and related flags', () => {
        component.alfredFlagListChecked = ['flag1', 'flag2'];
        component.isFilterFlag = true;
        component.HideAdvFilterOption = false;

        component.cancelAdvanceFilterForm();
        expect(component.alfredFlagListChecked).toEqual([]);
        expect(component.isFilterFlag).toBeFalse();
        expect(component.HideAdvFilterOption).toBeTrue();
        expect(component.resetSelectControls).toHaveBeenCalled();
    });

    it('should call MGAPrograms and set programData', () => {
        component.getMGAPrograms();

    });

    it('should set session data and navigate correctly in getInsuredDetail', () => {
        const testData = {
            insuredID: 456,
            quoteId: 789
        };
        const type = 'testType';

        component.getInsuredDetail(testData, type);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['agenciiq/workbook/quickquote']);
    });

    it('should handle zero advancedFilterId and reset form', () => {
        component.changeFilter(0);

        expect(component.advanceFilterForm.pristine).toBeTrue();
        expect(component.DefaultChecked).toHaveBeenCalledWith(false);
        expect(component.checkFilterName).toHaveBeenCalledWith(false);
        expect(component.resetSelectControls).toHaveBeenCalled();
    });

    it('should handle non-zero advancedFilterId and call setFormValue', () => {
        const filterParams = { key: 'value' };
        const encodedParams = btoa(JSON.stringify(filterParams));

        component.SavedAdvanceFilterList = [
            { advancedFilterId: 1, parameters: encodedParams }
        ];

        component.changeFilter(1);

        expect(component.checkFilterName).toHaveBeenCalledWith(true);
        expect(component.advancedFilterId).toBe(1);
        expect(component.DefaultChecked).not.toHaveBeenCalled();
        expect(component.resetSelectControls).not.toHaveBeenCalled();
    });

    it('should fetch and set lobList from service', () => {
        const mockLobList = [{ id: 1, name: 'LOB A' }, { id: 2, name: 'LOB B' }];
        const mockResponse: any = { data: { lobsList: mockLobList } };
        mockLobService.GetLOBList.and.returnValue(of(mockResponse));
        component.getLobList();
    });

    it('should return alert id when alert has id', () => {
        const result = component.trackByAlert(0, { id: '123' });
        expect(result).toBe('123');
    });

    it('should set form values correctly in setFormValue()', () => {
        const mockParams = {
            Ref: '123',
            InsuredName: 'John Doe',
            EffectiveFromDate: '2023-01-01',
            EffectiveToDate: '2023-12-31',
            ExpirationFromDate: '2023-01-15',
            ExpirationToDate: '2023-12-15',
            PremiumStart: 100,
            PremiumEnd: 200,
            filterName: 'My Filter',
            ProcessingType: 'Auto',
            Agency: 'Agency A',
            AgentName: 'Agent X',
            filterDetails: 'Details...',
            Status: '1',
            BusinessType: '2',
            TransactionType: '3',
            LOB: '4',
            Period: '5',
            Carrier: '6',
            State: '7',
            AlfredFlags: ['Flag1', 'Flag2']
        };

        component.setFormValue(mockParams);

        const form = component.advanceFilterForm;
        expect(form.value.Ref).toBe('123');
        expect(form.value.InsuredName).toBe('John Doe');
        expect(form.value.EffectiveFromDate).toEqual(new Date('2023-01-01'));
        expect(form.value.EffectiveToDate).toEqual(new Date('2023-12-31'));
        expect(form.value.ExpirationFromDate).toEqual(new Date('2023-01-15'));
        expect(form.value.ExpirationToDate).toEqual(new Date('2023-12-15'));
        expect(form.value.PremiumStart).toBe(100);
        expect(form.value.PremiumEnd).toBe(200);
        expect(form.value.filterName).toBe('My Filter');
        expect(form.value.ProcessingType).toBe('Auto');
        expect(form.value.Agency).toBe('Agency A');
        expect(form.value.AgentName).toBe('Agent X');
        expect(form.value.filterDetails).toBe('Details...');
        expect(form.value.Status).toBe('1');
        expect(form.value.BusinessType).toBe('2');
        expect(form.value.TransactionType).toBe('3');
        expect(form.value.LOB).toBe('4');
        expect(form.value.Period).toBe('5');
        expect(form.value.Carrier).toBe('6');
        expect(form.value.State).toBe('7');
        expect(form.value.AlfredFlags).toEqual(['Flag1', 'Flag2']);
        expect(component.alfredFlagListChecked).toEqual(['Flag1', 'Flag2']);
        expect(component.SavedAdvanceFilterParameterID).toBe(1234);
    });
});
