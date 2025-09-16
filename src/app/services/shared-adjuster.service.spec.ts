import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SharedAdjusterService } from './shared-adjuster.service';

describe('SharedAdjusterService', () => {
  let service: SharedAdjusterService;

  // Mock Google Maps objects
  const mockDistanceMatrixService = {
    getDistanceMatrix: jasmine.createSpy('getDistanceMatrix').and.callFake((request, callback) => {
      callback({
        rows: [{
          elements: [{
            status: 'OK',
            distance: { value: 16093.4, text: '10 miles' },
            duration: { text: '15 mins' }
          }]
        }]
      }, 'OK');
    })
  };

  const mockGoogleMaps = {
    LatLng: class {
      constructor(public lat: number, public lng: number) {}
    },
    DistanceMatrixService: function() {
      return mockDistanceMatrixService;
    },
    TravelMode: { DRIVING: 'DRIVING' },
    UnitSystem: { IMPERIAL: 'IMPERIAL' },
    DistanceMatrixStatus: { OK: 'OK' }
  };

  beforeEach(() => {
    // Setup Google Maps mock
    (window as any).google = {
      maps: mockGoogleMaps
    };

    TestBed.configureTestingModule({
      providers: [SharedAdjusterService]
    });
    
    // Clear localStorage before each test
    localStorage.clear();
    
    // Create a fresh service instance for each test
    service = TestBed.inject(SharedAdjusterService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('State Management', () => {
    it('should set and get search text', () => {
      const searchText = 'test search';
      service.setSearchText(searchText);
      
      service.searchText$.subscribe(value => {
        expect(value).toBe(searchText);
      });
      
      expect(service.getCurrentSearchText()).toBe(searchText);
    });

    it('should set and get radius', () => {
      const radius = 50000;
      service.setRadius(radius);
      
      service.radius$.subscribe(value => {
        expect(value).toBe(radius);
      });
    });

    it('should set and get filter', () => {
      const filter = 'test filter';
      service.setFilter(filter);
      
      service.filterSubject$.subscribe(value => {
        expect(value).toBe(filter);
      });
    });

    it('should set and get company name filter', () => {
      const companyName = 'Test Company';
      service.setcompanyNamevalue(companyName);
      
      service.companyNamevalueSubject$.subscribe(value => {
        expect(value).toBe(companyName);
      });
    });

    it('should set and get survey title', () => {
      const surveyTitle = 'Test Survey';
      service.setSurveyTitle(surveyTitle);
      expect(service.getSurveyTitle()).toBe(surveyTitle);
    });

    it('should set and get survey name', () => {
      const surveyName = 'Test Survey Name';
      service.setSurveyName(surveyName);
      expect(service.getSurveyName()).toBe(surveyName);
    });
  });

  describe('Filter Operations', () => {
    it('should set and get operator with AND', () => {
      service.setOperator('and');
      expect(service.getOperator()).toBe('AND');
    });

    it('should set and get operator with OR', () => {
      service.setOperator('or');
      expect(service.getOperator()).toBe('OR');
    });

    it('should handle empty operator', () => {
      service.setOperator('');
      expect(service.getOperator()).toBe('');
    });

    it('should set filter applied state', () => {
      service.isFilterApplyed(true);
      
      service.isFilterSubject$.subscribe(value => {
        expect(value).toBe(true);
      });
    });
  });

  describe('Distance Calculations', () => {
    it('should calculate straight-line distance correctly', () => {
      // New York to Los Angeles approximate coordinates
      const distance = service.calculateDistance(
        40.7128, -74.0060,  // New York
        34.0522, -118.2437  // Los Angeles
      );
      
      // Approximate distance should be around 2,450 miles
      expect(distance).toBeCloseTo(2450, -2); // Using -2 precision to allow some variance
    });

    it('should convert kilometers to miles correctly', () => {
      expect(service.kmToMiles(100)).toBeCloseTo(62.1371);
    });

    it('should convert meters to miles correctly', () => {
      expect(service.convertMetersToMiles(16093.4)).toBeCloseTo(10);
    });

    it('should calculate zoom level based on radius', () => {
      expect(service.calculateZoom(100)).toBeGreaterThan(5);
      expect(service.calculateZoom(1000000)).toBeLessThan(11);
    });
  });

  describe('Google Maps Integration', () => {
    it('should calculate driving distance using Google Maps API', async () => {
      const result = await service.calculateDrivingDistance(40.7128, -74.0060, 34.0522, -118.2437);
      expect(result).toBeCloseTo(10);
    });

    it('should handle batch driving distance calculations', async () => {
      const adjusters = [
        { latitude: '34.0522', longitude: '-118.2437', name: 'Adjuster 1' },
        { latitude: '40.7128', longitude: '-74.0060', name: 'Adjuster 2' }
      ];

      const results = await service.calculateBatchDrivingDistances(
        35.0000,
        -75.0000,
        adjusters
      );

      expect(results.length).toBe(2);
      expect(results[0].drivingDistance).toBe('10 miles');
      expect(results[0].drivingDuration).toBe('15 mins');
    });
  });

  describe('Local Storage Integration', () => {
    it('should save and load state from localStorage', () => {
      const testState = {
        searchText: 'test search',
        radius: 50000,
        filter: 'test filter',
        companyNameFilter: 'test company',
        surveyNameFilter: 'test survey name',
        surveyTitleFilter: 'test survey title'
      };

      // Save state
      service.saveState(
        testState.searchText,
        testState.radius,
        testState.filter,
        testState.companyNameFilter,
        testState.surveyNameFilter,
        testState.surveyTitleFilter
      );

      // Verify state is saved
      const savedState = service.getState();
      expect(savedState.search).toBe(testState.searchText);
      expect(savedState.radius).toBe(testState.radius);
      expect(savedState.filter).toBe(testState.filter);
    });

    it('should load initial state from localStorage', (done) => {
      // Clear any existing service instances
      TestBed.resetTestingModule();
      
      // First, set up the localStorage with initial data
      const savedData = {
        searchText: 'test search',
        radius: 80467.2, // 50 miles in meters
        filter: 'test filter',
        companyNameFilter: 'test company',
        surveyTitleFilter: 'test survey title',
        surveyNameFilter: 'test survey name'
      };

      // Save data to localStorage before creating service
      localStorage.setItem('findAdjusterSearch', JSON.stringify(savedData));

      // Configure TestBed after setting localStorage
      TestBed.configureTestingModule({
        providers: [SharedAdjusterService]
      });

      // Create new service instance to trigger loadInitialState
      const newService = TestBed.inject(SharedAdjusterService);

      // Wait for next tick to ensure loadInitialState has completed
      setTimeout(() => {
        let completed = 0;
        const expectedCompletions = 2;

        // Check search text
        newService.searchText$.subscribe(value => {
          expect(value).toBe(savedData.searchText);
          completed++;
          if (completed === expectedCompletions) done();
        });

        // Check radius
        newService.radius$.subscribe(value => {
          const expectedMiles = savedData.radius / 1609.34;
          expect(value).toBeCloseTo(expectedMiles, 1);
          completed++;
          if (completed === expectedCompletions) done();
        });
      });
    });
  });

  describe('Adjuster Selection and Hovering', () => {
    it('should handle adjuster hovering', () => {
      const testId = 'test-id';
      
      service.setHoveredAdjuster(testId, 'hover');
      
      service.adjusterHovered$.subscribe(value => {
        expect(value?.id).toBe(testId);
        expect(value?.action).toBe('hover');
      });
    });

    it('should handle adjuster selection', () => {
      const testId = 'test-id';
      
      service.setSelectedAdjuster(testId, true);
      
      service.adjusterSelected$.subscribe(value => {
        expect(value?.userId).toBe(testId);
        expect(value?.isSelected).toBe(true);
      });
    });

    it('should manage selected adjuster list', () => {
      const testIds = ['id1', 'id2', 'id3'];
      
      service.setSelectedAdjusterList(testIds);
      
      expect(service.getCurrentSelectedAdjusterList()).toEqual(testIds);
      
      service.adjusterSelectedList$.subscribe(value => {
        expect(value).toEqual(testIds);
      });
    });
  });
}); 