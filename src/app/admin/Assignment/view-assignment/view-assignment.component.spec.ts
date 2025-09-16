import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AdminElement, ViewAssignmentComponent } from './view-assignment.component';
import { of, throwError } from 'rxjs';
import { MatLegacyDialog, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

class MockAuthService {
  getUsers() {
    return of({ userId: 123 });
  }
  deleteUser(userId: string) {
    return of(true);
  }
  getAssessments() {
    return of({ success: true, data: [] });
  }
  deleteAssessment(assessmentTypeId: string) {
    return of(true);
  }
  
}


class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}



describe('ViewAssignmentComponent', () => {
  let component: ViewAssignmentComponent;
  let fixture: ComponentFixture<ViewAssignmentComponent>;
  let authService: MockAuthService;
  let dialog: MatLegacyDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssignmentComponent ],
       imports: [
              BrowserAnimationsModule,
              FormsModule,
              ReactiveFormsModule,
              HttpClientTestingModule,
              MatLegacyDialogModule, // Required for MatDialog
              SharedMaterialModule, // Required for Material
              NoopAnimationsModule, 
            ],
      providers: [
        { provide: MatLegacyDialog, useClass: MockMatDialog },
        {provide:MockAuthService,useClass:MockAuthService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssignmentComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(MockAuthService);
    dialog = TestBed.inject(MatLegacyDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should handle errors in getting users', fakeAsync(() => {
    spyOn(authService, 'getAssessments').and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges(); // ngOnInit()
    tick(); // wait for async operations to complete
    expect(component.dataSource.data.length).toBe(0);
  }));

 


});