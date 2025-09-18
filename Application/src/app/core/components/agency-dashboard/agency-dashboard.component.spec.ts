
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Roles } from 'src/app/global-settings/roles';
import { NavigationEnd } from '@angular/router';
import { AgencyDashboardComponent } from './agency-dashboard.component';


describe('AgencyDashboardComponent', () => {
  let component: AgencyDashboardComponent;
  let fixture: ComponentFixture<AgencyDashboardComponent>;
  let httpClient: HttpClient

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AgencyDashboardComponent]
    })
      .compileComponents();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set evt to true when toggleTodoExpand(true) is called', () => {
    component.toggleTodoExpand(true);
    expect(component.evt).toBeTrue();
  });

  it('should set evt to false when toggleTodoExpand(false) is called', () => {
    component.toggleTodoExpand(false);
    expect(component.evt).toBeFalse();
  });

  it('should set isAlfredAlertsExpanded to true', () => {
    component.toggleAlfredExpand(true);
    expect(component.isAlfredAlertsExpanded).toBeTrue();
  });

  it('should set isAlfredAlertsExpanded to false', () => {
    component.toggleAlfredExpand(false);
    expect(component.isAlfredAlertsExpanded).toBeFalse();
  });
});

