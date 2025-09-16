import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconsComponent } from './icons.component';
import { ExplorerService } from '../../services/explorer.service';
import { HelperService } from '../../services/helper.service';
import { FILTER_STRING } from '../../injection-tokens/tokens';
import { BehaviorSubject } from 'rxjs';
import { INode } from '../../shared/types';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('IconsComponent', () => {
  let component: IconsComponent;
  let fixture: ComponentFixture<IconsComponent>;
  let explorerService: jasmine.SpyObj<ExplorerService>;
  let helperService: jasmine.SpyObj<HelperService>;
  let filterSubject: BehaviorSubject<string>;
  let itemsSubject: BehaviorSubject<INode[]>;
  let selectedNodesSubject: BehaviorSubject<INode[]>;
  let selectableItemsSubject: BehaviorSubject<boolean>;
  let downloadableFilesSubject: BehaviorSubject<INode[]>;
  let openedNodeSubject: BehaviorSubject<INode>;

  const mockNode: INode = {
    id: 1,
    parentId: 0,
    data: { name: 'folder', path: '/folder', fileType: 'folder' },
    isLeaf: false,
    children: []
  };

  const mockLeaf: INode = {
    id: 2,
    parentId: 1,
    data: { name: 'test.pdf', path: '/folder/test.pdf', fileType: 'pdf' },
    isLeaf: true,
    children: []
  };

  const mockExternalUrlNode: INode = {
    id: 3,
    parentId: 0,
    data: { name: 'external', path: '/external', externalURL: 'https://example.com' },
    isLeaf: true,
    children: []
  };

  beforeEach(async () => {
    filterSubject = new BehaviorSubject<string>('');
    itemsSubject = new BehaviorSubject<INode[]>([]);
    selectedNodesSubject = new BehaviorSubject<INode[]>([]);
    selectableItemsSubject = new BehaviorSubject<boolean>(false);
    downloadableFilesSubject = new BehaviorSubject<INode[]>([]);
    openedNodeSubject = new BehaviorSubject<INode>({ id: 0, parentId: -1, data: {}, isLeaf: false, children: [] });

    const explorerServiceSpy = jasmine.createSpyObj('ExplorerService', [
      'openNode',
      'selectNodes',
      'dbClick',
      'dbSelect',
      'emptyClick',
      'openLeaf',
      'getCurrentPath',
      'openFile',
      'onCheckboxChange',
      'isSelected'
    ], {
      openedNode: openedNodeSubject.asObservable(),
      selectedNodes: selectedNodesSubject.asObservable(),
      selectableItems: selectableItemsSubject.asObservable(),
      downloadableFiles: downloadableFilesSubject.asObservable()
    });

    const helperServiceSpy = jasmine.createSpyObj('HelperService', [
      'getName',
      'getFileType',
      'getLastModified',
      'getSize',
      'getContent'
    ]);

    // Configure default behavior for HelperService methods
    helperServiceSpy.getName.and.callFake((data: any) => data.name);
    helperServiceSpy.getFileType.and.callFake((data: any) => data.fileType || 'unknown-type');
    helperServiceSpy.getLastModified.and.returnValue('');
    helperServiceSpy.getSize.and.returnValue('');
    helperServiceSpy.getContent.and.returnValue('');

    await TestBed.configureTestingModule({
      declarations: [IconsComponent],
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
    fixture = TestBed.createComponent(IconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Opening Items', () => {
    it('should open leaf item', () => {
      const event = new MouseEvent('click');
      component.openner(event, mockLeaf);
      expect(explorerService.openLeaf).toHaveBeenCalledWith(mockLeaf);
      expect(explorerService.openFile).toHaveBeenCalledWith(mockLeaf);
    });

    it('should open node item', () => {
      const event = new MouseEvent('click');
      component.openner(event, mockNode);
      expect(explorerService.openNode).toHaveBeenCalledWith(mockNode.id);
      expect(explorerService.getCurrentPath).toHaveBeenCalled();
    });
  });

  describe('Mouse Events', () => {
    it('should handle right click', () => {
      const event = new MouseEvent('contextmenu');
      component.rightClick(event, mockNode);
      expect(explorerService.selectNodes).toHaveBeenCalled();
      expect(explorerService.dbClick).toHaveBeenCalledWith(mockNode);
    });

    it('should handle select', () => {
      const event = new MouseEvent('click');
      component.select(event, mockNode);
      expect(explorerService.selectNodes).toHaveBeenCalled();
      expect(explorerService.dbSelect).toHaveBeenCalledWith(mockNode);
    });

    it('should handle empty space click', () => {
      component.emptySpaceClick();
      expect(explorerService.selectNodes).toHaveBeenCalledWith([]);
      expect(explorerService.emptyClick).toHaveBeenCalled();
    });
  });

  describe('Icon Management', () => {
    it('should get folder icon for node', () => {
      const icon = component.getIcons(mockNode);
      expect(icon).toBe(component.icons.node);
    });

    it('should get file type icon for leaf', () => {
      helperService.getFileType.and.returnValue('pdf');
      const icon = component.getIcons(mockLeaf);
      expect(icon).toBe('pdf');
    });

    it('should get icon by file type', () => {
      const testCases = [
        { fileType: 'application/pdf', expected: 'pdf' },
        { fileType: 'doc', expected: 'doc' },
        { fileType: 'video/mp4', expected: 'video' },
        { fileType: 'image/jpeg', expected: 'photo' },
        { fileType: 'unknown', expected: 'txt' }
      ];

      testCases.forEach(({ fileType, expected }) => {
        helperService.getFileType.and.returnValue(fileType);
        const icon = component.getIconByFileType({});
        expect(icon).toBe(expected);
      });
    });
  });

  describe('Item State', () => {
    it('should check if item is selected', () => {
      component.isSelectedItem(mockNode);
      expect(explorerService.isSelected).toHaveBeenCalledWith(mockNode);
    });

    it('should handle checkbox change', () => {
      component.onCheckboxChange(mockNode);
      expect(explorerService.onCheckboxChange).toHaveBeenCalledWith(mockNode);
    });

    it('should identify folder items', () => {
      expect(component.isFolder(mockNode)).toBeTrue();
      expect(component.isFolder(mockLeaf)).toBeFalse();

      const externalUrlNode = {
        ...mockLeaf,
        data: { ...mockLeaf.data, externalURL: 'https://example.com' }
      };
      expect(component.isFolder(externalUrlNode)).toBeTrue();
    });

    it('should identify downloadable items', () => {
      const downloadableLeaf = {
        ...mockLeaf,
        data: { ...mockLeaf.data, isDownloadable: true }
      };
      expect(component.isDownloadable(downloadableLeaf)).toBeTrue();
      expect(component.isDownloadable(mockNode)).toBeFalse();
    });
  });

  describe('Photo Map', () => {
    it('should have correct mappings for all supported file types', () => {
      const expectedMappings = {
        'application/pdf': 'pdf',
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
        'application/vnd.oasis.opendocument.presentation': 'odp',
        'application/vnd.oasis.opendocument.spreadsheet': 'ods',
        'pptx': 'pptx',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'txt': 'txt',
        'video/mp4': 'video',
        'video': 'video',
        'xlsx': 'xlsx',
        'xls': 'xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'image/jpeg': 'photo',
        'image/png': 'photo',
        'image': 'photo',
        'audio/x-ms-wma': 'audio',
        'audio/mpeg': 'audio',
        'audio/webm': 'audio.',
        'audio/ogg': 'audio',
        'audio/wav': 'audio',
        'application/x-msdownload': 'exe',
        'application/zip': 'zip',
        'image/svg+xml': 'vector',
        'link': 'link'
      };

      Object.entries(expectedMappings).forEach(([mimeType, icon]) => {
        expect(component.photoMap[mimeType as keyof typeof component.photoMap]).toBe(icon);
      });
    });
  });

  describe('Filtering', () => {
    it('should filter items based on search string', () => {
      component['items'] = [mockLeaf, mockNode, mockExternalUrlNode];
      filterSubject.next('test');
      
      expect(component.filteredItems.length).toBe(1);
      expect(component.filteredItems[0]).toBe(mockLeaf);
    });

    it('should show all items when filter is empty', () => {
      component['items'] = [mockLeaf, mockNode, mockExternalUrlNode];
      filterSubject.next('');
      
      expect(component.filteredItems.length).toBe(3);
    });

    it('should handle case-insensitive filtering', () => {
      component['items'] = [mockLeaf, mockNode, mockExternalUrlNode];
      filterSubject.next('TEST');
      
      expect(component.filteredItems.length).toBe(1);
      expect(component.filteredItems[0]).toBe(mockLeaf);
    });
  });

  describe('Display Name Handling', () => {
    it('should get correct display name for regular items', () => {
      const name = component.getDisplayName(mockLeaf.data);
      expect(name).toBe(mockLeaf.data.name);
    });

    it('should handle items with external URLs', () => {
      const name = component.getDisplayName(mockExternalUrlNode.data);
      expect(name).toBe(mockExternalUrlNode.data.name);
    });
  });
});
