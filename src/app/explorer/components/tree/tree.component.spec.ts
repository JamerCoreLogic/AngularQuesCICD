import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeComponent } from './tree.component';
import { ExplorerService } from '../../services/explorer.service';
import { HelperService } from '../../services/helper.service';
import { BehaviorSubject } from 'rxjs';
import { INode } from '../../shared/types';
import { NO_ERRORS_SCHEMA } from '@angular/core';

interface TreeNode extends INode {
  children: TreeNode[];
  expanded: boolean;
}

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;
  let explorerService: jasmine.SpyObj<ExplorerService>;
  let helperService: jasmine.SpyObj<HelperService>;
  let treeSubject: BehaviorSubject<INode | null>;

  const mockRootNode: INode = {
    id: 1,
    parentId: 0,
    data: { name: 'root', path: '/' },
    isLeaf: false,
    children: [
      {
        id: 2,
        parentId: 1,
        data: { name: 'folder1', path: '/folder1' },
        isLeaf: false,
        children: [
          {
            id: 4,
            parentId: 2,
            data: { name: 'subfolder1', path: '/folder1/subfolder1' },
            isLeaf: false,
            children: []
          }
        ]
      },
      {
        id: 3,
        parentId: 1,
        data: { name: 'folder2', path: '/folder2' },
        isLeaf: false,
        children: []
      }
    ]
  };

  beforeEach(async () => {
    treeSubject = new BehaviorSubject<INode | null>(null);

    const explorerServiceSpy = jasmine.createSpyObj('ExplorerService', [
      'openNode',
      'getCurrentPath',
      'expandNode'
    ], {
      tree: treeSubject.asObservable()
    });

    const helperServiceSpy = jasmine.createSpyObj('HelperService', ['getName']);
    helperServiceSpy.getName.and.callFake((node: any) => node?.data?.name);

    await TestBed.configureTestingModule({
      declarations: [TreeComponent],
      providers: [
        { provide: ExplorerService, useValue: explorerServiceSpy },
        { provide: HelperService, useValue: helperServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    explorerService = TestBed.inject(ExplorerService) as jasmine.SpyObj<ExplorerService>;
    helperService = TestBed.inject(HelperService) as jasmine.SpyObj<HelperService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Tree Node Management', () => {
    beforeEach(() => {
      treeSubject.next(mockRootNode);
      fixture.detectChanges();
    });

    it('should initialize with tree nodes from root node', () => {
      expect(component.treeNodes.length).toBe(2);
      expect(component.treeNodes[0].data.name).toBe('folder1');
      expect(component.treeNodes[1].data.name).toBe('folder2');
    });

    it('should expand a node', () => {
      const node = component.treeNodes[0];
      component.expand(node);
      expect(explorerService.expandNode).toHaveBeenCalledWith(node.id);
    });

    it('should collapse a node', () => {
      // First expand the node
      const node = component.treeNodes[0];
      component.expand(node);
      
      // Then collapse it
      component.collapse(node);
      
      // Verify the node is no longer expanded
      const updatedNode = component.treeNodes.find(n => n.id === node.id);
      expect(updatedNode?.expanded).toBeFalse();
    });

    it('should open a node', () => {
      const node = component.treeNodes[0];
      component.open(node);
      expect(explorerService.openNode).toHaveBeenCalledWith(node.id);
      expect(explorerService.getCurrentPath).toHaveBeenCalled();
    });

    it('should handle expanding already expanded node', () => {
      const node = component.treeNodes[0];
      component.expand(node);
      component.expand(node); // Expand again
      expect(explorerService.expandNode).toHaveBeenCalledTimes(2);
    });

    it('should handle collapsing already collapsed node', () => {
      const node = component.treeNodes[0];
      component.collapse(node);
      component.collapse(node); // Collapse again
      expect(component.treeNodes).toBeDefined();
    });
  });

  describe('Node Display', () => {
    it('should get node name using helper service', () => {
      const mockNodeData: INode = {
        id: 1,
        parentId: 0,
        data: { name: 'test', path: '/test' },
        isLeaf: false,
        children: []
      };
      helperService.getName.and.returnValue('test');

      const result = component.getName(mockNodeData);

      expect(helperService.getName).toHaveBeenCalledWith(mockNodeData);
      expect(result).toBe('test');
    });

    it('should handle null node data', () => {
      
      const result = component.getName(null);
      expect(helperService.getName).toHaveBeenCalledWith(null);
      expect(result).toBeUndefined();
    });
  });

  describe('Tree Updates', () => {
    beforeEach(() => {
      // Initialize with empty tree
      treeSubject.next(null);
      fixture.detectChanges();
    });

    it('should update tree nodes when tree changes', () => {
      const newRootNode: INode = {
        id: 4,
        parentId: 0,
        data: { name: 'root', path: '/root' },
        isLeaf: false,
        children: [
          {
            id: 5,
            parentId: 4,
            data: { name: 'new-folder', path: '/root/new-folder' },
            isLeaf: false,
            children: []
          }
        ]
      };

      treeSubject.next(newRootNode);
      fixture.detectChanges();

      expect(component.treeNodes.length).toBe(1);
      expect(component.treeNodes[0].data.name).toBe('new-folder');
    });

    it('should handle empty tree', () => {
      treeSubject.next(null);
      fixture.detectChanges();

      expect(component.treeNodes.length).toBe(0);
    });

    it('should handle tree with leaf nodes', () => {
      const nodeWithLeaf: INode = {
        id: 1,
        parentId: 0,
        data: { name: 'root', path: '/' },
        isLeaf: false,
        children: [
          {
            id: 2,
            parentId: 1,
            data: { name: 'file.txt', path: '/file.txt' },
            isLeaf: true,
            children: []
          }
        ]
      };

      treeSubject.next(nodeWithLeaf);
      fixture.detectChanges();

      expect(component.treeNodes.length).toBe(0); // Leaf nodes should be filtered out
    });

    it('should maintain expanded state when tree updates', () => {
      // First initialize with root node
      treeSubject.next(mockRootNode);
      fixture.detectChanges();

      // Verify we have nodes to work with
      expect(component.treeNodes.length).toBeGreaterThan(0);
      const firstNode = component.treeNodes[0];
      expect(firstNode).toBeDefined();
      expect(firstNode.id).toBeDefined();

      // Expand the node
      component.expand(firstNode);
      fixture.detectChanges();

      // Update tree with same structure but new instance
      const updatedRoot = JSON.parse(JSON.stringify(mockRootNode)); // Deep clone
      treeSubject.next(updatedRoot);
      fixture.detectChanges();

      // Find the same node in updated tree
      const updatedNode = component.treeNodes.find(n => n.id === firstNode.id);
      expect(updatedNode).toBeDefined();
      expect(updatedNode?.expanded).toBeTrue();
    });
  });

  describe('Private Methods', () => {
    it('should build tree correctly', () => {
      const node: INode = {
        id: 1,
        parentId: 0,
        data: { name: 'test', path: '/test' },
        isLeaf: false,
        children: [
          {
            id: 2,
            parentId: 1,
            data: { name: 'child', path: '/test/child' },
            isLeaf: false,
            children: []
          }
        ]
      };

      // First expand the node
      component['addExpandedNode'](node.id);
      
      // Then build the tree
      const result = component['buildTree'](node);

      expect(result.id).toBe(node.id);
      expect(result.expanded).toBeTrue();
      expect(result.children.length).toBe(1);
      expect(result.children[0].id).toBe(2);
    });

    it('should handle adding expanded node', () => {
      const id = 123;
      component['addExpandedNode'](id);
      component['addExpandedNode'](id); // Add same id again
      
      // Verify id was only added once
      const expandedIds = (component as any).expandedIds;
      expect(expandedIds.filter((x: number) => x === id).length).toBe(1);
    });

    it('should handle removing expanded node', () => {
      const id = 123;
      component['addExpandedNode'](id);
      component['removeExpandedNode'](id);
      
      // Verify id was removed
      const expandedIds = (component as any).expandedIds;
      expect(expandedIds.includes(id)).toBeFalse();
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
      component.ngOnDestroy(); // Call destroy again
      
      expect(unsubscribeSpy).toHaveBeenCalledTimes(2);
    });
  });
});
