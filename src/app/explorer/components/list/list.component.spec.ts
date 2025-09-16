import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { ExplorerService } from '../../services/explorer.service';
import { HelperService } from '../../services/helper.service';
import { FILTER_STRING } from '../../injection-tokens/tokens';
import { BehaviorSubject } from 'rxjs';
import { INode } from '../../shared/types';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let explorerService: jasmine.SpyObj<ExplorerService>;
  let helperService: jasmine.SpyObj<HelperService>;
  let filterSubject: BehaviorSubject<string>;
  let itemsSubject: BehaviorSubject<INode[]>;
  let selectedNodesSubject: BehaviorSubject<INode[]>;
  let selectableItemsSubject: BehaviorSubject<boolean>;
  let openedNodeSubject: BehaviorSubject<INode>;

  const mockLeafNode: INode = {
    id: 1,
    parentId: 0,
    data: { 
      name: 'test.pdf', 
      path: '/test.pdf', 
      fileType: 'pdf', 
      isDownloadable: true,
      size: '1024',
      lastModified: '2024-03-14T12:00:00Z'
    },
    isLeaf: true,
    children: []
  };

  const mockFolderNode: INode = {
    id: 2,
    parentId: 0,
    data: { 
      name: 'folder', 
      path: '/folder',
      size: '2048',
      lastModified: '2024-03-13T12:00:00Z'
    },
    isLeaf: false,
    children: []
  };

  const mockExternalUrlNode: INode = {
    id: 3,
    parentId: 0,
    data: { 
      name: 'external', 
      path: '/external', 
      externalURL: 'https://example.com',
      size: '512',
      lastModified: '2024-03-12T12:00:00Z'
    },
    isLeaf: true,
    children: []
  };

  beforeEach(async () => {
    filterSubject = new BehaviorSubject<string>('');
    itemsSubject = new BehaviorSubject<INode[]>([]);
    selectedNodesSubject = new BehaviorSubject<INode[]>([]);
    selectableItemsSubject = new BehaviorSubject<boolean>(false);
    openedNodeSubject = new BehaviorSubject<INode>({ id: 0, parentId: -1, data: {}, isLeaf: false, children: [] });

    const explorerServiceSpy = jasmine.createSpyObj('ExplorerService', [
      'openFile',
      'onCheckboxChange',
      'isSelected',
      'openNode',
      'dbClick',
      'dbSelect',
      'emptyClick',
      'selectAllItems',
      'selectNodes',
      'getCurrentPath',
      'openLeaf'
    ], {
      items: itemsSubject.asObservable(),
      selectedNodes: selectedNodesSubject.asObservable(),
      selectableItems: selectableItemsSubject.asObservable(),
      openedNode: openedNodeSubject.asObservable()
    });

    const helperServiceSpy = jasmine.createSpyObj('HelperService', [
      'getFileType',
      'getSize',
      'getLastModified',
      'getName',
      'getContent'
    ]);

    // Configure default behavior for HelperService methods
    helperServiceSpy.getName.and.callFake((data: any) => data.name);
    helperServiceSpy.getFileType.and.callFake((data: any) => data.fileType || 'unknown-type');
    helperServiceSpy.getSize.and.callFake((data: any) => data.size || '0');
    helperServiceSpy.getLastModified.and.callFake((data: any) => data.lastModified || '');
    helperServiceSpy.getContent.and.callFake((data: any) => data.content || '');

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      providers: [
        { provide: ExplorerService, useValue: explorerServiceSpy },
        { provide: HelperService, useValue: helperServiceSpy },
        { provide: FILTER_STRING, useValue: filterSubject }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    explorerService = TestBed.inject(ExplorerService) as jasmine.SpyObj<ExplorerService>;
    helperService = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    // Set up items for sorting tests
    openedNodeSubject.next({ id: 0, parentId: -1, data: {}, isLeaf: false, children: [mockLeafNode, mockFolderNode, mockExternalUrlNode] });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Item Interactions', () => {
    it('should handle leaf node opening', () => {
      const mockEvent = new MouseEvent('click');
      component.openner(mockEvent, mockLeafNode);

      expect(explorerService.openFile).toHaveBeenCalledWith(mockLeafNode);
    });

    it('should handle folder node opening', () => {
      const mockEvent = new MouseEvent('click');
      component.openner(mockEvent, mockFolderNode);

      expect(explorerService.openFile).not.toHaveBeenCalled();
    });

    it('should handle right click', () => {
      const mockEvent = new MouseEvent('contextmenu');
      component.rightClick(mockEvent, mockLeafNode);

      expect(explorerService.dbClick).toHaveBeenCalledWith(mockLeafNode);
    });

    it('should handle selection', () => {
      const mockEvent = new MouseEvent('click');
      component.select(mockEvent, mockLeafNode);

      expect(explorerService.dbSelect).toHaveBeenCalledWith(mockLeafNode);
    });

    it('should handle empty space click', () => {
      component.emptySpaceClick();

      expect(explorerService.emptyClick).toHaveBeenCalled();
    });

    it('should handle checkbox change', () => {
      component.onCheckboxChange(mockLeafNode);

      expect(explorerService.onCheckboxChange).toHaveBeenCalledWith(mockLeafNode);
    });

    it('should check if item is selected', () => {
      explorerService.isSelected.and.returnValue(true);

      const result = component.isSelectedList(mockLeafNode);

      expect(explorerService.isSelected).toHaveBeenCalledWith(mockLeafNode);
      expect(result).toBeTrue();
    });

    it('should toggle select all', () => {
      component.toggleSelectAll();

      expect(component.selectAllChecked).toBeTrue();
      expect(explorerService.selectAllItems).toHaveBeenCalledWith(
        component['items'],
        true
      );
    });
  });

  describe('Sorting', () => {
    it('should sort items by name', () => {
      component.orderByName();
      
      const names = component['items'].map(item => item.data.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('should sort items by size', () => {
      helperService.getSize.and.callFake((item: INode) => item.data.size);
      
      component.orderBySize();
      
      const sizes = component['items'].map(item => Number(item.data.size));
      expect(sizes).toEqual([512, 1024, 2048]);
    });

    it('should sort items by date', () => {
      helperService.getLastModified.and.callFake((item: INode) => item.data.lastModified);
      
      component.orderByDate();
      
      const dates = component['items'].map(item => item.data.lastModified);
      expect(dates).toEqual([
        '2024-03-12T12:00:00Z',
        '2024-03-13T12:00:00Z',
        '2024-03-14T12:00:00Z'
      ]);
    });
  });

  describe('Icon and Type Detection', () => {
    it('should return folder icon for non-leaf items', () => {
      const result = component.getIcons(mockFolderNode);
      expect(result).toBe(component.icons.node);
    });

    it('should return correct icon for leaf items', () => {
      helperService.getFileType.and.returnValue('pdf');
      const result = component.getIcons(mockLeafNode);
      expect(result).toBe('pdf');
    });

    it('should detect folders correctly', () => {
      expect(component.isFolder(mockFolderNode)).toBeTrue();
      expect(component.isFolder(mockLeafNode)).toBeFalse();
      expect(component.isFolder(mockExternalUrlNode)).toBeTrue();
    });

    it('should detect downloadable items correctly', () => {
      expect(component.isDownloadable(mockLeafNode)).toBeTrue();
      expect(component.isDownloadable(mockFolderNode)).toBeFalse();
    });

    it('should map file types to correct icons', () => {
      const testCases = [
        { fileType: 'application/pdf', expected: 'pdf' },
        { fileType: 'video/mp4', expected: 'video' },
        { fileType: 'image/jpeg', expected: 'photo' },
        { fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', expected: 'doc' },
        { fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', expected: 'xlsx' },
        { fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', expected: 'pptx' },
        { fileType: 'application/zip', expected: 'zip' },
        { fileType: 'unknown-type', expected: 'txt' } // default case
      ];

      testCases.forEach(({ fileType, expected }) => {
        helperService.getFileType.and.returnValue(fileType);
        const result = component.getIconByFileType({});
        expect(result).toBe(expected);
      });
    });
  });
});
