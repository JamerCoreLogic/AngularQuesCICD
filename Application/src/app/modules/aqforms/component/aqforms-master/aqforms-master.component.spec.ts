import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AQFormsMasterComponent } from './aqforms-master.component';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQRoleInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AqformMasterComponent', () => {
  let component: AQFormsMasterComponent;
  let fixture: ComponentFixture<AQFormsMasterComponent>;
  let loaderService: LoaderService;
  let roleRoleInfo: AQRoleInfo;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [AQFormsMasterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        LoaderService,
        AQRoleInfo,
        Router
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQFormsMasterComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService);
    roleRoleInfo = TestBed.inject(AQRoleInfo);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call checkURL on ngOnInit', () => {
    // Arrange: Spy on checkURL method
    spyOn(component, 'checkURL');

    // Act: Call ngOnInit
    component.ngOnInit();

    // Assert: checkURL should be called
    expect(component.checkURL).toHaveBeenCalled();
  });
});
