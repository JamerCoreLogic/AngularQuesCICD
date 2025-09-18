import { IKpiRes, IKPIData, IKpiRespons, IChart } from '../../interface/base-kpi-res';

export class kpiresponse implements IKpiRes {
    message: string;
    success: boolean;
    data: IKPIData = {
        kpiResponses: [],
        charts: []
    };


    constructor(resp: IKpiRes) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.kpiResponses = this.asssignkpilist(resp.data.kpiResponses);
        this.data.charts = null;
    }

    private asssignkpilist(kpiList: IKpiRespons[]) {
        let _kpiList: any = kpiList.map((respItem: IKpiRespons) => {
            let _kpiList: IKpiRespons = {
                aqkpi: respItem.aqkpi,
                performanceMeasureId: respItem.performanceMeasureId,
                performanceMeasureName: respItem.performanceMeasureName,
                agentId: respItem.agentId,
                performanceMeasurePeriod: respItem.performanceMeasurePeriod,
                value: respItem.value,
                growth: respItem.growth,
                growthFlag: respItem.growthFlag
            }
            return _kpiList;
        })
        return _kpiList;
    }

    private assignCharts(charts: IChart[]) {
        let _charts: any = charts.map((respItem: IChart) => {
            let _charts: IChart = {
                nbPremiumsChart: respItem.nbPremiumsChart,
                rnPremiumsChart: respItem.rnPremiumsChart
            }
            return _charts;
        })
        return charts;
    }

}



