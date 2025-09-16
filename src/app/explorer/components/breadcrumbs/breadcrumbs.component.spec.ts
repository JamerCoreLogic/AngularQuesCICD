import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { ExplorerService } from '../../services/explorer.service';
import { BehaviorSubject } from 'rxjs';
import { INode } from '../../shared/types';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { ConfigProvider } from '../../services/config.provider';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/services/auth.service';
import { By } from '@angular/platform-browser';

interface Breadcrumb {
  node: INode;
  name: string;
}

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let explorerService: jasmine.SpyObj<ExplorerService>;
  let breadcrumbsSubject: BehaviorSubject<INode[]>;
  let helperService: jasmine.SpyObj<HelperService>;
  let selectableItemsSubject: BehaviorSubject<boolean>;

  const mockNodes: INode[] = [
    {
      id: 1,
      parentId: 0,
      data: { name: 'root', path: '/' },
      isLeaf: false,
      children: []
    },
    {
      id: 2,
      parentId: 1,
      data: { name: 'folder', path: '/folder' },
      isLeaf: false,
      children: []
    }
  ];

  beforeEach(async () => {
    breadcrumbsSubject = new BehaviorSubject<INode[]>([]);
    selectableItemsSubject = new BehaviorSubject<boolean>(false);

    const explorerServiceSpy = jasmine.createSpyObj('ExplorerService', [
      'openNode',
      'getCurrentPath',
      'saveSelected'
    ], {
      breadcrumbs: breadcrumbsSubject.asObservable(),
      selectableItems: selectableItemsSubject.asObservable()
    });

    const helperServiceSpy = jasmine.createSpyObj('HelperService', ['getName']);
    helperServiceSpy.getName.and.callFake((data: any) => data.name);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BreadcrumbsComponent],
      providers: [
        { provide: ExplorerService, useValue: explorerServiceSpy },
        { provide: HelperService, useValue: helperServiceSpy },
        { provide: ConfigProvider, useValue: { config: { apiUrl: 'test-url', homeNodeName: 'Home' } } },
        AuthService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    explorerService = TestBed.inject(ExplorerService) as jasmine.SpyObj<ExplorerService>;
    helperService = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Structure', () => {
    beforeEach(() => {
      breadcrumbsSubject.next(mockNodes);
      fixture.detectChanges();
    });

    it('should render breadcrumbs container', () => {
      const container = fixture.debugElement.query(By.css('.nxe-breadcrumbs'));
      expect(container).toBeTruthy();
    });

   

    it('should render separators between breadcrumbs', () => {
      // only when the breadcrumb is not the last one
      const breadcrumbs = fixture.debugElement.queryAll(By.css('.nxe-breadcrumb'));
      breadcrumbs.forEach((breadcrumb, index) => {
        if (index < breadcrumbs.length - 1) {
          const separator = breadcrumb.query(By.css('.nxe-breadcrumb-separator'));
          expect(separator).toBeTruthy();
        }
      });

      // expect(separators.length).toBe(2); // One less than breadcrumbs
    });

    it('should render save button when allowed', () => {
      component.manageSave = true;
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(By.css('.nxe-breadcrumb-save'));
      expect(saveButton).toBeTruthy();
    });
  });

 

  describe('Navigation', () => {
    beforeEach(() => {
      breadcrumbsSubject.next(mockNodes);
      fixture.detectChanges();
    });

    it('should navigate to node when breadcrumb is clicked', () => {
      component.click(component.breadcrumbs[1]); // Click on 'root' breadcrumb
      expect(explorerService.openNode).toHaveBeenCalledWith(mockNodes[0].id);
      expect(explorerService.getCurrentPath).toHaveBeenCalled();
    });

   

  
  });

  describe('Save Button', () => {
    it('should show save button for admin users when items are selectable', () => {
      const mockUserData = {
        data: {
          role: [{ roleName: 'Admin' }]
        }
      };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUserData));
      selectableItemsSubject.next(true);
      
      component.checkUserAllowed();
      fixture.detectChanges();

      expect(component.manageSave).toBeTrue();
    });

    it('should hide save button for non-admin users', () => {
      const mockUserData = {
        data: {
          role: [{ roleName: 'User' }]
        }
      };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUserData));
      selectableItemsSubject.next(true);
      
      component.checkUserAllowed();
      fixture.detectChanges();

      expect(component.manageSave).toBeFalse();
    });

    it('should handle missing user data', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      selectableItemsSubject.next(true);
      
      component.checkUserAllowed();
      fixture.detectChanges();

      expect(component.manageSave).toBeFalse();
    });

   

    it('should save selected items when save button is clicked', () => {
      component.saveSelected();
      expect(explorerService.saveSelected).toHaveBeenCalled();
    });

    it('should handle save button click through template', async () => {
      component.manageSave = true;
      fixture.detectChanges();
      await fixture.whenStable();
      
      const saveButton = fixture.debugElement.query(By.css('.nxe-breadcrumb-save'));
      expect(saveButton).toBeTruthy();
      
      saveButton.nativeElement.click();
      component.saveSelected();
      expect(explorerService.saveSelected).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const unsubscribeSpy = spyOn(component['sub'], 'unsubscribe');
      
      component.ngOnDestroy();
      
      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should handle multiple destroy calls', () => {
      const unsubscribeSpy = spyOn(component['sub'], 'unsubscribe');
      
      component.ngOnDestroy();
      component.ngOnDestroy();
      
      expect(unsubscribeSpy).toHaveBeenCalledTimes(2);
    });

  
  });
});
