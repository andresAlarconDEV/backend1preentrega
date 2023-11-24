import MessageModel from '../models/message.model.js';

export default class MessagesManager {

    static get() {
        return MessageModel.find();
    };   

    static async addMessage(newMessage) {
                const MessageCreate = await MessageModel.create(newMessage);
                return MessageCreate;
    }
}