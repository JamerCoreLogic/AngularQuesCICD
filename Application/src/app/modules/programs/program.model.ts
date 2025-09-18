export interface Program {
    userId: number;
    agencyId: number;
    managerId: number;
    expirationDate: Date;
    effectiveDate: Date;
    progrmaId: number;
    supervisor?: any;
    isActive: boolean;
    discription?: any;
    programName: string;
}
