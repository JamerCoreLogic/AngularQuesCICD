import { TestBed } from '@angular/core/testing';
import { CheckRoleService } from './check-role.service';

describe('CheckRoleService', () => {
  let service: CheckRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isRoleIdAvailable', () => {
    it('should return true if roleId is available', () => {
      const roleList = [{ roleId: 1 }, { roleId: 2 }];
      expect(service.isRoleIdAvailable(2, roleList)).toBeTrue();
    });

    it('should return false if roleId is not available', () => {
      const roleList = [{ roleId: 1 }, { roleId: 2 }];
      expect(service.isRoleIdAvailable(3, roleList)).toBeFalse();
    });

    it('should return undefined if roleList is empty', () => {
      expect(service.isRoleIdAvailable(1, [])).toBeUndefined();
    });
  });

  describe('isRoleCodeAvailable', () => {
    it('should return true if roleCode is available', () => {
      const roleList = [{ roleCode: 'ADMIN' }, { roleCode: 'USER' }];
      expect(service.isRoleCodeAvailable('USER', roleList)).toBeTrue();
    });

    it('should return false if roleCode is not available', () => {
      const roleList = [{ roleCode: 'ADMIN' }, { roleCode: 'USER' }];
      expect(service.isRoleCodeAvailable('MANAGER', roleList)).toBeFalse();
    });

    it('should return undefined if roleList is empty', () => {
      expect(service.isRoleCodeAvailable('ADMIN', [])).toBeUndefined();
    });

    it('should return undefined if roleList is null', () => {
      expect(service.isRoleCodeAvailable('ADMIN', null)).toBeUndefined();
    });
  });
});

