import MessageModel from '../models/message.model.js';

export default class MessagesManager {

    static get() {
        return MessageModel.find();
    };   
}