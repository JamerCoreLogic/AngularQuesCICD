export interface ISaveAdvanceFilterReq {
    AdvancedFilterId: number;
    UserId: number;
    FilterName: string;
    FilterParticulars: string,
    IsDefault: Boolean;
    Parameters: string;
    FilterType: string,
    AgentID: number
}