import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/compiler";
import { ActivatedRoute, Router } from "@angular/router";
import { AQZipDetailsService, GetConfigurationService } from "@agenciiq/aqadmin";
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { of, throwError } from "rxjs";
import { LoginComponent } from "./login.component";
import { IGetConfiguration } from "@agenciiq/aqadmin/lib/interfaces/getConfigration-resp";
import { FormBuilder } from "@angular/forms";



describe('AgencyComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let httpClient: HttpClient
    let service: GetConfigurationService;
    let router: Router;
    let zipservice: AQZipDetailsService;
    let loaderservice: LoaderService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule,
                HttpClientModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [LoginComponent],
            providers: [

            ],
        })
            .compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        httpClient = TestBed.inject(HttpClient)
        service = TestBed.inject(GetConfigurationService);
        router = TestBed.inject(Router);
        zipservice = TestBed.inject(AQZipDetailsService);
        loaderservice = TestBed.inject(LoaderService);
        component.loginForm = new FormBuilder().group({
            userName: [''],
            password: [''],
            rememberMe: [false]
        });
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch and set MGA configuration successfully', () => {
        const mockConfig: IGetConfiguration = {
            success: true,
            data: {
                mgaConfiguration: {
                    mgaId: 1,
                    name: 'Test MGA',
                    logoURL: 'logo.png',
                    aqLogoURL: 'aq-logo.png',
                    aqFavIconURL: 'favicon.ico',
                    aqBannerURL: 'banner.png',
                    description: 'Test description',
                    addressLine1: '123 Test St',
                    addressLine2: null,
                    city: 'Testville',
                    state: 'TestState',
                    stateCode: 'TS',
                    zip: '12345',
                    contactPerson: 'John Doe',
                    email: 'john@example.com',
                    phone: null,
                    phoneCell: '111-111-1111',
                    phoneHome: '222-222-2222',
                    phoneOffice: '333-333-3333',
                    fax: '444-444-4444',
                    website: 'https://testmga.com',
                    isActive: true
                },
                mgaCarriersList: [],
                mgaLobsList: [],
                mgaStatesList: []
            },
            message: null
        };
        spyOn(service, "GetConfiguration").and.returnValue(of(mockConfig));
        // mockMgaConfigService.GetConfiguration.and.returnValue(of(mockConfig));

        component.getMGAConfiguration();

        // Use fixture.detectChanges() if these affect view
        expect(component.mgaName).toBe('Test MGA');
        expect(component.mgaLogo).toBe('logo.png');
        expect(component.aqLogo).toBe('aq-logo.png');
        expect(component.bannerUrl).toBe('banner.png');

    });

    it('should hide loader and log error on failure', () => {
        spyOn(service, "GetConfiguration").and.returnValue(throwError(() => new Error('API Error')));
        component.getMGAConfiguration();
        // Optional: check if mgaName and others are not set
        expect(component.mgaName).toBeUndefined();
    });

    it('should reset forgot and submitted flags to false', () => {
        component.forgot = true;
        component.submitted = true;
        // Call method
        component.resetForm();
        // Assertions
        expect(component.forgot).toBeFalse();
        expect(component.submitted).toBeFalse();
    });

    it('should set logos for acme client', () => {
        component.env.ClientName = 'acme';

        component.setLogo();

        expect(component.mgaLogo).toBe('assets/acme.agenciiq.net/images/login/mgaLogo.png');
        expect(component.aqLogo).toBe('assets/acme.agenciiq.net/images/login/poweredBy.png');
    });

    it('should set logos for insured client', () => {
        component.env.ClientName = 'insured';

        component.setLogo();

        expect(component.mgaLogo).toBe('assets/insured.agenciiq.net/images/login/mgaLogo.png');
        expect(component.aqLogo).toBe('assets/insured.agenciiq.net/images/login/poweredBy.png');
    });

    it('should set default logos for other clients', () => {
        component.env.ClientName = 'somethingElse';

        component.setLogo();

        expect(component.mgaLogo).toBe('assets/united.agenciiq.net/images/login/mgaLogo.png');
        expect(component.aqLogo).toBe('assets/united.agenciiq.net/images/login/poweredBy.png');
    });

    it('should return username form control', () => {
        expect(component.username).toBe(component.loginForm.get('userName'));
    });

    it('should return password form control', () => {
        expect(component.password).toBe(component.loginForm.get('password'));
    });

    it('should return rememberMe form control', () => {
        expect(component.rememberMe).toBe(component.loginForm.get('rememberMe'));
    });
})