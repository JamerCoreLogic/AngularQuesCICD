import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ExplorerService } from './explorer.service';
import { ConcreteDataService } from './concrete-data.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { INode } from '../shared/types';

import Swal, { SweetAlertResult } from 'sweetalert2';

type SecureViewType = {
  type: 'video' | 'pdf' | 'image';
  url: string;
  name?: string;
  isDownloadable?: boolean;
  path?: string;
};

interface ConcreteDataServiceWithUpdate extends ConcreteDataService {
  updateDownloadable: (items: any[]) => Observable<any>;
}

describe('ExplorerService', () => {
  let service: ExplorerService;
  let dataService: jasmine.SpyObj<ConcreteDataServiceWithUpdate>;
  let dialog: jasmine.SpyObj<MatDialog>;

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

  beforeEach(() => {
    const dataServiceSpy = jasmine.createSpyObj('ConcreteDataService', [
      'getNodeChildren',
      'createNode',
      'renameNode',
      'renameLeaf',
      'deleteNodes',
      'deleteLeafs',
      'uploadFiles',
      'download',
      'open',
      'share',
      'rightClick',
      'leftClick',
      'emptyClick',
      'getCurrentPath',
      'streamVideo',
      'getFile',
      'updateResources'
    ]);

    // Setup default responses before creating the service
    dataServiceSpy.getNodeChildren.and.returnValue(of({ nodes: [], leafs: [] }));
    dataServiceSpy.createNode.and.returnValue(of(mockNode));
    dataServiceSpy.renameNode.and.returnValue(of(mockNode));
    dataServiceSpy.renameLeaf.and.returnValue(of(mockLeaf));
    dataServiceSpy.deleteNodes.and.returnValue(of([]));
    dataServiceSpy.deleteLeafs.and.returnValue(of([]));
    dataServiceSpy.uploadFiles.and.returnValue(of([]));
    dataServiceSpy.download.and.returnValue(of({}));
    dataServiceSpy.open.and.returnValue(of({}));
    dataServiceSpy.share.and.returnValue(of({}));
    dataServiceSpy.rightClick.and.returnValue(of({}));
    dataServiceSpy.leftClick.and.returnValue(of({}));
    dataServiceSpy.emptyClick.and.returnValue(of({}));
    dataServiceSpy.getCurrentPath.and.returnValue(of({}));
    dataServiceSpy.updateResources.and.returnValue(of({ success: true, message: 'Updated successfully' }));

    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        ExplorerService,
        { provide: ConcreteDataService, useValue: dataServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    });

    dataService = TestBed.inject(ConcreteDataService) as jasmine.SpyObj<ConcreteDataServiceWithUpdate>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    service = TestBed.inject(ExplorerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Node Selection', () => {
    it('should select nodes', (done) => {
      const nodes = [mockNode];
      service.selectNodes(nodes);
      service.selectedNodes.subscribe(selectedNodes => {
        expect(selectedNodes).toEqual(nodes);
        done();
      });
    });

    it('should add item to selection', () => {
      service.selectableItems$.next(true);
      service.addItemToSelection(mockNode);
      expect(service['selectedItems']).toContain(mockNode);
    });

    it('should remove item from selection', () => {
      service.selectableItems$.next(true);
      service.addItemToSelection(mockNode);
      service.removeItemFromSelection(mockNode);
      expect(service['selectedItems']).not.toContain(mockNode);
    });
  });

  describe('Node Operations', () => {
   

    it('should create node', fakeAsync(() => {
      const nodeName = 'newNode';
      const refreshSpy = spyOn(service, 'refresh');
      
      service.createNode(nodeName);
      tick();

      expect(dataService.createNode).toHaveBeenCalled();
      expect(refreshSpy).toHaveBeenCalled();
    }));

    it('should rename node', fakeAsync(() => {
      const newName = 'renamed';
      service.selectNodes([mockNode]);
      
      service.rename(newName);
      tick();

      expect(dataService.renameNode).toHaveBeenCalled();
    }));

    it('should rename leaf', fakeAsync(() => {
      const newName = 'renamed.pdf';
      service.selectNodes([mockLeaf]);
      
      service.rename(newName);
      tick();

      expect(dataService.renameLeaf).toHaveBeenCalled();
    }));

    it('should throw error when renaming multiple selections', () => {
      service.selectNodes([mockNode, mockLeaf]);
      
      expect(() => service.rename('test')).toThrowError('Multiple selection rename not supported');
    });
  });

  describe('File Operations', () => {
    it('should handle file upload', fakeAsync(() => {
      const files = [new File([''], 'test.txt')];
      const refreshSpy = spyOn(service, 'refresh');
      
      service.upload(files);
      tick();

      expect(dataService.uploadFiles).toHaveBeenCalled();
      expect(refreshSpy).toHaveBeenCalled();
    }));

    it('should handle file download', fakeAsync(() => {
      service.selectNodes([mockLeaf]);
      
      service.download();
      tick();

      expect(dataService.download).toHaveBeenCalled();
    }));

    it('should handle file sharing', fakeAsync(() => {
      service.selectNodes([mockLeaf]);
      
      service.share();
      tick();

      expect(dataService.share).toHaveBeenCalled();
    }));

    it('should open file with external URL', () => {
      const nodeWithExternalUrl = {
        ...mockLeaf,
        data: { ...mockLeaf.data, externalURL: 'https://example.com' }
      };
      
      const windowSpy = spyOn(window, 'open');
      service.openFile(nodeWithExternalUrl);
      
      expect(windowSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    });

    it('should handle video file opening', () => {
      const videoNode = {
        ...mockLeaf,
        data: { ...mockLeaf.data, fileType: 'video', path: '/test/video.mp4' }
      };
      
      dataService.streamVideo.and.returnValue('video-stream-url');
      service.openFile(videoNode);
      
      const expectedSecureView: SecureViewType = {
        type: 'video',
        url: 'video-stream-url',
        name: videoNode.data.name,
        isDownloadable: videoNode.data.isDownloadable,
        path: videoNode.data.path
      };
      
      expect(service.secureView$.value).toEqual(expectedSecureView);
    });
  });

  describe('Tree Operations', () => {
    it('should handle node expansion', fakeAsync(() => {
      const nodeId = 1;
      dataService.getNodeChildren.and.returnValue(of({ nodes: [mockNode], leafs: [mockLeaf] }));
      
      service.expandNode(nodeId);
      tick();

      expect(dataService.getNodeChildren).toHaveBeenCalled();
    }));



    it('should throw error when removing with no selection', () => {
      expect(() => service.remove()).toThrowError('Nothing selected to remove');
    });
  });

  describe('Path Operations', () => {
    it('should get current path when in home', () => {
      service.getCurrentPath();
      expect(dataService.getCurrentPath).toHaveBeenCalledWith('Home');
    });

  
  });

  describe('Selection Management', () => {
    it('should select all items', () => {
      const items = [mockNode, mockLeaf];
      service.selectAllItems(items, true);
      expect(service['selectedItems']).toEqual(items);
    });

    it('should deselect all items', () => {
      const items = [mockNode, mockLeaf];
      service.selectAllItems(items, true);
      service.selectAllItems(items, false);
      expect(service['selectedItems']).toEqual([]);
    });

    it('should check if item is selected', () => {
      service.selectableItems$.next(true);
      service.addItemToSelection(mockNode);
      expect(service.isSelected(mockNode)).toBeTrue();
      expect(service.isSelected(mockLeaf)).toBeFalse();
    });



    it('should handle checkbox change', () => {
      const item = { ...mockLeaf, data: { ...mockLeaf.data, isDownloadable: false } };
      service.onCheckboxChange(item);
      expect(item.data.isDownloadable).toBeTrue();
      expect(service['changedItems']).toContain(item);
    });

  });

  describe('Secure Viewer Management', () => {
    it('should clear view', () => {
      service.secureView$.next({ type: 'pdf', url: 'test.pdf' });
      service.clearView();
      expect(service.secureView$.value).toBeNull();
    });

    it('should decrypt file', () => {
      const ciphertext = 'U2FsdGVkX1+8rT9p+IN8RwZv8yiy6Yt0DQqJ5VPEi7Y=';
      const key = service.encryptionKey;
      const decrypted = service.decryptFile(ciphertext, key);
      expect(decrypted).toBeDefined();
    });
  });

  describe('Message Handling', () => {
    it('should handle success message', () => {
      const sweetAlertSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false, value: undefined }) as Promise<SweetAlertResult<any>>);
      service.messageHandler({ success: true, message: 'Success' });
      expect(sweetAlertSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        text: 'Success',
        icon: 'success'
      }));
    });

    it('should handle error message', () => {
      const sweetAlertSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false, value: undefined }) as Promise<SweetAlertResult<any>>);
      service.messageHandler({ success: false, message: 'Error' });
      expect(sweetAlertSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        text: 'Error',
        icon: 'error'
      }));
    });
  });


}); 