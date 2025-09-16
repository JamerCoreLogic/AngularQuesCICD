import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConcreteDataService } from './concrete-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppSettings } from '../../StaticVariable';

describe('ConcreteDataService', () => {
  let service: ConcreteDataService;
  let httpMock: HttpTestingController;
  let spinnerService: jasmine.SpyObj<NgxSpinnerService>;

  const mockNode = {
    id: 1,
    name: 'Test Folder',
    path: 'test/folder',
    content: ''
  };

  const mockLeaf = {
    id: 2,
    name: 'test.txt',
    path: 'test/folder/test.txt',
    content: 'test content'
  };

  beforeEach(() => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConcreteDataService,
        { provide: NgxSpinnerService, useValue: spinnerSpy }
      ]
    });

    service = TestBed.inject(ConcreteDataService);
    httpMock = TestBed.inject(HttpTestingController);
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Node Operations', () => {
  

 

    it('should create node', () => {
      const result = service.createNode(mockNode, 'New Folder');
      result.subscribe(newNode => {
        expect(newNode.name).toBe('New Folder');
        expect(newNode.id).toBeGreaterThan(mockNode.id);
      });
    });

    it('should rename node', () => {
      const result = service.renameNode(mockNode, 'Renamed Folder');
      result.subscribe(node => {
        expect(node.name).toBe('Renamed Folder');
      });
    });

    it('should delete nodes', () => {
      const result = service.deleteNodes([mockNode]);
      result.subscribe(response => {
        expect(response).toBeTruthy();
      });
    });
  });

  describe('File Operations', () => {
    it('should handle file upload', (done) => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      
      service.uploadFiles(mockNode, [file]).subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });
    });

    it('should handle file download', () => {
      const mockAnchor = document.createElement('a');
      spyOn(document, 'createElement').and.returnValue(mockAnchor);
      spyOn(mockAnchor, 'click');
      const appendChildSpy = spyOn(document.body, 'appendChild');
      const removeChildSpy = spyOn(document.body, 'removeChild');

      service.download(mockLeaf).subscribe(result => {
        expect(result.success).toBeTrue();
        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(appendChildSpy).toHaveBeenCalledWith(mockAnchor);
        expect(mockAnchor.click).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor);
        expect(mockAnchor.href).toContain(`${AppSettings.API_ENDPOINT}${AppSettings.Downloadfile}?filename=${mockLeaf.path}`);
        expect(mockAnchor.download).toBe(mockLeaf.name);
      });
    });

    it('should rename leaf', () => {
      const result = service.renameLeaf(mockLeaf, 'renamed.txt');
      result.subscribe(leaf => {
        expect(leaf.name).toBe('renamed.txt');
      });
    });

    it('should delete leafs', () => {
      const result = service.deleteLeafs([mockLeaf]);
      result.subscribe(response => {
        expect(response).toBeTruthy();
      });
    });

    it('should stream video', () => {
      const url = service.streamVideo('test.mp4');
      expect(url).toBe(`${AppSettings.API_ENDPOINT}${AppSettings.Streamvideo}?fileName=test.mp4`);
    });

    it('should download video file', () => {
      service.downloadVideoFile('test.mp4').subscribe();
      
      const req = httpMock.expectOne(`${AppSettings.API_ENDPOINT}${AppSettings.Downloadfile}?filename=test.mp4`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(new Blob());
    });

    it('should get file', () => {
      service.getFile('test.txt').subscribe();
      
      const req = httpMock.expectOne(`${AppSettings.API_ENDPOINT}${AppSettings.Getfile}?filename=test.txt`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('text');
      req.flush('test content');
      expect(spinnerService.show).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
    });
  });

  describe('Other Operations', () => {
    it('should handle right click', () => {
      service.rightClick(mockNode).subscribe(result => {
        expect(result).toBeTruthy();
      });
    });

    it('should handle left click', () => {
      service.leftClick(mockNode).subscribe(result => {
        expect(result).toBeTruthy();
      });
    });

    it('should handle empty click', () => {
      service.emptyClick().subscribe(result => {
        expect(result).toBeTruthy();
      });
    });

    it('should get current path', () => {
      service.getCurrentPath('test/path').subscribe(result => {
        expect(result).toBeTruthy();
      });
    });

    it('should update resources', () => {
      const mockData = { id: 1, name: 'test' };
      const mockResponse = { success: true, data: mockData };

      service.updateResources(mockData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${AppSettings.API_ENDPOINT}${AppSettings.Updateresources}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockData);
      req.flush(mockResponse);
    });

    it('should handle error in update resources', () => {
      const mockData = { id: 1, name: 'test' };

      service.updateResources(mockData).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${AppSettings.API_ENDPOINT}${AppSettings.Updateresources}`);
      req.error(new ErrorEvent('Network error'));
    });
  });
}); 