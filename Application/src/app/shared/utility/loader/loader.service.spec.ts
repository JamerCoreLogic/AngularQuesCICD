import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
    let service: LoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit false when hide() is called', (done: DoneFn) => {
        service.isLoading.subscribe(value => {
            expect(value).toBeFalse();
            done();
        });
        service.show();
    });

    it('should emit true when show() is called', (done: DoneFn) => {
        service.isLoading.subscribe(value => {
            expect(value).toBeTrue();
            done();
        });
        service.hide();
    });
});
