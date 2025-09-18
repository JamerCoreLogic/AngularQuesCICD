import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class QuotesApi {
    private _quotesListApi = '/AQAPI/api/Policy/GetQuotesList';
    private _quotesFilterApi = '/AQAPI/api/Policy/GetQuotesSearchBased';
    private _quotesViewAPI = '/aqapi/api/Underwriter/GetUnderwriterQuoteDetails';
    private _quotesCountAPi = '/aqapi/api/Policy/GetQuotesCount';
    private _getPolicyDocument = '/aqapi/api/PolicyDocument/GetPolicyDocument';
    private _quotesViewUwListAPI = '/aqapi/api/Underwriter/GetUnderwriterList';
    private _submissionStatusUpdate = '/aqapi/api/Underwriter/SubmissionStatusUpdate';
    private _saveAdvanceFilter = "/AQAPI/api/policy/SaveAdvancedFilter";
    private _getAdvanceFilterList = "/AQAPI/api/policy/GetAdvancedFilterList";
    private _convertQuickQuoteApi = "/AQAPI/api/policy/ConvertToFullQuote";
    private _AQFormsApi = '/AQAPI/api/AQForms/GetAQForm';
    private _AQSavePolicy = "/AQAPI/api/Policy/SavePolicy";
    private _AQGetPolicy = "/AQAPI/api/Policy/GetPolicy";
    private _LOBListApi = '/AQAPI/api/Parameters/GetlobData';
    private _ProceedToBindApi = '/AQAPI/api/Policy/ConvertFullQuoteToPolicyBind';
    private _IssueQuote = '/AQAPI/api/Policy/ConvertPolicyBindToPolicyIssue';
    private __InsuredsProspectsApi = '/AQAPI/api/Insured/GetInsured';
    private _GetInsuredDetail = '/AQAPI/api/Insured/GetInsuredAccount';
    private _addInsuredQuoteApi = '/AQAPI/api/Insured/AddInsuredQuote';
    private _addQuoteFromChatAPI = '/AQAPI/api/Policy/GenerateQuickQuoteByChatbot';//"/AQAPI/api/Policy/AddQQFromChat";
    private _generateFullQuoteByChatbot = '/AQAPI/api/Policy/GenerateFullQuoteByChatbot'
    private _downloadAcordFormAPI = '/aqapi/api/FormControls/DownloadAcord';
    private _getQuoteForms = '/AQAPI/api/PolicyDocument/GetQuoteForms';
    private _getRiskAnalysisForms = '/AQAPI/api/insured/GetRiskAnalysisForms';
    private _uploadAcordForm = '/AQAPI/api/Policy/UploadAcord';
    private _AQCheckPolicy = "/AQAPI/api/Policy/CheckAqXML";
    

    //api/insured/GetRiskAnalysisForms
    /* Get API's functions */


    get getRiskAnalysisForms(){
        return this._getRiskAnalysisForms;
    }

    get getQuoteForms(){
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

    get DownloadAcordFormAPI(){
        return this._downloadAcordFormAPI;
    }

    get uploadAcordApi(){
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
        this._generateFullQuoteByChatbot = value +this._generateFullQuoteByChatbot ;
        this._downloadAcordFormAPI = value + this._downloadAcordFormAPI;
        this._getQuoteForms = value + this._getQuoteForms;
        this._getRiskAnalysisForms = value + this._getRiskAnalysisForms;
        this._AQCheckPolicy=value+this._AQCheckPolicy;
    }
}
