import { TestBed } from '@angular/core/testing';
import { PopupService } from './popup.service';
import { DialogService } from '../aq-dialog/dialog.service';
import { NewPopupComponent } from './newPopup.component';
import { IPopup } from './popup';

describe('PopupService', () => {
    let service: PopupService;
    let dialogServiceSpy: jasmine.SpyObj<DialogService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('DialogService', ['open']);

        TestBed.configureTestingModule({
            providers: [
                PopupService,
                { provide: DialogService, useValue: spy }
            ]
        });

        service = TestBed.inject(PopupService);
        dialogServiceSpy = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit popup message when show() is called', (done) => {
        const expectedMessage: IPopup = {
            heading: 'Test Heading',
            message: 'Test Message',
            display: true
        };

        service.popupMessage.subscribe((msg) => {
            expect(msg).toEqual(expectedMessage);
            done();
        });

        service.show('Test Heading', 'Test Message');
    });

    it('should call dialogService.open with correct parameters in showPopup()', () => {
        const title = 'Test Title';
        const message = 'Test Message';
        const dialogRefMock: any = { close: jasmine.createSpy() };
        dialogServiceSpy.open.and.returnValue(dialogRefMock as any);

        const result = service.showPopup(title, message);

        expect(dialogServiceSpy.open).toHaveBeenCalledWith(NewPopupComponent, {
            data: {
                title,
                message
            }
        });
        expect(result).toBe(dialogRefMock);
    });
});
