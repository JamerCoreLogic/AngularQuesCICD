import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });

  it('should assign values from environment on initialization', () => {
    expect(component.appVersion).toEqual(environment.AppVersion);
    expect(component.formanizer).toEqual(environment.formanizer);
    expect(component.amplify).toEqual(environment.Amplify);
    expect(component.chatbot).toEqual(environment.Chatbot);
  });

  it('should set identifier based on host in ngOnInit', () => {
    component.ngOnInit();
    expect(component.identifier).toBe('convelo.agenciiq.net');
  });

  it('should set identifier to host if not localhost', () => {
    component.ngOnInit();
    expect(component.identifier).toBe('convelo.agenciiq.net');
  });
});
