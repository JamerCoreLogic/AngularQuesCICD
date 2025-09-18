

    export interface Button {
        title: string;
        payload: string;
    }

    export interface IWebHookChatResponse {
        recipient_id: string;
        text: string;
        buttons: Button[];
    }



