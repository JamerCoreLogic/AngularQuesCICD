export interface IKpiRes {
    data: IKPIData;
    success: boolean;
    message: string;
}

export interface IKPIData {  
    kpiResponses: IKpiRespons[];
    charts: any;    
}

export interface IKpiRespons {
    performanceMeasureId: number;
    performanceMeasureName: string;
    agentId: number;
    performanceMeasurePeriod: string;
    aqkpi: boolean;
    value: number;
    growth: string;
    growthFlag: string;
}

export interface IChart {
    nbPremiumsChart: INbPremiumsChart[];
    rnPremiumsChart: IRnPremiumsChart[];
}

export interface INbPremiumsChart {
    month: string;
    value: number;
    chartName: string;
    chartType: string;
}

export interface IRnPremiumsChart {
    month: string;
    value: number;
    chartName: string;
    chartType: string;
}

export interface Chart {
    nbPremiumsChart: INbPremiumsChart[];
    rnPremiumsChart: IRnPremiumsChart[];
}

