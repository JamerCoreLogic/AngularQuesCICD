import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class QuotesApi {
    private _quotesListApi = '/api/Policy/GetQuotesList';
    private _quotesFilterApi = '/api/Policy/GetQuotesSearchBased';
    private _quotesViewAPI = '/api/Underwriter/GetUnderwriterQuoteDetails';     //'/aqapi/api/Underwriter/GetUnderwriterQuoteDetails'
    private _quotesCountAPi = '/api/Policy/GetQuotesCount';                      //'/aqapi/api/Policy/GetQuotesCount'
    private _getPolicyDocument = '/api/PolicyDocument/GetPolicyDocument';       //'/aqapi/api/PolicyDocument/GetPolicyDocument'
    private _quotesViewUwListAPI = '/api/Underwriter/GetUnderwriterList';        //'/aqapi/api/Underwriter/GetUnderwriterList'
    private _submissionStatusUpdate = '/api/Underwriter/SubmissionStatusUpdate'; //'/aqapi/api/Underwriter/SubmissionStatusUpdate'
    private _saveAdvanceFilter = "/api/policy/SaveAdvancedFilter";
    private _getAdvanceFilterList = "/api/policy/GetAdvancedFilterList";
    private _convertQuickQuoteApi = "/api/policy/ConvertToFullQuote";
    private _AQFormsApi = '/api/AQForms/GetAQForm';
    private _AQSavePolicy = "/api/Policy/SavePolicy";
    private _AQGetPolicy = "/api/Policy/GetPolicy";
    private _LOBListApi = '/api/Parameters/GetlobData';
    private _ProceedToBindApi = '/api/Policy/ConvertFullQuoteToPolicyBind';
    private _IssueQuote = '/api/Policy/ConvertPolicyBindToPolicyIssue';
    private __InsuredsProspectsApi = '/api/Insured/GetInsured';
    private _GetInsuredDetail = '/api/Insured/GetInsuredAccount';
    private _addInsuredQuoteApi = '/api/Insured/AddInsuredQuote';
    private _addQuoteFromChatAPI = '/api/Policy/GenerateQuickQuoteByChatbot';//"/api/Policy/AddQQFromChat";
    private _generateFullQuoteByChatbot = '/api/Policy/GenerateFullQuoteByChatbot'
    private _downloadAcordFormAPI = '/api/FormControls/DownloadAcord';
    private _getQuoteForms = '/api/PolicyDocument/GetQuoteForms';
    private _getRiskAnalysisForms = '/api/insured/GetRiskAnalysisForms';
    private _uploadAcordForm = '/api/Policy/UploadAcord';
    private _AQCheckPolicy = "/api/Policy/CheckAqXML";


    //api/insured/GetRiskAnalysisForms
    /* Get API's functions */


    get getRiskAnalysisForms() {
        return this._getRiskAnalysisForms;
    }

    get getQuoteForms() {
        return this._getQuoteForms;
    }

    get generateFullQuoteByChatbot() {
        return this._generateFullQuoteByChatbot;
    }
    get quotesListApi() {
        return this._quotesListApi;
    }
    get submissionStatusUpdate() {
        return this._submissionStatusUpdate;
    }
    get getPolicyDocument() {
        return this._getPolicyDocument;
    }

    get quotesFilerAPI() {
        return this._quotesFilterApi;
    }
    get quotesViewAPI() {
        return this._quotesViewAPI;
    }
    get quotesViewUwListAPI() {
        return this._quotesViewUwListAPI;
    }


    get saveFiltersAPI() {
        return this._saveAdvanceFilter;
    }

    get getFiltersAPI() {
        return this._getAdvanceFilterList;
    }

    get getConvertQuickQuoteAPI() {
        return this._convertQuickQuoteApi;
    }

    get AQFormsAPI() {
        return this._AQFormsApi;
    }

    get AQSavePolicyAPI() {
        return this._AQSavePolicy;
    }
    get AQGetPolicyAPI() {
        return this._AQGetPolicy;
    }

    get LOBListApi() {
        return this._LOBListApi;
    }

    get ProceedToBindAPI() {
        return this._ProceedToBindApi;
    }

    get IssueQuoteAPI() {
        return this._IssueQuote;
    }

    get InsuredsProspectsApi() {
        return this.__InsuredsProspectsApi;
    }

    get GetInsuredDetail() {
        return this._GetInsuredDetail;
    }

    get AddInsuredquote() {
        return this._addInsuredQuoteApi;
    }

    get QuotesCountApi() {
        return this._quotesCountAPi;
    }

    get AddQuoteFromChatAPI() {
        return this._addQuoteFromChatAPI;
    }

    get DownloadAcordFormAPI() {
        return this._downloadAcordFormAPI;
    }

    get uploadAcordApi() {
        return this._uploadAcordForm
    }
    get AQCheckAqXMLAPI() {
        return this._AQCheckPolicy;
    }

    set QuotesApiEndPoint(value) {
        this._quotesListApi = value + this._quotesListApi;
        this._quotesFilterApi = value + this._quotesFilterApi;
        this._saveAdvanceFilter = value + this._saveAdvanceFilter;
        this._getAdvanceFilterList = value + this._getAdvanceFilterList;
        this._convertQuickQuoteApi = value + this._convertQuickQuoteApi;
        this._AQFormsApi = value + this._AQFormsApi;
        this._AQSavePolicy = value + this._AQSavePolicy;
        this._AQGetPolicy = value + this._AQGetPolicy;
        this._LOBListApi = value + this._LOBListApi;
        this._ProceedToBindApi = value + this._ProceedToBindApi;
        this._IssueQuote = value + this._IssueQuote;
        this.__InsuredsProspectsApi = value + this.__InsuredsProspectsApi;
        this._GetInsuredDetail = value + this._GetInsuredDetail;
        this._uploadAcordForm = value + this._uploadAcordForm;
        this._quotesViewUwListAPI = value + this._quotesViewUwListAPI;
        this._quotesViewAPI = value + this._quotesViewAPI;
        this._getPolicyDocument = value + this._getPolicyDocument;
        this._submissionStatusUpdate = value + this._submissionStatusUpdate;
        this._addInsuredQuoteApi = value + this._addInsuredQuoteApi;
        this._quotesCountAPi = value + this._quotesCountAPi;
        this._addQuoteFromChatAPI = value + this._addQuoteFromChatAPI;
        this._generateFullQuoteByChatbot = value + this._generateFullQuoteByChatbot;
        this._downloadAcordFormAPI = value + this._downloadAcordFormAPI;
        this._getQuoteForms = value + this._getQuoteForms;
        this._getRiskAnalysisForms = value + this._getRiskAnalysisForms;
        this._AQCheckPolicy = value + this._AQCheckPolicy;
    }
}
