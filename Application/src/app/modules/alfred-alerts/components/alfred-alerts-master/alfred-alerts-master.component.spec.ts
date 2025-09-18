
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AlfredAlertsMasterComponent } from './alfred-alerts-master.component';


describe('AlfredAlertsMasterComponent', () => {
    let component: AlfredAlertsMasterComponent;
    let fixture: ComponentFixture<AlfredAlertsMasterComponent>;
    let httpClient: HttpClient

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule,
                HttpClientModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [AlfredAlertsMasterComponent],
            providers: [

            ],
        })
            .compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(AlfredAlertsMasterComponent);
        component = fixture.componentInstance;
        httpClient = TestBed.inject(HttpClient)
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

