import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ViewClientsComponent, AdminElement } from './view-clients.component';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { AddClientsComponent } from '../add-clients/add-clients.component';

describe('ViewClientsComponent', () => {
  let component: ViewClientsComponent;
  let fixture: ComponentFixture<ViewClientsComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Mock data
  const mockClients: AdminElement[] = [
    {
      select: 1,
      clientId: '1',
      Name: 'John Doe',
      Email: 'john.doe@example.com',
      Status: 'Active',
      createdBy: 'Admin',
      createdOn: '2023-01-01T00:00:00Z',
      isDeleted: 'false',
      isActive: 'true',
    },
    {
      select: 2,
      clientId: '2',
      Name: 'Jane Smith',
      Email: 'jane.smith@example.com',
      Status: 'Inactive',
      createdBy: 'Admin',
      createdOn: '2023-02-01T00:00:00Z',
      isDeleted: 'false',
      isActive: 'false',
    },
  ];

  beforeEach(async () => {
    // Create spies for AuthService, SpinnerService, MatDialog, and Router
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getClients', 'deleteClient', 'isUserAllowed']);
    spinnerSpy = jasmine.createSpyObj<NgxSpinnerService>('NgxSpinnerService', ['show', 'hide']);
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open', 'closeAll']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    // Mock sessionStorage
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'currentPage') return 'manageClientsPage'; // Adjust as needed
      if (key === 'LoggeduserId') return '123';
      return null;
    });

    // Mock AuthService.isUserAllowed to return isAllow = true
    authServiceSpy.isUserAllowed.and.returnValue({ isAllow: true, allowedPath: '/login' });

    // **Crucial Step:** Mock AuthService.getClients to return an observable before component creation
    authServiceSpy.getClients.and.returnValue(of({ success: true, data: mockClients }));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        SharedMaterialModule

        // Add other necessary imports here, such as MatTableModule, MatPaginatorModule, etc.
      ],
      declarations: [ViewClientsComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should call isUserAllowed and allow access', () => {
      expect(authServiceSpy.isUserAllowed).toHaveBeenCalledWith(window.location);
      expect(authServiceSpy.isUserAllowed).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

   

    
  });

  describe('ngAfterViewInit', () => {
    it('should assign paginator and sort to dataSource', fakeAsync(() => {
      // Act: Call ngAfterViewInit
      component.ngAfterViewInit();
      tick();

      // Assert
      expect(component.dataSource.paginator).toBe(component.paginator);
      expect(component.dataSource.sort).toBe(component.sort);
    }));

    it('should sort by Name ascending by default', fakeAsync(() => {
      // Arrange
      component.ngAfterViewInit();
      tick();

      // Act: Trigger default sorting
      component.sort.sort({ id: 'Name', start: 'asc', disableClear: true });
      tick();

      // Assert: Data should be sorted by Name ascending
      const sortedData = component.dataSource.data.slice().sort((a, b) => a.Name.localeCompare(b.Name));
      expect(component.dataSource.data).toEqual(sortedData);
    }));
  });

  describe('Filtering Functionality', () => {
    beforeEach(fakeAsync(() => {
      // Already mocked getClients in beforeEach
      tick(); // Handle any asynchronous operations
    }));

    it('should set filterBy to "firstName" when selecting "Name"', () => {
      // Arrange: Simulate selecting "Name" (value=1)
      const event = { target: { value: '1' } };
      component.filterBasedOn(event);
      expect(component.filterBy).toBe('firstName');
    });

    it('should set filterBy to "Email" when selecting "Email"', () => {
      // Arrange: Simulate selecting "Email" (value=2)
      const event = { target: { value: '2' } };
      component.filterBasedOn(event);
      expect(component.filterBy).toBe('Email');
    });

    it('should set filterBy to "Status" when selecting "Status"', () => {
      // Arrange: Simulate selecting "Status" (value=3)
      const event = { target: { value: '3' } };
      component.filterBasedOn(event);
      expect(component.filterBy).toBe('Status');
    });

    it('should set filterBy to "" when selecting "All"', () => {
      // Arrange: Simulate selecting "All" (value=4)
      const event = { target: { value: '4' } };
      component.filterBasedOn(event);
      expect(component.filterBy).toBe('');
    });



    
  });

  describe('Opening Add/Edit Dialogs', () => {
    it('should open AddClientsComponent dialog when openDialogeadd is called', fakeAsync(() => {
      // Arrange: Mock dialog.open to return a mock dialogRef with afterClosed
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      dialogSpy.open.and.returnValue(mockDialogRef as any);

      // Spy on getUsers
      spyOn(component, 'getUsers').and.callThrough();

      // Act: Call openDialogeadd
      component.openDialogeadd();
      tick(); // Handle afterClosed

      // Assert
      expect(dialogSpy.open).toHaveBeenCalledWith(AddClientsComponent, {
        data: null,
        panelClass: 'add_client',
      });
      expect(component.getUsers).toHaveBeenCalledTimes(1);
    }));

    it('should open AddClientsComponent dialog with data when openDialogeEdit is called', fakeAsync(() => {
      // Arrange: Mock dialog.open to return a mock dialogRef with afterClosed
      const user: AdminElement = mockClients[0];
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      dialogSpy.open.and.returnValue(mockDialogRef as any);

      // Spy on getUsers
      spyOn(component, 'getUsers').and.callThrough();

      // Act: Call openDialogeEdit with a user
      component.openDialogeEdit(user);
      tick(); // Handle afterClosed

      // Assert
      expect(dialogSpy.open).toHaveBeenCalledWith(AddClientsComponent, {
        data: user,
        panelClass: 'add_client',
      });
      expect(component.getUsers).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Deleting Clients', () => {
    it('should show confirmation dialog and delete client on confirm', fakeAsync(() => {
      // Arrange: Spy on Swal.fire to return confirmed
      const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

      // Mock deleteClient to return success
      authServiceSpy.deleteClient.and.returnValue(of(true));

      // Spy on getUsers
      spyOn(component, 'getUsers').and.callThrough();

      // Act: Call deleteClient with a user
      component.deleteClient(mockClients[0]);
      tick(); // Handle Swal.fire promise
      tick(); // Handle deleteClient subscription

      // Assert: Should show confirmation and then deleteClient
      expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        text: 'Are you sure want to delete John Doe?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffa022',
        denyButtonText: 'No',
      }));
      expect(authServiceSpy.deleteClient).toHaveBeenCalledWith('1');
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        text: 'Client Deleted successfully.',
        icon: 'success'
      }));
      expect(component.getUsers).toHaveBeenCalledTimes(1);
    }));

    it('should show denial and not delete client when user denies', fakeAsync(() => {
      // Arrange: Spy on Swal.fire to return denied
      const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isDenied: true } as any));

      // Act: Call deleteClient with a user
      component.deleteClient(mockClients[0]);
      tick(); // Handle Swal.fire promise

      // Assert: Should show confirmation and not deleteClient
      expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        text: 'Are you sure want to delete John Doe?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ffa022',
        denyButtonText: 'No',
      }));
      expect(authServiceSpy.deleteClient).not.toHaveBeenCalled();
    }));

    it('should handle successful deletion', fakeAsync(() => {
      // Arrange: Spy on Swal.fire to return confirmed
      const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

      // Mock deleteClient to return success
      authServiceSpy.deleteClient.and.returnValue(of(true));

      // Spy on getUsers
      spyOn(component, 'getUsers').and.callThrough();

      // Act: Call deleteClient with a user
      component.deleteClient(mockClients[0]);
      tick(); // Handle Swal.fire promise
      tick(); // Handle deleteClient subscription

      // Assert: Should show success alert and call getUsers
      expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        text: 'Client Deleted successfully.',
        icon: 'success'
      }));
      expect(component.getUsers).toHaveBeenCalledTimes(1);
    }));

  

  });

  describe('Error Handling for isUserAllowed', () => {
    it('should navigate to allowedPath if isUserAllowed returns false', () => {
      // Arrange: Mock isUserAllowed to return isAllow = false
      authServiceSpy.isUserAllowed.and.returnValue({ isAllow: false, allowedPath: '/login' });

      // Recreate component to apply new provider
      fixture = TestBed.createComponent(ViewClientsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert: Should navigate to '/login'
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Utility Methods', () => {
    it('should format date correctly with dateToUS', () => {
      // Arrange
      const dateString = '2023-01-01T00:00:00Z';
      const expectedFormat = new Date(dateString).toLocaleDateString('en-US');

      // Act
      const formattedDate = component.dateToUS(dateString);

      // Assert
      expect(formattedDate).toBe(expectedFormat);
    });
  });
});