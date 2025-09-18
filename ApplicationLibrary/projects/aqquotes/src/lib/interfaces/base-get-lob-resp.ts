export interface ILOBGetResponse {
    data: AQLOBList;
    success: boolean;
    message: string
}

export interface AQLOBList{
    lobsList:AQLOBData[]
}

export interface AQLOBData {
    lobId: number;
    lob: string;
    lobCode: string;
    isActive: boolean;
    lobDescription: string;    
}





