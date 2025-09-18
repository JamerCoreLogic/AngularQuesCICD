import { TestBed } from '@angular/core/testing';
import { ChartsService } from './charts.service';

describe('ChartsService', () => {
    let service: ChartsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChartsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return correct chart options from getCharts', () => {
        const chartType = 'column';
        const chartName = 'Test Chart';
        const categories = ['Jan', 'Feb', 'Mar'];
        const seriesData = [10, 20, 30];

        const result = service.getCharts(chartType, chartName, categories, seriesData);

        expect(result.chart.type).toBe(chartType);
        expect(result.series[0].name).toBe(chartName);
        expect(result.xAxis.categories).toEqual(categories);
        expect(result.series[0].data).toEqual(seriesData);
        expect(result.tooltip).toBeDefined();
        expect(result.plotOptions.column.pointPadding).toBe(0.2);
    });
});
