export interface IFormCreateRequest {
    UserId: number;
    ClientId:number;
    XmlMapping:string;
    LOB: string;
    State: string;
    QuoteType: string;
    FormId: number;
    EffectiveFrom:string;
    EffectiveTo:string;
    IsActive:boolean;
    ClientID: number;
    FormDefinition:string;
    FileName:string;
}