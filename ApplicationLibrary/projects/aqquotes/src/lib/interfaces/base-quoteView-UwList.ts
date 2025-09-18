

    export interface UnderwriterList {
        userType: string;
        id: number;
        name: string;
    }

    export interface IQuotesViewUwList {
        underwriterList: UnderwriterList[];
    }

    export interface IQuotesViewUwListresp {
        data: IQuotesViewUwList;
        success: boolean;
        message?: any;
    }



