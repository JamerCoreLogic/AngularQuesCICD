import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BaseView } from './base-view.directive';
import { ExplorerService } from '../../services/explorer.service';
import { HelperService } from '../../services/helper.service';
import { FILTER_STRING } from '../../injection-tokens/tokens';
import { BehaviorSubject } from 'rxjs';
import { INode } from '../../shared/types';

@Component({
  template: ''
})
class TestComponent extends BaseView {}

describe('BaseView', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let explorerService: jasmine.SpyObj<ExplorerService>;
  let helperService: jasmine.SpyObj<HelperService>;
  let filterSubject: BehaviorSubject<string>;

  const mockNode: INode = {
    id: 1,
    parentId: 0,
    data: { name: 'test', path: '/test', fileType: 'folder' },
    isLeaf: false,
    children: []
  };

  const mockLeaf: INode = {
    id: 2,
    parentId: 1,
    data: { name: 'test.pdf', path: '/test/test.pdf', fileType: 'pdf' },
    isLeaf: true,
    children: []
  };

  beforeEach(async () => {
    filterSubject = new BehaviorSubject<string>('');

    const explorerSpy = jasmine.createSpyObj('ExplorerService', [
      'openNode',
      'selectNodes',
      'dbClick',
      'dbSelect',
      'emptyClick',
      'openLeaf',
      'getCurrentPath'
    ], {
      openedNode: new BehaviorSubject({ children: [mockNode, mockLeaf] }),
      selectedNodes: new BehaviorSubject<INode[]>([]),
      selectableItems: new BehaviorSubject<boolean>(false)
    });

    const helperSpy = jasmine.createSpyObj('HelperService', [
      'getName',
      'getFileType',
      'getLastModified',
      'getSize',
      'getContent'
    ]);

    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      providers: [
        { provide: ExplorerService, useValue: explorerSpy },
        { provide: HelperService, useValue: helperSpy },
        { provide: FILTER_STRING, useValue: filterSubject }
      ]
    }).compileComponents();

    explorerService = TestBed.inject(ExplorerService) as jasmine.SpyObj<ExplorerService>;
    helperService = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with items from openedNode', () => {
      expect(component.items).toEqual([mockNode, mockLeaf]);
    });

    it('should initialize with empty selection', () => {
      expect(component.selection).toEqual([]);
    });

    it('should initialize with downloadableFiles as false', () => {
      expect(component.downloadableFiles).toBeFalse();
    });
  });

  describe('Item Filtering', () => {
    it('should return all items when filter is empty', () => {
      expect(component.filteredItems).toEqual([mockNode, mockLeaf]);
    });

    it('should filter items by name', () => {
      helperService.getName.and.callFake((data) => data.name);
      filterSubject.next('pdf');
      expect(component.filteredItems).toEqual([mockLeaf]);
    });

    it('should handle case-insensitive filtering', () => {
      helperService.getName.and.callFake((data) => data.name);
      filterSubject.next('PDF');
      expect(component.filteredItems).toEqual([mockLeaf]);
    });
  });

  describe('Helper Methods', () => {
    const testData = { name: 'test' };

    it('should get display name', () => {
      component.getDisplayName(testData);
      expect(helperService.getName).toHaveBeenCalledWith(testData);
    });

    it('should get file type', () => {
      component.getFileType(testData);
      expect(helperService.getFileType).toHaveBeenCalledWith(testData);
    });

    it('should get last modified', () => {
      component.getLastModified(testData);
      expect(helperService.getLastModified).toHaveBeenCalledWith(testData);
    });

    it('should get size', () => {
      component.getSize(testData);
      expect(helperService.getSize).toHaveBeenCalledWith(testData);
    });

    it('should get content', () => {
      component.getContent(testData);
      expect(helperService.getContent).toHaveBeenCalledWith(testData);
    });
  });

  describe('Selection Handling', () => {
    it('should select single item without meta key', () => {
      const event = new MouseEvent('click');
      component.select(event, mockNode);
      expect(explorerService.selectNodes).toHaveBeenCalledWith([mockNode]);
    });

    it('should add to selection with meta key', () => {
      const event = new MouseEvent('click', { ctrlKey: true });
      component.select(event, mockNode);
      component.select(event, mockLeaf);
      expect(explorerService.selectNodes).toHaveBeenCalledWith([mockNode, mockLeaf]);
    });

    it('should remove from selection with meta key if already selected', () => {
      const event = new MouseEvent('click', { ctrlKey: true });
      component.select(event, mockNode);
      component.select(event, mockNode);
      expect(explorerService.selectNodes).toHaveBeenCalledWith([]);
    });

    it('should check if item is selected', () => {
      component.selection = [mockNode];
      expect(component.isSelected(mockNode)).toBeTrue();
      expect(component.isSelected(mockLeaf)).toBeFalse();
    });
  });

  describe('Navigation', () => {
    it('should open node without meta key', () => {
      const event = new MouseEvent('click');
      component.open(event, mockNode);
      expect(explorerService.openNode).toHaveBeenCalledWith(mockNode.id);
      expect(explorerService.getCurrentPath).toHaveBeenCalled();
    });

    it('should not open node with meta key', () => {
      const event = new MouseEvent('click', { ctrlKey: true });
      component.open(event, mockNode);
      expect(explorerService.openNode).not.toHaveBeenCalled();
    });

    it('should handle double click', () => {
      component.dbClick(mockNode);
      expect(explorerService.dbClick).toHaveBeenCalledWith(mockNode);
    });

    it('should handle double select', () => {
      component.dbSelect(mockNode);
      expect(explorerService.dbSelect).toHaveBeenCalledWith(mockNode);
    });
  });

  describe('Empty Space Handling', () => {
    it('should handle empty click', () => {
      component.emptyClick();
      expect(explorerService.emptyClick).toHaveBeenCalled();
      expect(explorerService.getCurrentPath).toHaveBeenCalled();
    });

    it('should clear selection on empty space click', () => {
      component.emptySpaceClick();
      expect(explorerService.selectNodes).toHaveBeenCalledWith([]);
    });
  });

  describe('Leaf Operations', () => {
    it('should open leaf without meta key', () => {
      const event = new MouseEvent('click');
      component.openLeaf(event, mockLeaf);
      expect(explorerService.openLeaf).toHaveBeenCalledWith(mockLeaf);
    });

    it('should not open leaf with meta key', () => {
      const event = new MouseEvent('click', { ctrlKey: true });
      component.openLeaf(event, mockLeaf);
      expect(explorerService.openLeaf).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const unsubscribeSpy = spyOn(component['subs'], 'unsubscribe');
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
}); 