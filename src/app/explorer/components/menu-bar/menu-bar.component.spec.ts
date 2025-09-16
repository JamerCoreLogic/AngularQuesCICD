import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuBarComponent } from './menu-bar.component';
import { ExplorerService } from '../../services/explorer.service';
import { HelperService } from '../../services/helper.service';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { INode } from '../../shared/types';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MenuBarComponent', () => {
  let component: MenuBarComponent;
  let fixture: ComponentFixture<MenuBarComponent>;
  let explorerService: jasmine.SpyObj<ExplorerService>;
  let helperService: jasmine.SpyObj<HelperService>;
  let authService: jasmine.SpyObj<AuthService>;
  let selectedNodesSubject: BehaviorSubject<INode[]>;
  let selectableItemsSubject: BehaviorSubject<boolean>;
  let itemsSubject: BehaviorSubject<INode[]>;
  let downloadableFilesSubject: BehaviorSubject<INode[]>;

  const mockLeafNode: INode = {
    id: 1,
    parentId: 0,
    data: { name: 'test.pdf', path: '/test.pdf', isDownloadable: true },
    isLeaf: true,
    children: []
  };

  const mockFolderNode: INode = {
    id: 2,
    parentId: 0,
    data: { name: 'folder', path: '/folder' },
    isLeaf: false,
    children: []
  };

  beforeEach(async () => {
    selectedNodesSubject = new BehaviorSubject<INode[]>([]);
    selectableItemsSubject = new BehaviorSubject<boolean>(false);
    itemsSubject = new BehaviorSubject<INode[]>([]);
    downloadableFilesSubject = new BehaviorSubject<INode[]>([]);

    const explorerServiceSpy = jasmine.createSpyObj('ExplorerService', [
      'open',
      'share',
      'createNode',
      'refresh',
      'getCurrentPath',
      'rename',
      'remove',
      'upload',
      'download',
      'manageDownloadAble'
    ], {
      items: itemsSubject.asObservable(),
      selectedNodes: selectedNodesSubject.asObservable(),
      selectableItems: selectableItemsSubject.asObservable(),
      downloadableFiles: downloadableFilesSubject.asObservable()
    });

    const helperServiceSpy = jasmine.createSpyObj('HelperService', ['getName']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['']);

    await TestBed.configureTestingModule({
      declarations: [MenuBarComponent],
      providers: [
        { provide: ExplorerService, useValue: explorerServiceSpy },
        { provide: HelperService, useValue: helperServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    explorerService = TestBed.inject(ExplorerService) as jasmine.SpyObj<ExplorerService>;
    helperService = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuBarComponent);
    component = fixture.componentInstance;
    // Mock the uploader ViewChild
    component.uploader = {
      nativeElement: {
        click: jasmine.createSpy('click'),
        value: ''
      }
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Selection State', () => {
    it('should update state based on single leaf node selection', () => {
      selectedNodesSubject.next([mockLeafNode]);
      fixture.detectChanges();

      expect(component.canDownload).toBeTrue();
      expect(component.canDelete).toBeTrue();
      expect(component.canOpen).toBeTrue();
      expect(component.canShare).toBeTrue();
      expect(component.canRename).toBeTrue();
    });

    it('should update state based on single folder node selection', () => {
      selectedNodesSubject.next([mockFolderNode]);
      fixture.detectChanges();

      expect(component.canDownload).toBeFalse();
      expect(component.canDelete).toBeTrue();
      expect(component.canOpen).toBeFalse();
      expect(component.canShare).toBeFalse();
      expect(component.canRename).toBeTrue();
    });

    it('should update state based on multiple node selection', () => {
      const mockLeafNode2: INode = {
        id: 3,
        parentId: 0,
        data: { name: 'test2.pdf', path: '/test2.pdf', isDownloadable: true },
        isLeaf: true,
        children: []
      };

      selectedNodesSubject.next([mockLeafNode, mockLeafNode2]);
      fixture.detectChanges();

      expect(component.canDownload).toBeFalse(); // Multiple files selected
      expect(component.canDelete).toBeTrue();    // Can delete multiple files
      expect(component.canOpen).toBeFalse();     // Can't open multiple files
      expect(component.canShare).toBeFalse();    // Can't share multiple files
      expect(component.canRename).toBeFalse();   // Can't rename multiple files
    });

    it('should handle empty selection', () => {
      selectedNodesSubject.next([]);
      fixture.detectChanges();

      expect(component.canDownload).toBeFalse();
      expect(component.canDelete).toBeFalse();
      expect(component.canOpen).toBeFalse();
      expect(component.canShare).toBeFalse();
      expect(component.canRename).toBeFalse();
    });
  });

  describe('User Actions', () => {
    beforeEach(() => {
      selectedNodesSubject.next([mockLeafNode]);
      fixture.detectChanges();
    });

    it('should handle open action', () => {
      component.open();
      expect(explorerService.open).toHaveBeenCalled();
    });

    it('should handle share action', () => {
      component.share();
      expect(explorerService.share).toHaveBeenCalled();
    });

    it('should handle create folder action', () => {
      spyOn(window, 'prompt').and.returnValue('new-folder');
      component.createFolder();
      expect(explorerService.createNode).toHaveBeenCalledWith('new-folder');
    });

    it('should not create folder if prompt is cancelled', () => {
      spyOn(window, 'prompt').and.returnValue(null);
      component.createFolder();
      expect(explorerService.createNode).not.toHaveBeenCalled();
    });

    it('should handle refresh action', () => {
      component.refresh();
      expect(explorerService.refresh).toHaveBeenCalled();
      expect(explorerService.getCurrentPath).toHaveBeenCalled();
    });

    it('should handle rename action', () => {
      helperService.getName.and.returnValue('old-name');
      spyOn(window, 'prompt').and.returnValue('new-name');
      component.rename();
      expect(explorerService.rename).toHaveBeenCalledWith('new-name');
    });

    it('should not rename if prompt is cancelled', () => {
      helperService.getName.and.returnValue('old-name');
      spyOn(window, 'prompt').and.returnValue(null);
      component.rename();
      expect(explorerService.rename).not.toHaveBeenCalled();
    });

    it('should handle remove action with confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.remove();
      expect(explorerService.remove).toHaveBeenCalled();
    });

    it('should not remove if confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.remove();
      expect(explorerService.remove).not.toHaveBeenCalled();
    });

    it('should handle file upload', () => {
      const mockFiles = [new File([''], 'test.txt')];
      const mockEvent = {
        target: {
          files: mockFiles,
          value: ''
        }
      } as unknown as Event;

      component.handleFiles(mockEvent);

      expect(explorerService.upload).toHaveBeenCalledWith(Array.from(mockFiles));
      expect(component.uploader.nativeElement.value).toBe('');
    });

    it('should handle openUploader action', () => {
      component.openUploader();
      expect(component.uploader.nativeElement.click).toHaveBeenCalled();
    });

    it('should handle download action', () => {
      component.download();
      expect(explorerService.download).toHaveBeenCalled();
    });

    it('should handle manage downloads action', () => {
      component.manageDownloadAble();
      selectableItemsSubject.next(true);
      fixture.detectChanges();

      expect(component.title).toBe('Manage Downloads');
      expect(component.buttonLable).toBe('Back to Resources');

      selectableItemsSubject.next(false);
      fixture.detectChanges();

      expect(component.title).toBe('Resources');
      expect(component.buttonLable).toBe('Manage Downloads');
    });

    it('should handle back button action', () => {
      spyOn(window.history, 'back');
      component.backBtn();
      expect(window.history.back).toHaveBeenCalled();
    });
  });

  describe('User Permissions', () => {
    it('should check user permissions on initialization', () => {
      const mockUserData = {
        data: {
          role: [{ roleName: 'Admin' }]
        }
      };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUserData));

      component.checkUserAllowed();

      expect(component.manageDownloads).toBeTrue();
    });

    it('should handle non-admin users', () => {
      const mockUserData = {
        data: {
          role: [{ roleName: 'User' }]
        }
      };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUserData));

      component.checkUserAllowed();

      expect(component.manageDownloads).toBeFalse();
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const unsubscribeSpy = spyOn(component['sub'], 'unsubscribe');
      
      component.ngOnDestroy();
      
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
