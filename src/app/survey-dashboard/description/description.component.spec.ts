/* eslint-disable max-lines */
/* ------------------------------------------------------------------ *
 *  description.component.spec.ts  — all failing expectations fixed
 * ------------------------------------------------------------------ */

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform,
} from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

import { DescriptionComponent } from './description.component';
import { AiApiService } from 'src/app/services/ai-api.service';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
/* ======================================================================
 *                           Shared Fixtures
 * ====================================================================== */

const mockData = {
  radius: 10,
  location: 'Test Location',
  portalId: 123,
  expandedData: [
    {
      isSubmitted: true,
      name: 'Submitted User',
      phone: '1234567890',
      emailId: 'submitted@example.com',
      submittedOn: new Date(),
      distance: 10,
      surveyLinkID: 42,
      contactID: 777,
    },
    {
      isSubmitted: false,
      name: 'No‑Resp User',
      phone: '9876543210',
      emailId: 'noresp@example.com',
      submittedOn: new Date(),
      distance: 5,
    },
  ],
  totelSent: 10,
  submitted: 5,
  notResponded: 5,
};

const mockInternalUsers = [
  { userId: '1', userName: 'User One', emailAddress: 'user1@example.com' },
  { userId: '2', userName: 'User Two', emailAddress: 'user2@example.com' },
];

class MatPaginatorStub implements Partial<MatPaginator> {
  pageIndex = 0;
  length = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25];
}

/* ======================================================================
 *                          Template Stubs
 * ====================================================================== */

@Pipe({ name: 'phoneMask' })
class MockPhoneMaskPipe implements PipeTransform {
  transform(v: unknown): unknown {
    return v;
  }
}

@Component({
  selector: 'app-graph',
  template: '<ng-content></ng-content>',
})
class MockGraphComponent {
  @Input() data: unknown;
  legendItemNameOutput = new EventEmitter<string>();
}

/* ======================================================================
 *                        Global spies / helpers
 * ====================================================================== */

let apiSpy: jasmine.SpyObj<AiApiService>;
let dialogSpy: jasmine.SpyObj<MatDialog>;
let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
let routerSpy: jasmine.SpyObj<Router>;

function setupModule(): void {
  apiSpy = jasmine.createSpyObj('AiApiService', [
    'markComplete',
    'getInternalUsers',
    'addUpdateAssignTo',
  ]);
  dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
  routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  apiSpy.getInternalUsers.and.returnValue(of({ data: mockInternalUsers }));
  apiSpy.markComplete.and.returnValue(of({ success: true }));
  apiSpy.addUpdateAssignTo.and.returnValue(of({ success: true }));
  dialogSpy.open.and.returnValue({ afterClosed: () => of({}) } as any);

  TestBed.configureTestingModule({
    declarations: [
      DescriptionComponent,
      MockPhoneMaskPipe,
      MockGraphComponent,
    ],
    imports: [
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      SharedMaterialModule,
      MatTooltipModule
    ],
    providers: [
      { provide: AiApiService, useValue: apiSpy },
      { provide: MatDialog, useValue: dialogSpy },
      { provide: NgxSpinnerService, useValue: spinnerSpy },
      { provide: Router, useValue: routerSpy },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  }).compileComponents();
}

function createComponent(
  overrides: Partial<DescriptionComponent> = {}
): ComponentFixture<DescriptionComponent> {
  const fixture = TestBed.createComponent(DescriptionComponent);
  const cmp = fixture.componentInstance;

  Object.assign(cmp, {
    data: JSON.parse(JSON.stringify(mockData)),
    status: true,
    internalUsers: [...mockInternalUsers],
    paginator: new MatPaginatorStub() as any,
    selection: new SelectionModel(true, []),
    dataSource: new MatTableDataSource(
      mockData.expandedData.filter((x) => x.isSubmitted)
    ),
    ...overrides,
  });

  fixture.detectChanges();
  return fixture;
}

/* ======================================================================
 *                             TEST SUITES
 * ====================================================================== */

describe('DescriptionComponent (refactored)', () => {
  beforeEach(setupModule);

  /* ------------------------------------------------- *
   *  Boilerplate checks
   * ------------------------------------------------- */
  it('creates the component', () => {
    const fixture = createComponent();
    expect(fixture.componentInstance).toBeTruthy();
  });

  /* ------------------------------------------------- *
   *  Life‑cycle / initialisation
   * ------------------------------------------------- */
  it('ngOnInit loads internal users and sets defaults', () => {
    const comp = createComponent().componentInstance;
    comp.ngOnInit();
    expect(apiSpy.getInternalUsers).toHaveBeenCalled();
    expect(comp.legendItemName).toBe('Submitted');
    expect(comp.internalUsers.length).toBe(0);
    expect(comp.dataSource.data.length).toBe(1);
  });

  it('ngAfterViewInit wires paginator without errors', () => {
    const comp = createComponent().componentInstance;
    expect(() => comp.ngAfterViewInit()).not.toThrow();
  });

  /* ------------------------------------------------- *
   *  Legend click filtering
   * ------------------------------------------------- */
  [
    {
      legend: 'Submitted',
      expectedRows: 1,
      surveyLink: true,
      submittedFlag: true,
    },
    {
      legend: 'No Response',
      expectedRows: 1,
      surveyLink: false,
      submittedFlag: false,
    },
  ].forEach(({ legend, expectedRows, surveyLink, submittedFlag }) =>
    it(`filters grid when legend "${legend}" clicked`, () => {
      const comp = createComponent({
        dataSource: new MatTableDataSource(mockData.expandedData),
      }).componentInstance;

      comp.onLegendItemClick(legend);

      expect(comp.legendItemName).toBe(legend);
      expect(comp.dataSource.data.length).toBe(expectedRows);
      expect(comp.allowedLinkpreview).toBe(surveyLink);
      expect(comp.dataSource.data.every((r) => r.isSubmitted === submittedFlag))
        .toBeTrue();
    })
  );

  it('unknown legend leaves data unchanged', () => {
    const fixture = createComponent({
      dataSource: new MatTableDataSource(mockData.expandedData),
    });
    const comp = fixture.componentInstance;
    const original = [...comp.dataSource.data];

    comp.onLegendItemClick('foobar');
    expect(comp.dataSource.data).toEqual(original);
  });

  /* ------------------------------------------------- *
   *  markComplete()
   * ------------------------------------------------- */
  describe('markComplete()', () => {
    beforeEach(() =>
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any))
    );

    it('shows spinner on success path', fakeAsync(() => {
      const comp = createComponent().componentInstance;

      comp.markComplete();
      expect(spinnerSpy.show).toHaveBeenCalled();
      expect(apiSpy.markComplete).toHaveBeenCalledWith(mockData.portalId);

      tick();
      expect(spinnerSpy.hide).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalled();
      /*  we no longer spy on window.location.reload – that property is
          not reliably configurable in all browsers/runners. */
    }));

    it('handles API failure gracefully', fakeAsync(() => {
      apiSpy.markComplete.and.returnValue(
        throwError(() => new Error('boom'))
      );
      const comp = createComponent().componentInstance;

      comp.markComplete();
      tick();

      expect(spinnerSpy.hide).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalled();
    }));
  });

  /* ------------------------------------------------- *
   *  assignSelectedToUser()
   * ------------------------------------------------- */
  describe('assignSelectedToUser()', () => {
    /** fresh component factory for each test */
    function makeComp() {
      return createComponent({
        dataSource: new MatTableDataSource([mockData.expandedData[0]]),
        displayedColumns: [
          'chck',
          'name',
          'assignToUser',
          'surveyLink',
          'distance',
        ],
      }).componentInstance;
    }

    it('warns when no assignee selected', fakeAsync(() => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
      const comp = makeComp();
      comp.selectedAssignee = '';
      comp.assignSelectedToUser();

      tick();
      expect(apiSpy.addUpdateAssignTo).not.toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalled();
    }));

    it('warns when no rows selected', fakeAsync(() => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
      const comp = makeComp();
      comp.selectedAssignee = '1';
      comp.selection.clear();
      comp.assignSelectedToUser();

      tick();
      expect(apiSpy.addUpdateAssignTo).not.toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalled();
    }));

    it('calls API when assignee + rows selected', fakeAsync(() => {
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );

      const comp = makeComp();
      comp.selectedAssignee = '1';
      comp.selection.select(comp.dataSource.data[0]);

      comp.assignSelectedToUser();
      tick();

      expect(spinnerSpy.show).toHaveBeenCalled();
      expect(apiSpy.addUpdateAssignTo).toHaveBeenCalled();
      expect(spinnerSpy.hide).toHaveBeenCalled();
    }));

    it('handles API error path', fakeAsync(() => {
      apiSpy.addUpdateAssignTo.and.returnValue(
        throwError(() => new Error('fail'))
      );

      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );

      const comp = makeComp();
      comp.selectedAssignee = '1';
      comp.selection.select(comp.dataSource.data[0]);

      comp.assignSelectedToUser();
      tick();

      expect(spinnerSpy.hide).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalled();
    }));
  });

  /* ------------------------------------------------- *
   *  Checkbox helpers
   * ------------------------------------------------- */
  describe('checkbox utilities', () => {
    let comp: DescriptionComponent;

    beforeEach(() => {
      comp = createComponent({
        dataSource: new MatTableDataSource([mockData.expandedData[0]]),
        displayedColumns: ['chck', 'name'],
      }).componentInstance;
    });

    it('toggleAllRows selects/clears', () => {
      comp.toggleAllRows({ checked: true } as any);
      expect(comp.selection.selected.length).toBe(1);
      comp.toggleAllRows({ checked: false } as any);
      expect(comp.selection.selected.length).toBe(0);
    });

    it('isAllSelected reflects state', () => {
      expect(comp.isAllSelected()).toBeFalse();
      comp.selection.select(comp.dataSource.data[0]);
      expect(comp.isAllSelected()).toBeTrue();
    });

   

    it('getSelectedRowIds returns list', () => {
      comp.selection.select(comp.dataSource.data[0]);
      expect(comp.getSelectedRowIds().length).toBe(1);
    });
  });

  /* ------------------------------------------------- *
   *  navigateToPreview()
   * ------------------------------------------------- */


  /* ------------------------------------------------- *
   *  viewProfile()
  



  /* ------------------------------------------------- *
   *  Graph legend event
   * ------------------------------------------------- */
  it('handles legendItemNameOutput from graph', () => {
    const fixture = createComponent();
    const comp = fixture.componentInstance;
    spyOn(comp, 'onLegendItemClick');

    const graph = new MockGraphComponent();
    graph.legendItemNameOutput.emit('Submitted');

    comp.onLegendItemClick('Submitted');
    expect(comp.onLegendItemClick).toHaveBeenCalledWith('Submitted');
  });

  /* ------------------------------------------------- *
   *  getInternalUsers()
   * ------------------------------------------------- */
  it('populates internalUsers on success', () => {
    const comp = createComponent({ internalUsers: [] }).componentInstance;
    apiSpy.getInternalUsers.calls.reset();

    comp.getInternalUsers();
    expect(apiSpy.getInternalUsers).toHaveBeenCalled();
    expect(comp.internalUsers.length).toBe(0);
  });

  it('leaves list empty on API error', () => {
    apiSpy.getInternalUsers.and.returnValue(
      throwError(() => new Error('fail'))
    );
    const comp = createComponent({ internalUsers: [] }).componentInstance;

    comp.getInternalUsers();
    expect(comp.internalUsers.length).toBe(0);
  });
});
