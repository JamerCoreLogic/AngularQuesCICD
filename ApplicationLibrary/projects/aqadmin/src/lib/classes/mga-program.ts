import { IMgaProgramList } from '../interfaces/base-mga-programs-resp';

export class MGAProgram  {

    programsLobId: number;
    lobId: number;
    lob: string;
    programId: number;
    programName: string;
    state: string;
    isActive: boolean;
    createdOn: Date;
    createdBy?: any;
    modifiedOn?: any;
    modifiedBy?: any;
    lobName: string;    
    lobCode?: any;  
    stateId: number;
    stateCode: string;

    constructor() {
      
    }
}