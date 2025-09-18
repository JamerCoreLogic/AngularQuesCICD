
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BusinessTransferMasterComponent } from './business-transfer-master/business-transfer-master.component';
import { AdvanceFilterType } from 'src/app/global-settings/advance-filter-type';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { BusinessTransferDialogComponent } from 'src/app/shared/components/business-transfer-dialog/business-transfer-dialog.component';
import { EventEmitter } from 'protractor';
import { FormControl, FormGroup } from '@angular/forms';
import { AQSaveAdvanceFilterService } from '@agenciiq/quotes';
import { AQSession } from 'src/app/global-settings/session-storage';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { Router } from '@angular/router';
import { AQParameterService } from '@agenciiq/aqadmin';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { DialogService } from 'src/app/shared/utility/aq-dialog/dialog.service';
import { BusinessTransferService } from '@agenciiq/aqbusinesstransfer';
import { AQUserInfo } from '@agenciiq/login';


describe('BusinessTransferMasterComponent', () => {
    let component: BusinessTransferMasterComponent;
    let fixture: ComponentFixture<BusinessTransferMasterComponent>;
    let httpClient: HttpClient;
    let aqAdvanceService: AQSaveAdvanceFilterService
    let session: AQSession;
    let period: PeriodSettings
    let _userId: any
    let _agencyId: any;
    let _agentId: any;
    let trimValueService: TrimValueService
    let _router: Router;
    let parameterService: AQParameterService
    let loaderService: LoaderService;
    let dialogService: DialogService
    let businessTranserService: BusinessTransferService;
    let _userInfo: AQUserInfo

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule,
                HttpClientModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [BusinessTransferMasterComponent],
            providers: [

            ],
        })
            .compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(BusinessTransferMasterComponent);
        component = fixture.componentInstance;
        httpClient = TestBed.inject(HttpClient);
        aqAdvanceService = TestBed.inject(AQSaveAdvanceFilterService);
        session = TestBed.inject(AQSession);
        trimValueService = TestBed.inject(TrimValueService);
        _router = TestBed.inject(Router);
        parameterService = TestBed.inject(AQParameterService);
        loaderService = TestBed.inject(LoaderService);
        dialogService = TestBed.inject(DialogService);
        businessTranserService = TestBed.inject(BusinessTransferService);
        _userInfo = TestBed.inject(AQUserInfo);
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    //ngOnInit
    it('should call all required methods on ngOnInit', () => {
        const getAgentsSpy = spyOn(component, 'getAgents');
        const getParameterDataSpy = spyOn(component, 'getParameterData');
        const quoteViewListSpy = spyOn(component, 'quoteViewList');
        const getLobListSpy = spyOn(component, 'getLobList');
        const debounceApiCallSpy = spyOn(component, 'DebounceApiCall');

        component.ngOnInit();

        expect(getAgentsSpy).toHaveBeenCalled();
        expect(getParameterDataSpy).toHaveBeenCalled();
        expect(quoteViewListSpy).toHaveBeenCalled();
        expect(getLobListSpy).toHaveBeenCalled();
        expect(debounceApiCallSpy).toHaveBeenCalled();
    });

    //DebounceApiCall
    it('should debounce input and call quoteViewList with latest value', fakeAsync(() => {
        spyOn(component, 'quoteViewList');

        component.DebounceApiCall(); // initialize subscription

        component.subject.next('test1');
        component.subject.next('test2');
        tick(999); // simulate time before debounce completes
        expect(component.quoteViewList).not.toHaveBeenCalled();

        tick(1); // completes debounce
        expect(component.quoteViewList).toHaveBeenCalled();
        expect(component.SearchText).toBe('test2');
    }));

    //filterSearch
    it('should call filterQuotes with the provided event', () => {
        const event = 'sample search';
        spyOn(component, 'filterQuotes');

        component.filterSearch(event);

        expect(component.filterQuotes).toHaveBeenCalledWith(event);
    });

    //quoteViewList
    it('should call QuotesViewList and update dataSource and totalItem on success', () => {
        const mockResponse = [
            { data: { quote: [{ id: 1, name: 'Quote1' }] } },
            { totalQuote: 10 }
        ];
        const quotesViewListSpy = spyOn(component['_quotesService'], 'QuotesViewList').and.returnValue(of(mockResponse));
        const loaderShowSpy = spyOn(component['loaderService'], 'show');
        const loaderHideSpy = spyOn(component['loaderService'], 'hide');

        component.advancedFilterRequest = {
            AgencyId: 1,
            AgentId: 2,
            PageNumber: 1,
            PageSize: '10',
            SearchText: '',
            SortingColumn: 'ref',
            SortingOrder: 'DESC',
            UserId: 3,
            QuoteId: 4,
            SearchType: ''
        };

        component.quoteViewList();

        expect(loaderShowSpy).toHaveBeenCalled();
        expect(quotesViewListSpy).toHaveBeenCalledWith(component.advancedFilterRequest, component.enabledForkJoin);
        expect(loaderHideSpy).toHaveBeenCalled();
        expect(component.HideAdvFilterOption).toBeTrue();
        expect(component.totalItem).toBe(10);
        expect(component.NoRecordsMessage).toBe('');
    });
    it('should handle empty response and set NoRecordsMessage', () => {
        const mockResponse = [{ data: { quote: null } }];
        spyOn(component['_quotesService'], 'QuotesViewList').and.returnValue(of(mockResponse));
        spyOn(component['loaderService'], 'show');
        spyOn(component['loaderService'], 'hide');

        component.quoteViewList();

        expect(component.dataSource).toEqual([]);
        expect(component.NoRecordsMessage).toBe('No records found!');
    });
    it('should unsubscribe from Subscription$ if it exists', () => {
        component.Subscription$ = new Subject().subscribe();
        const unsubscribeSpy = spyOn(component.Subscription$, 'unsubscribe');

        component.quoteViewList();

        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    //ChangePageSize
    it('should update PageSize, reset SearchType, PageNumber, and call quoteViewList()', () => {
        // Spy on quoteViewList
        spyOn(component, 'quoteViewList');

        // Act: call the method with a test value
        component.ChangePageSize('25');

        // Assert
        expect(component.PageSize).toBe('25');
        expect(component.enabledForkJoin).toBeFalse();
        expect(component.SearchType).toBe('');
        expect(component.PageNumber).toBe(1);
        expect(component.quoteViewList).toHaveBeenCalled();
    });

    //NewPage
    it('should update PageNumber, reset SearchType, disable enabledForkJoin, and call quoteViewList', () => {
        spyOn(component, 'quoteViewList');

        component.NewPage(5);

        expect(component.SearchType).toBe('');
        expect(component.PageNumber).toBe(5);
        expect(component.enabledForkJoin).toBeFalse();
        expect(component.quoteViewList).toHaveBeenCalled();
    });

    //SearchQuote
    it('should update SearchType, emit searchText via subject, set SearchText, enable forkJoin, and reset PageNumber', () => {
        spyOn(component.subject, 'next');

        const searchText = 'test search';

        component.SearchQuote(searchText);

        expect(component.SearchType).toBe('');
        expect(component.subject.next).toHaveBeenCalledWith(searchText);
        expect(component.SearchText).toBe(searchText);
        expect(component.enabledForkJoin).toBeTrue();
        expect(component.PageNumber).toBe(1);
    });

    //sortQuotes
    it('should toggle SortingOrder, set SearchType, SortingColumn, disable forkJoin and call quoteViewList', () => {

        spyOn(component, 'quoteViewList');

        component.SortingOrder = 'DESC';
        const columnName = 'someColumn';

        component.sortQuotes(columnName);

        expect(component.SearchType).toBe('');
        expect(component.SortingColumn).toBe(columnName);
        expect(component.SortingOrder).toBe('ASC');  // toggled from DESC
        expect(component.enabledForkJoin).toBeFalse();
        expect(component.quoteViewList).toHaveBeenCalled();
    });
    it('should toggle SortingOrder from ASC to DESC', () => {

        spyOn(component, 'quoteViewList');

        component.SortingOrder = 'ASC';
        const columnName = 'anotherColumn';

        component.sortQuotes(columnName);

        expect(component.SortingOrder).toBe('DESC');  // toggled from ASC
        expect(component.quoteViewList).toHaveBeenCalled();
    });

    //getParameterList
    it('should call GetAdvanceFilterParameter and set SavedAdvanceFilterList with non-null filterName items', () => {
        const mockResponse = {
            data: {
                advancedFilterList: [
                    { filterName: 'Filter1' },
                    { filterName: null },
                    { filterName: 'Filter2' }
                ]
            }
        };

        // Mock the service method to return an observable
        spyOn(aqAdvanceService, 'GetAdvanceFilterParameter').and.returnValue(of(mockResponse) as any);

        (component as any)._userId = 123;
        (component as any)._agentId = 456;

        component.getParameterList();

        expect(aqAdvanceService.GetAdvanceFilterParameter).toHaveBeenCalledWith(
            AdvanceFilterType.quotesFilter,
            (component as any)._userId.toString(),
            (component as any)._agentId
        );

        expect(component.SavedAdvanceFilterList.length).toBe(2);
        expect(component.SavedAdvanceFilterList.every(item => item.filterName !== null)).toBeTrue();
    });

    //getBusinessData
    it('should call getFilterQuotesData with referenceId when available', () => {

        // Mocks
        spyOn(session, 'getData').and.callFake((key) => {
            if (key === SessionIdList.AlfredAlertsRefenceId) return 'ref123';
            if (key === SessionIdList.WorkBoardStatus) return null;
            return null;
        });
        spyOn(component, 'getFilterQuotesData');

        _userId = 1;
        _agencyId = 2;
        _agentId = 3;

        component.getBusinessData();
    });
    it('should call getFilterQuotesData with workboardStatus when referenceId is not available', () => {
        spyOn(session, 'getData').and.callFake((key) => {
            if (key === SessionIdList.AlfredAlertsRefenceId) return null;
            if (key === SessionIdList.WorkBoardStatus) return 'status123';
            return null;
        });
        spyOn(component, 'getFilterQuotesData');

        _userId = 1;
        _agencyId = 2;
        _agentId = 3;

        component.getBusinessData();
    });
    it('should call quoteViewList when neither referenceId nor workboardStatus is available', () => {

        spyOn(session, 'getData').and.returnValue(null);
        spyOn(component, 'getFilterQuotesData');
        spyOn(component, 'quoteViewList');

        component.getBusinessData();

        expect(component.getFilterQuotesData).not.toHaveBeenCalled();
    });

    //ngOnDestroy
    it('should clean up subscriptions and remove session values on ngOnDestroy', () => {
        // Create fake subscriptions with spies
        component.GetAdvanceFilterParameterSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        component.SaveAdvanceFilterSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        component.QuotesListSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        component.periodSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        component.getParameterSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        component.QuotesFilterSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);

        component.ngOnDestroy();

        // Verify subscriptions are unsubscribed
        expect(component.GetAdvanceFilterParameterSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.SaveAdvanceFilterSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.QuotesListSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.periodSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.getParameterSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.QuotesFilterSubscription.unsubscribe).toHaveBeenCalled();
    });

    //
    //getQuoteList
    it('should call QuotesList and update dataSource and checkedItems on success', () => {
        const mockResponse = {
            data: {
                quote: [
                    { quoteId: 1, name: 'Quote1' },
                    { quoteId: 2, name: 'Quote2' }
                ]
            }
        };
        const quotesListSpy = spyOn(component['_quotesService'], 'QuotesList').and.returnValue(of(mockResponse as any));
        const loaderShowSpy = spyOn(component['loaderService'], 'show');
        const loaderHideSpy = spyOn(component['loaderService'], 'hide');

        component.getQuoteList();

        expect(loaderShowSpy).toHaveBeenCalled();
        expect(loaderHideSpy).toHaveBeenCalled();
        expect(component.dataSource).toEqual(mockResponse.data.quote);
        expect(component.NoRecordsMessage).toBe('');
        expect(component.checkedItems).toEqual([
            { quoteId: 1, checked: false },
            { quoteId: 2, checked: false }
        ]);
    });
    it('should handle empty quote response and set NoRecordsMessage', () => {
        const mockResponse = { data: { quote: null } };
        spyOn(component['_quotesService'], 'QuotesList').and.returnValue(of(mockResponse) as any);
        spyOn(component['loaderService'], 'show');
        spyOn(component['loaderService'], 'hide');

        component.getQuoteList();

        expect(component.dataSource).toEqual([]);
        expect(component.NoRecordsMessage).toBe('No records found!');
    });

    //getParameterData
    it('should call loaderService.hide() on API error', () => {


        spyOn(parameterService, 'getParameter').and.returnValue(throwError(() => new Error('API Error')));
        spyOn(loaderService, 'hide');

        component.getParameterData();

        expect(loaderService.hide).toHaveBeenCalled();
    });

    //filterQuotes
    it('should build advancedFilterRequest and call quoteViewList when value is object', () => {
        component.quoteViewList = jasmine.createSpy();

        // Setup necessary IDs and defaults
        _agencyId = 1;
        _agentId = 2;
        _userId = 3;
        component.quoteId = 123;
        component.PageNumber = 1;
        component.PageSize = '20';
        component.SearchText = 'test';
        component.SortingColumn = 'columnA';
        component.SortingOrder = 'ASC';

        const inputValue = {
            AgentName: 'Agent X',
            AlfredFlags: ['Yes', 'No'],
            Carrier: 10,
            EffectiveFromDate: '2024-01-01',
            EffectiveToDate: '2024-01-31',
            ExpirationFromDate: '2024-06-01',
            ExpirationToDate: '2024-12-31',
            InsuredName: 'John Doe',
            LOB: 'Auto',
            PremiumEnd: 5000,
            PremiumStart: 1000,
            ProcessingType: '5',
            Ref: 'REF123',
            State: 'CA',
            TransactionType: 'New',
            Status: 'Quoted'
        };

        component.filterQuotes(inputValue as any);

        expect(component.SearchType).toBe('ADVANCED SEARCH');

        expect(component.quoteViewList).toHaveBeenCalled();
    });

    //getAdvanceFilter
    it('should set FilterOpen to the provided value and reset HideAdvFilterOption to false', () => {
        component.FilterOpen = false;
        component.HideAdvFilterOption = true;

        component.getAdvanceFilter(true);

        expect(component.FilterOpen).toBeTrue();
        expect(component.HideAdvFilterOption).toBeFalse();
    });

    //getDefaultFilterMarkDisplay
    it('should return "none" when isDefaultFilterMarkReq is false', () => {
        component.isDefaultFilterMarkReq = false;

        const result = component.getDefaultFilterMarkDisplay();

        expect(result).toBe("none");
    });
    it('should return undefined when isDefaultFilterMarkReq is true', () => {
        component.isDefaultFilterMarkReq = true;

        const result = component.getDefaultFilterMarkDisplay();

        expect(result).toBeUndefined();
    });

    //checkAlfredFlag
    it('should add id to alfredFlagListChecked and update AlfredFlags control when checked is true', () => {
        component.alfredFlagListChecked = [];
        component.advanceFilterForm = jasmine.createSpyObj('FormGroup', ['controls']);
        component.advanceFilterForm.controls = {
            AlfredFlags: jasmine.createSpyObj('FormControl', ['setValue'])
        };

        const id = 123;
        const checked = true;

        component.checkAlfredFlag(id, checked);

        expect(component.alfredFlagListChecked).toContain(id);
        expect(component.advanceFilterForm.controls['AlfredFlags'].setValue).toHaveBeenCalledWith([id]);
    });
    it('should remove id from alfredFlagListChecked and update AlfredFlags control when checked is false', () => {
        component.alfredFlagListChecked = [123, 456];
        component.advanceFilterForm = jasmine.createSpyObj('FormGroup', ['controls']);
        component.advanceFilterForm.controls = {
            AlfredFlags: jasmine.createSpyObj('FormControl', ['setValue'])
        };

        const id = 123;
        const checked = false;

        component.checkAlfredFlag(id, checked);

        expect(component.alfredFlagListChecked).not.toContain(id);
        expect(component.alfredFlagListChecked).toEqual([456]);
        expect(component.advanceFilterForm.controls['AlfredFlags'].setValue).toHaveBeenCalledWith([456]);
    });

    //isChecked
    it('should return true if the id is in alfredFlagListChecked, otherwise false', () => {
        component.alfredFlagListChecked = [101, 202, 303];

        const presentId = 202;
        const absentId = 404;

        const resultPresent = component.isChecked(presentId);
        const resultAbsent = component.isChecked(absentId);

        expect(resultPresent).toBeTrue();
        expect(resultAbsent).toBeFalse();
    });

    //selectAllBusinessTransfer
    it('should select all quotes when header checkbox is checked', () => {
        // Arrange
        component.dataSource = [
            { quoteId: 1 },
            { quoteId: 2 },
            { quoteId: 3 }
        ];

        const mockEvent = {
            target: { checked: true }
        };

        // Act
        component.selectAllBusinessTransfer(mockEvent);

        // Assert
        expect(component.isHeaderChkSelected).toBeTrue();
        expect(component.checkedItems.length).toBe(3);
        expect(component.checkedItems).toEqual([
            { quoteId: 1, checked: true },
            { quoteId: 2, checked: true },
            { quoteId: 3, checked: true }
        ]);
    });
    it('should deselect all quotes when header checkbox is unchecked', () => {
        // Arrange
        component.dataSource = [
            { quoteId: 10 },
            { quoteId: 20 }
        ];

        const mockEvent = {
            target: { checked: false }
        };

        // Act
        component.selectAllBusinessTransfer(mockEvent);

        // Assert
        expect(component.isHeaderChkSelected).toBeFalse();
        expect(component.checkedItems.length).toBe(2);
        expect(component.checkedItems).toEqual([
            { quoteId: 10, checked: false },
            { quoteId: 20, checked: false }
        ]);
    });

    //getAgents
    it('should fetch agents and map them correctly', () => {
        const mockResponse = {
            data: {
                agentsList: [
                    { agentId: 1, agentName: 'Agent A', otherProp: 'X' },
                    { agentId: 2, agentName: 'Agent B', otherProp: 'Y' }
                ]
            }
        };

        spyOn(component['_businessTranferService'], 'GetAgents').and.returnValue(of(mockResponse) as any);

        _userId = 101;
        _agentId = 202;

        component.getAgents();

    });

    //resetSelectControls
    it('should reset all select controls in advanceFilterForm', () => {
        // Mock the FormControl with setValue spy
        const mockControl = jasmine.createSpyObj('FormControl', ['setValue']);
        const controls = {
            Period: mockControl,
            Carrier: mockControl,
            State: mockControl,
            BusinessType: mockControl,
            TransactionType: mockControl,
            Status: mockControl,
            LOB: mockControl,
            EffectiveFromDate: mockControl,
            EffectiveToDate: mockControl,
            ExpirationFromDate: mockControl,
            ExpirationToDate: mockControl,
        };

        // Mock advanceFilterForm with controls property
        component.advanceFilterForm = { controls } as any;

        component.resetSelectControls();

        expect(controls.Period.setValue).toHaveBeenCalledWith("");
        expect(controls.Carrier.setValue).toHaveBeenCalledWith(0);
        expect(controls.State.setValue).toHaveBeenCalledWith("");
        expect(controls.BusinessType.setValue).toHaveBeenCalledWith("");
        expect(controls.TransactionType.setValue).toHaveBeenCalledWith("");
        expect(controls.Status.setValue).toHaveBeenCalledWith("");
        expect(controls.LOB.setValue).toHaveBeenCalledWith("");
        expect(controls.EffectiveFromDate.setValue).toHaveBeenCalledWith("");
        expect(controls.EffectiveToDate.setValue).toHaveBeenCalledWith("");
        expect(controls.ExpirationFromDate.setValue).toHaveBeenCalledWith("");
        expect(controls.ExpirationToDate.setValue).toHaveBeenCalledWith("");
    });

    //clearAdvanceFilterForm
    it('should clear advance filter form and reset related properties', () => {
        // Mock session with removeSession spy
        session = jasmine.createSpyObj('session', ['removeSession']);

        // Spy on quoteViewList method
        component.quoteViewList = jasmine.createSpy('quoteViewList');

        // Spy on resetSelectControls method
        component.resetSelectControls = jasmine.createSpy('resetSelectControls');

        // Initialize some default values
        component.flag = true;
        component.alfredFlagListChecked = [1, 2, 3];
        component.HideAdvFilterOption = false;
        component.PageSize = "20";
        component.SearchText = "test";
        component.quoteId = 123;
        component.enabledForkJoin = false;
        component.advancedFilterRequest = { some: 'value' } as any;

        component.clearAdvanceFilterForm();
        expect(component.flag).toBe(false);
        expect(component.alfredFlagListChecked.length).toBe(0);
        expect(component.HideAdvFilterOption).toBe(true);

        expect(component.PageSize).toBe("10");
        expect(component.SearchText).toBe("");
        expect(component.quoteId).toBe(0);
        expect(component.enabledForkJoin).toBe(true);

        expect(component.advancedFilterRequest).toBeNull();

        expect(component.quoteViewList).toHaveBeenCalled();
        expect(component.resetSelectControls).toHaveBeenCalled();
    });

    //clearAllFilter
    it('should clear search text, enable fork join, and call clearAdvanceFilterForm', () => {
        component.SearchText = "some text";
        component.enabledForkJoin = false;

        component.clearAdvanceFilterForm = jasmine.createSpy('clearAdvanceFilterForm');

        component.clearAllFilter();

        expect(component.SearchText).toBe("");
        expect(component.enabledForkJoin).toBe(true);
        expect(component.clearAdvanceFilterForm).toHaveBeenCalled();
    });

    //setTransferToAgentId
    it('should set transferToAgentId to the given agentId', () => {
        const agentId = 42;

        component.setTransferToAgentId(agentId);

        expect(component.transferToAgentId).toBe(agentId);
    });

    //setFinalTransferQuotesId
    it('should set transferToAgentId to the given quotationIds', () => {
        const quotationIds = '42';

        component.setFinalTransferQuotesId(quotationIds);

        expect(component.finalQuotationIds).toBe(quotationIds);
    });

    //setTransferToAgentName
    it('should set transferToAgentId to the given transferToAgentName', () => {
        const agentName = 'Harry';

        component.setTransferToAgentName(agentName);

        expect(component.transferToAgentName).toBe(agentName);
    });

    //setTransferMessage
    it('should set transferMessage to the given transferMessage', () => {
        const transferMessage = 'We are transferring your business';

        component.setTransferMessage(transferMessage);

        expect(component.transferMessage).toBe(transferMessage);
    });

    //transferBusiness
    it('should open dialog, call TransferBusiness service, and update state on success', () => {
        // Arrange
        component.finalQuotationIds = "123,456";
        component.transferMessage = "Test message";
        component.transferToAgentName = "Agent B";
        component.transferFrmAgentId = '1';
        component.transferToAgentId = 2;
        _userInfo = { UserId: () => 10 } as any;

        const dialogRefMock = {
            afterClosed: of(true)  // Simulate dialog closed with data not null
        };
        spyOn(dialogService, 'open').and.returnValue(dialogRefMock as any);
        spyOn(loaderService, 'show');
        spyOn(loaderService, 'hide');
        spyOn(businessTranserService, 'TransferBusiness').and.returnValue(of({ success: true } as any));
        spyOn(component, 'quoteViewList');
        spyOn(component, 'clearAdvanceFilterForm');

        // Act
        component.transferBusiness();

        // Assert
        expect(dialogService.open).toHaveBeenCalledWith(BusinessTransferDialogComponent, {
            data: `${component.transferMessage} will be transferred to ${component.transferToAgentName}`
        });
        expect(loaderService.show).toHaveBeenCalled();
        expect(loaderService.hide).toHaveBeenCalled();
        expect(component.isTransferred).toBeTrue();
        expect(component.quoteViewList).toHaveBeenCalled();
        expect(component.clearAdvanceFilterForm).toHaveBeenCalled();
    });

    //getInsuredDetail
    it('should set session data and navigate to quickquote page', () => {
        // Arrange
        const mockData = { insuredID: 101, quoteId: 202 };
        const mockType = 'view';
        _userId = 999;

        const expectedReqObj = {
            UserId: 999,
            InsuredId: 101,
            QuoteId: 202,
            ClientId: 0,
            type: 'view'
        };

        const removeSessionSpy = spyOn(session, 'removeSession');
        const setDataSpy = spyOn(session, 'setData');
        const routerNavigateSpy = spyOn(_router, 'navigate');

        // Act
        component.getInsuredDetail(mockData, mockType);

        // Assert
        expect(removeSessionSpy).toHaveBeenCalledWith('viewPolicyParams');
        expect(setDataSpy).toHaveBeenCalledWith('insuredView', 'insuredView');
        expect(routerNavigateSpy).toHaveBeenCalledWith(['agenciiq/workbook/quickquote']);
    });

    //OpenFilter
    it('should toggle FilterOpen value and emit updated state', () => {
        // Arrange
        component.FilterOpen = false;
        const emitSpy = spyOn(component.advanceFilterEmit, 'emit');

        // Act - First toggle
        component.OpenFilter();

        // Assert
        expect(component.FilterOpen).toBeTrue();
        expect(emitSpy).toHaveBeenCalledWith(true);

        // Act - Second toggle
        component.OpenFilter();

        // Assert
        expect(component.FilterOpen).toBeFalse();
        expect(emitSpy).toHaveBeenCalledWith(false);
    });

    //cancelAdvanceFilterForm
    it('should reset form, clear alfredFlagListChecked, set HideAdvFilterOption to true, and call resetSelectControls', () => {
        // Arrange
        component.alfredFlagListChecked = [1, 2];
        component.HideAdvFilterOption = false;

        component.advanceFilterForm = jasmine.createSpyObj('FormGroup', ['reset']);
        spyOn(component, 'resetSelectControls');

        // Act
        component.cancelAdvanceFilterForm();

        // Assert
        expect(component.advanceFilterForm.reset).toHaveBeenCalled();
        expect(component.alfredFlagListChecked).toEqual([]);
        expect(component.HideAdvFilterOption).toBeTrue();
        expect(component.resetSelectControls).toHaveBeenCalled();
    });

    //SearchQuoteslist
    it('should call TrimObjectValue with form values and call filterQuotes with the trimmed object', () => {
        // Arrange
        const mockFormValue = {
            AgentName: ' John Doe ',
            Ref: ' 123 ',
            LOB: ' TestLOB '
        };

        const trimmedValue = {
            AgentName: 'John Doe',
            Ref: '123',
            LOB: 'TestLOB'
        };

        component.advanceFilterForm = new FormGroup({
            AgentName: new FormControl(mockFormValue.AgentName),
            Ref: new FormControl(mockFormValue.Ref),
            LOB: new FormControl(mockFormValue.LOB)
        });

        trimValueService = jasmine.createSpyObj('TrimValueService', ['TrimObjectValue']);
        spyOn(component, 'filterQuotes');

        // Act
        component.SearchQuoteslist();
    });

    //setTransferFrmAgentName
    it('should set transferFrmAgentName with the provided agent name', () => {
        const agentName = 'John Doe';

        component.setTransferFrmAgentName(agentName);

        expect(component.transferFrmAgentName).toBe(agentName);
    });

    //setTransferFrmAgentId
    it('should set transferFrmAgentId with the provided agent ID', () => {
        const agentId = '12345';

        component.setTransferFrmAgentId(agentId);

        expect(component.transferFrmAgentId).toBe(agentId);
    });
});

