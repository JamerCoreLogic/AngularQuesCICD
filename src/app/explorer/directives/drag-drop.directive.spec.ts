import { DragDropDirective } from './drag-drop.directive';
import { ExplorerService } from '../services/explorer.service';

describe('DragDropDirective', () => {
  let mockExplorerService: jasmine.SpyObj<ExplorerService>;
  let directive: DragDropDirective;

  beforeEach(() => {
    mockExplorerService = jasmine.createSpyObj('ExplorerService', ['upload']);
    directive = new DragDropDirective(mockExplorerService);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('onDragEnter', () => {
    let mockEvent: DragEvent;

    beforeEach(() => {
      mockEvent = new DragEvent('dragenter');
      spyOn(mockEvent, 'preventDefault');
      spyOn(mockEvent, 'stopPropagation');
    });

    it('should prevent default and stop propagation', () => {
      directive.onDragEnter(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should emit dragEnter event', () => {
      spyOn(directive.dragEnter, 'emit');
      directive.onDragEnter(mockEvent);
      expect(directive.dragEnter.emit).toHaveBeenCalledWith(mockEvent);
    });

    it('should emit dragging true', () => {
      spyOn(directive.dragging, 'emit');
      directive.onDragEnter(mockEvent);
      expect(directive.dragging.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('onDragOver', () => {
    let mockEvent: DragEvent;

    beforeEach(() => {
      mockEvent = new DragEvent('dragover');
      spyOn(mockEvent, 'preventDefault');
      spyOn(mockEvent, 'stopPropagation');
    });

    it('should prevent default and stop propagation', () => {
      directive.onDragOver(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should emit dragOver event', () => {
      spyOn(directive.dragOver, 'emit');
      directive.onDragOver(mockEvent);
      expect(directive.dragOver.emit).toHaveBeenCalledWith(mockEvent);
    });

    it('should emit dragging true', () => {
      spyOn(directive.dragging, 'emit');
      directive.onDragOver(mockEvent);
      expect(directive.dragging.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('onDragLeave', () => {
    let mockEvent: DragEvent;

    beforeEach(() => {
      mockEvent = new DragEvent('dragleave');
      spyOn(mockEvent, 'preventDefault');
      spyOn(mockEvent, 'stopPropagation');
    });

    it('should prevent default and stop propagation', () => {
      directive.onDragLeave(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should emit dragLeave event', () => {
      spyOn(directive.dragLeave, 'emit');
      directive.onDragLeave(mockEvent);
      expect(directive.dragLeave.emit).toHaveBeenCalledWith(mockEvent);
    });

    it('should emit dragging false', () => {
      spyOn(directive.dragging, 'emit');
      directive.onDragLeave(mockEvent);
      expect(directive.dragging.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('onDrop', () => {
    let mockEvent: DragEvent;
    let mockFiles: File[];

    beforeEach(() => {
      mockFiles = [
        new File(['content1'], 'test1.txt'),
        new File(['content2'], 'test2.txt')
      ];

      mockEvent = new DragEvent('drop');
      spyOn(mockEvent, 'preventDefault');
      spyOn(mockEvent, 'stopPropagation');
      Object.defineProperty(mockEvent, 'dataTransfer', {
        value: {
          files: mockFiles
        }
      });
    });

    it('should prevent default and stop propagation', () => {
      directive.onDrop(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should handle drop with files', () => {
      spyOn(directive.dragDrop, 'emit');
      spyOn(directive.dragging, 'emit');

      directive.onDrop(mockEvent);

      expect(mockExplorerService.upload).toHaveBeenCalledWith(mockFiles);
      expect(directive.dragDrop.emit).toHaveBeenCalledWith(mockFiles);
      expect(directive.dragging.emit).toHaveBeenCalledWith(false);
    });

    it('should handle drop without dataTransfer', () => {
      const eventWithoutDataTransfer = new DragEvent('drop');
      spyOn(eventWithoutDataTransfer, 'preventDefault');
      spyOn(eventWithoutDataTransfer, 'stopPropagation');
      Object.defineProperty(eventWithoutDataTransfer, 'dataTransfer', {
        value: null
      });

      spyOn(directive.dragDrop, 'emit');
      spyOn(directive.dragging, 'emit');

      directive.onDrop(eventWithoutDataTransfer);

      expect(mockExplorerService.upload).not.toHaveBeenCalled();
      expect(directive.dragDrop.emit).not.toHaveBeenCalled();
      expect(directive.dragging.emit).toHaveBeenCalledWith(false);
    });

    it('should handle drop with empty files', () => {
      const eventWithEmptyFiles = new DragEvent('drop');
      spyOn(eventWithEmptyFiles, 'preventDefault');
      spyOn(eventWithEmptyFiles, 'stopPropagation');
      Object.defineProperty(eventWithEmptyFiles, 'dataTransfer', {
        value: {
          files: []
        }
      });

      spyOn(directive.dragDrop, 'emit');
      spyOn(directive.dragging, 'emit');

      directive.onDrop(eventWithEmptyFiles);

      expect(mockExplorerService.upload).not.toHaveBeenCalled();
      expect(directive.dragDrop.emit).not.toHaveBeenCalled();
      expect(directive.dragging.emit).toHaveBeenCalledWith(false);
    });

    it('should handle drop with multiple files of different types', () => {
      const mixedFiles = [
        new File(['image content'], 'test.jpg', { type: 'image/jpeg' }),
        new File(['pdf content'], 'test.pdf', { type: 'application/pdf' }),
        new File(['text content'], 'test.txt', { type: 'text/plain' })
      ];

      const eventWithMixedFiles = new DragEvent('drop');
      spyOn(eventWithMixedFiles, 'preventDefault');
      spyOn(eventWithMixedFiles, 'stopPropagation');
      Object.defineProperty(eventWithMixedFiles, 'dataTransfer', {
        value: {
          files: mixedFiles
        }
      });

      spyOn(directive.dragDrop, 'emit');
      spyOn(directive.dragging, 'emit');

      directive.onDrop(eventWithMixedFiles);

      expect(mockExplorerService.upload).toHaveBeenCalledWith(mixedFiles);
      expect(directive.dragDrop.emit).toHaveBeenCalledWith(mixedFiles);
      expect(directive.dragging.emit).toHaveBeenCalledWith(false);
    });

    it('should handle upload service error', () => {
      mockExplorerService.upload.and.throwError('Upload failed');
      
      spyOn(directive.dragDrop, 'emit');
      spyOn(directive.dragging, 'emit');
      
      expect(() => directive.onDrop(mockEvent)).not.toThrow();
      expect(directive.dragging.emit).toHaveBeenCalledWith(false);
    });

    it('should handle drop with undefined files array', () => {
      const eventWithUndefinedFiles = new DragEvent('drop');
      spyOn(eventWithUndefinedFiles, 'preventDefault');
      spyOn(eventWithUndefinedFiles, 'stopPropagation');
      Object.defineProperty(eventWithUndefinedFiles, 'dataTransfer', {
        value: {
          files: undefined
        }
      });

      spyOn(directive.dragDrop, 'emit');
      spyOn(directive.dragging, 'emit');

      directive.onDrop(eventWithUndefinedFiles);

      expect(mockExplorerService.upload).not.toHaveBeenCalled();
      expect(directive.dragDrop.emit).not.toHaveBeenCalled();
      expect(directive.dragging.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('Event Propagation', () => {
    it('should prevent event bubbling for all drag events', () => {
      const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
      events.forEach(eventType => {
        const event = new DragEvent(eventType);
        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');

        switch (eventType) {
          case 'dragenter':
            directive.onDragEnter(event);
            break;
          case 'dragover':
            directive.onDragOver(event);
            break;
          case 'dragleave':
            directive.onDragLeave(event);
            break;
          case 'drop':
            directive.onDrop(event);
            break;
        }

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });
    });
  });
});
