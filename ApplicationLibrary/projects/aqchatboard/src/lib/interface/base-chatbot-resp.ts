export interface IDatum {
    text: string;
    quickReplies: string[];
}

export interface IChatResponse {
    data: IDatum[];
    success: boolean;
    message: string;
}