import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphComponent } from './graph.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SeriesLabelsContentArgs, LegendItemClickEvent, SeriesClickEvent } from '@progress/kendo-angular-charts';

interface GraphPercentage {
  acceptedPercent: number | null;
  declinedPercent: number | null;
  notRespondedPercent: number | null;
}

interface GraphData {
  graphPercentage: GraphPercentage;
}

describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;

  const mockGraphData: GraphData = {
    graphPercentage: {
      acceptedPercent: 40,
      declinedPercent: 30,
      notRespondedPercent: 30
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphComponent ],
      imports: [
        ChartsModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    // Set input data
    component.data = mockGraphData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.legendItemName).toBe('Accepted');
    expect(component.data2).toBeDefined();
    expect(component.labelContent).toBeDefined();
  });

  it('should properly initialize data2 array in ngOnInit', () => {
    expect(component.data2).toEqual([
      {
        Status: 'Accepted',
        Count: 40,
        color: 'rgb(120, 210, 55)'
      },
      {
        Status: 'Declined',
        Count: 30,
        color: 'rgb(255, 0, 0)'
      },
      {
        Status: 'No Response',
        Count: 30,
        color: 'rgb(255, 210, 70)'
      }
    ]);
  });

  it('should handle labelContent for non-zero percentage', () => {
    const mockArgs: Partial<SeriesLabelsContentArgs> = {
      percentage: 40,
      category: 'Accepted'
    };
    const result = component.labelContent(mockArgs as SeriesLabelsContentArgs);
    expect(result).toBe('Accepted');
  });

  it('should handle labelContent for zero percentage', () => {
    const mockArgs: Partial<SeriesLabelsContentArgs> = {
      percentage: 0,
      category: 'Accepted'
    };
    const result = component.labelContent(mockArgs as SeriesLabelsContentArgs);
    expect(result).toBe('');
  });

  it('should handle series click event', () => {
    const mockEvent: Partial<SeriesClickEvent> = {
      category: 'Accepted'
    };
    component.onSeriesClick(mockEvent as SeriesClickEvent);
    expect(component.tableData).toBeDefined();
    expect(component.tableData).toEqual({
      Status: 'Accepted',
      Count: 40,
      color: 'rgb(120, 210, 55)'
    });
  });

  it('should handle legend item click event and emit value', () => {
    spyOn(component.legendItemNameOutput, 'emit');
    const mockEvent: Partial<LegendItemClickEvent> = {
      text: 'Declined',
      preventDefault: jasmine.createSpy('preventDefault')
    };
    
    component.onLegendItemClick(mockEvent as LegendItemClickEvent);
    
    expect(component.legendItemName).toBe('Declined');
    expect(component.legendItemNameOutput.emit).toHaveBeenCalledWith('Declined');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should update data2 when input data changes', () => {
    const newData: GraphData = {
      graphPercentage: {
        acceptedPercent: 50,
        declinedPercent: 25,
        notRespondedPercent: 25
      }
    };
    
    component.data = newData;
    component.ngOnInit();
    
    expect(component.data2[0].Count).toBe(50);
    expect(component.data2[1].Count).toBe(25);
    expect(component.data2[2].Count).toBe(25);
  });

  it('should handle undefined input data gracefully', () => {
    component.data = undefined;
    component.ngOnInit();
    
    expect(component.data2).toBeDefined();
    expect(component.data2[0].Count).toBe(0);
    expect(component.data2[1].Count).toBe(0);
    expect(component.data2[2].Count).toBe(0);
  });

  it('should handle null percentages in input data', () => {
    const nullData: GraphData = {
      graphPercentage: {
        acceptedPercent: null,
        declinedPercent: null,
        notRespondedPercent: null
      }
    };
    
    component.data = nullData;
    component.ngOnInit();
    
    expect(component.data2[0].Count).toBe(0);
    expect(component.data2[1].Count).toBe(0);
    expect(component.data2[2].Count).toBe(0);
  });

  it('should return null for getDataForLabel with invalid label', () => {
    const result = component.getDataForLabel('Invalid Label');
    expect(result).toBeNull();
  });
}); 