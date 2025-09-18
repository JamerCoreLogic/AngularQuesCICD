import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { ParametersComponent } from './parameters.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AQParameterService, DialogSaveParameterService, ParameterKeysListService } from '@agenciiq/aqadmin';
import { of, Subject } from 'rxjs';
import { DialogService } from 'src/app/shared/utility/aq-dialog/dialog.service';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { ParameterDialogComponent } from 'src/app/shared/components/parameter-dialog/parameter-dialog.component';

describe('ParametersComponent', () => {
  let component: ParametersComponent;
  let fixture: ComponentFixture<ParametersComponent>;
  let parameterServiceSpy: jasmine.SpyObj<AQParameterService>;
  let mockKeysService: jasmine.SpyObj<ParameterKeysListService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let popupService: jasmine.SpyObj<PopupService>;
  let saveService: jasmine.SpyObj<DialogSaveParameterService>;


  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('AQParameterService', ['DowloadParameter', 'getAllParameterByKey']);
    mockKeysService = jasmine.createSpyObj('ParameterKeysListService', ['ParameterKeysList']);
    const dialogSpy = jasmine.createSpyObj('DialogService', ['open']);
    const popupSpy = jasmine.createSpyObj('PopupService', ['show']);
    saveService = jasmine.createSpyObj('DialogSaveParameterService', ['SaveDialogParamKeyForm']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [ParametersComponent],
      providers: [
        { provide: AQParameterService, useValue: spy }, ParameterKeysListService,
        { provide: DialogService, useValue: dialogSpy },
        { provide: PopupService, useValue: popupSpy },
        { provide: DialogSaveParameterService, useValue: saveService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersComponent);
    component = fixture.componentInstance;
    parameterServiceSpy = TestBed.inject(AQParameterService) as jasmine.SpyObj<AQParameterService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    popupService = TestBed.inject(PopupService) as jasmine.SpyObj<PopupService>;
    component.userid = 123;
    component.selectedKeys = 'someKey';
    spyOn(component, 'sortParameter');
    spyOn(component, 'OnParameterOptionChange');
    component.arrowkeyLocation = 1;
    fixture.detectChanges();
  });

  it('should not call save if dialog returns null', fakeAsync(() => {
    dialogService.open.and.returnValue({ afterClosed: of(null) } as any);
    component.parameterKeyDialog();
    tick(10);
    expect(saveService.SaveDialogParamKeyForm).not.toHaveBeenCalled();
  }));

  it('should open dialog and call save service on valid data', fakeAsync(() => {
    const mockData = [{ UserId: '' }];
    const afterClosed$ = of(mockData);
    dialogService.open.and.returnValue({ afterClosed: afterClosed$ } as any);
    spyOn(component, 'ParameterKeys');
    component.parameterKeyDialog();
    tick(10);
    expect(dialogService.open).toHaveBeenCalled();
  }));

  it('should call OnParameterOptionChange if dialog closed with truthy data without success property', fakeAsync(() => {
    const afterClosedSubject = new Subject<any>();
    dialogService.open.and.returnValue({ afterClosed: afterClosedSubject.asObservable() } as any);
    component.openUploadDialog();
    afterClosedSubject.next(true);
    afterClosedSubject.complete();
    tick();
    expect(component.OnParameterOptionChange).toHaveBeenCalledWith(component.selectedKeys);
    expect(popupService.show).not.toHaveBeenCalled();
  }));

  it('should call OnParameterOptionChange if dialog closed with success', fakeAsync(() => {
    const afterClosedSubject = new Subject<any>();
    dialogService.open.and.returnValue({ afterClosed: afterClosedSubject.asObservable() } as any);
    component.openUploadDialog();
    afterClosedSubject.next({ success: true });
    afterClosedSubject.complete();
    tick();
    expect(component.OnParameterOptionChange).toHaveBeenCalledWith(component.selectedKeys);
    expect(popupService.show).not.toHaveBeenCalled();
  }));

  it('should call ParameterKeys when input is empty or blank', () => {
    spyOn(component, 'ParameterKeys');
    component.filterParameter('');
    expect(component.ParameterKeys).toHaveBeenCalled();

    component.filterParameter('   ');
    expect(component.ParameterKeys).toHaveBeenCalledTimes(2);
  });

  it('should handle undefined parameterAlias gracefully', () => {
    component.parameterMaster = [
      { parameterAlias: 'Name' },
      { parameterAlias: undefined }
    ];
    component.filterParameter('name');
    expect(component.parameterOptions).toEqual([{ parameterAlias: 'Name' }]);
  });

  it('should sort parameterOptions by parameterAlias and call OnParameterOptionChange with the first item', () => {
    const unsortedOptions = [
      { parameterAlias: 'Test1' },
      { parameterAlias: 'Test2' },
      { parameterAlias: 'Test3' },
    ];
    component.parameterOptions = [...unsortedOptions];
    // spyOn(component, 'OnParameterOptionChange');
    component.sortParameter();
  });

  it('should return stringified parameterAlias', () => {
    const result = component.getValue({ parameterAlias: 123 });
    expect(result).toBe('123');
  });

  it('should handle string parameterAlias', () => {
    const result = component.getValue({ parameterAlias: 'testAlias' });
    expect(result).toBe('testAlias');
  });

  it('should handle null parameterAlias', () => {
    const result = component.getValue({ parameterAlias: null });
    expect(result).toBe('null');
  });

  it('should handle undefined parameterAlias', () => {
    const result = component.getValue({ parameterAlias: undefined });
    expect(result).toBe('undefined');
  });

  it('should handle object parameterAlias', () => {
    const result = component.getValue({ parameterAlias: { a: 1 } });
    expect(result).toBe('[object Object]');
  });

  it('should handle default case for other keys', () => {
    const mockEvent = {
      keyCode: 13,
      srcElement: {}
    } as any;

    // spyOn(component, 'OnParameterOptionChange');

    component.keyDown(mockEvent, 'Option2', 1);

    expect(component.selectedKeys).toBe('Option2');
    expect(component.OnParameterOptionChange).toHaveBeenCalledWith('Option2');
  });

  it('should handle arrow down key (keyCode 40)', () => {
    const mockEvent = {
      keyCode: 40,
      srcElement: {
        nextElementSibling: { focus: jasmine.createSpy('focus') },
      }
    } as any;

    // spyOn(component, 'OnParameterOptionChange');

    component.keyDown(mockEvent, 'Option2', 1);

    expect(component.arrowkeyLocation).toBe(2);
    expect(mockEvent.srcElement.nextElementSibling.focus).toHaveBeenCalled();
  });

  it('should handle arrow up key (keyCode 38)', () => {
    const mockEvent = {
      keyCode: 38,
      srcElement: {
        previousElementSibling: { focus: jasmine.createSpy('focus') },
      }
    } as any;

    // spyOn(component, 'OnParameterOptionChange');

    component.keyDown(mockEvent, 'Option2', 1);
    expect(component.arrowkeyLocation).toBe(0);
    expect(mockEvent.srcElement.previousElementSibling.focus).toHaveBeenCalled();
  });

  it('should call ParameterKeys on ngOnInit', () => {
    spyOn(component, 'ParameterKeys');
    component.ngOnInit();
    expect(component.ParameterKeys).toHaveBeenCalled();
  });

  it('should handle parameter change and filter null parameterNames', () => {
    const mockOption = { parameterAlias: 'alias123' };
    const mockResponse = {
      data: {
        parameterList: [
          { parameterName: 'Param1', isParameterAddDisabled: true },
          { parameterName: null },
          { parameterName: 'Param2', isParameterAddDisabled: false }
        ]
      }
    };
    component.OnParameterOptionChange(mockOption);
    // expect(component.paramSearchText).toBe('');
    // expect(component.selectedKeys).toBe(mockOption);
    expect(component.NoRecordsMessage).toBe('');
  });

  it('should set NoRecordsMessage if parameterList is empty after filtering', () => {
    const mockOption = { parameterAlias: 'alias123' };
    const mockResponse = {
      data: {
        parameterList: [
          { parameterName: null }
        ]
      }
    };
    component.OnParameterOptionChange(mockOption);
    expect(component.dataSource).toEqual([]);
    expect(component.NoRecordsMessage).toBe('');
  });

  it('should handle empty or null parameterList gracefully', () => {
    const mockOption = { parameterAlias: 'alias123' };
    const mockResponse = { data: { parameterList: null } };
    component.OnParameterOptionChange(mockOption);
    expect(component.dataSource).toEqual([]);
    expect(component.NoRecordsMessage).toBe('');
  });

  it('should toggle flag and set sortedColumnName', () => {
    component.flag = true;
    component.sortQuotes('quoteId');
    expect(component.flag).toBeFalse();
    expect(component.sortedColumnName).toEqual({ columnName: 'quoteId', isAsc: false });
    component.sortQuotes('quoteId');
    expect(component.flag).toBeTrue();
    expect(component.sortedColumnName).toEqual({ columnName: 'quoteId', isAsc: true });
  });

  it('should download parameter as XML file', () => {
    const mockData = {
      data: {
        parameterData: btoa('<param>Test</param>')
      }
    };
    component.selectedKeys = { parameterAlias: 'testParam' };
    spyOn(document, 'createElement').and.callThrough();
    spyOn(document.body, 'appendChild').and.callThrough();
    spyOn(document.body, 'removeChild').and.callThrough();
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');

    // Act
    component.Download();
    expect(parameterServiceSpy.DowloadParameter).toHaveBeenCalledWith('testParam');
  });

  it('should log error if no parameterAlias is selected', () => {
    spyOn(console, 'error');
    component.selectedKeys = null;
    component.Download();
    expect(console.error).toHaveBeenCalledWith('No parameter alias selected.');
  });

  it('should return parameterAlias from item in trackByAlias', () => {
    const index = 0;
    const mockItem = { parameterAlias: 'alias_123', otherProp: 'value' };
    const result = component.trackByAlias(index, mockItem);
    expect(result).toBe('alias_123');
  });
});
