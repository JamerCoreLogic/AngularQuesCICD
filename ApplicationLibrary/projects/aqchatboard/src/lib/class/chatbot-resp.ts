import { IChatResponse } from '../interface/base-chatbot-resp';

export class ChatBotResp implements IChatResponse {
    data;
    message;
    success;    

    constructor(resp:IChatResponse){
        this.data = resp.data;
        this.message = resp.message;
        this.success = resp.success;
    }

}