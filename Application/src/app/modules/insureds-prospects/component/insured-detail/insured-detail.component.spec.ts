import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InsuredDetailComponent } from './insured-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AQSession } from 'src/app/global-settings/session-storage';

describe('InsuredDetailComponent', () => {
  let component: InsuredDetailComponent;
  let fixture: ComponentFixture<InsuredDetailComponent>;
  let mockSessionService: jasmine.SpyObj<AQSession>;

  beforeEach(waitForAsync(() => {
    const sessionSpy = jasmine.createSpyObj('SessionService', ['getData']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [InsuredDetailComponent],
      providers: [
        { provide: AQSession, useValue: sessionSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredDetailComponent);
    component = fixture.componentInstance;
    mockSessionService = TestBed.inject(AQSession) as jasmine.SpyObj<AQSession>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set insuredDetail and FormDefinition on ngOnInit', () => {
    const mockInsuredDetail = {
      formDefinition: { field: 'value' }
    };
    mockSessionService.getData.and.returnValue(mockInsuredDetail);
    component.ngOnInit();
    expect(mockSessionService.getData).toHaveBeenCalledWith('insuredDetails');
    expect(component.insuredDetail).toEqual(mockInsuredDetail);
    expect(component.FormDefinition).toEqual(mockInsuredDetail.formDefinition);
  });

  it('should handle undefined insuredDetail safely', () => {
    mockSessionService.getData.and.returnValue(undefined);
    component.ngOnInit();
    expect(component.insuredDetail).toBeUndefined();
    expect(component.FormDefinition).toBeUndefined();
  });
});
