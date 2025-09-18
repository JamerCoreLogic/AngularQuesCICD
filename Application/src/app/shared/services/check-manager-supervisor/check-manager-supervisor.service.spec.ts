import { TestBed } from '@angular/core/testing';
import { CheckManagerSupervisorService } from './check-manager-supervisor.service';

describe('CheckManagerSupervisorService', () => {
  let service: CheckManagerSupervisorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckManagerSupervisorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isManagerIdAvailable', () => {
    it('should return true if managerId exists in the list', () => {
      const managerList = [
        { managerId: 1 },
        { managerId: 2 },
        { managerId: 3 }
      ];
      expect(service.isManagerIdAvailable(2, managerList)).toBeTrue();
    });

    it('should return false if managerId does not exist in the list', () => {
      const managerList = [
        { managerId: 1 },
        { managerId: 2 }
      ];
      expect(service.isManagerIdAvailable(3, managerList)).toBeFalse();
    });

    it('should return undefined if managerList is empty', () => {
      expect(service.isManagerIdAvailable(1, [])).toBeUndefined();
    });
  });

  describe('isSupervisorIdAvailable', () => {
    it('should return true if supervisorId exists in the list', () => {
      const supervisorList = [
        { supervisorId: 'A1' },
        { supervisorId: 'B2' }
      ];
      expect(service.isSupervisorIdAvailable('B2', supervisorList)).toBeTrue();
    });

    it('should return false if supervisorId does not exist in the list', () => {
      const supervisorList = [
        { supervisorId: 'A1' },
        { supervisorId: 'B2' }
      ];
      expect(service.isSupervisorIdAvailable('C3', supervisorList)).toBeFalse();
    });

    it('should return undefined if supervisorList is empty', () => {
      expect(service.isSupervisorIdAvailable('A1', [])).toBeUndefined();
    });
  });
});
