import { MessageType } from './message.types';
import { EventType } from './event.types';
import { UserModel } from './user.model';
import * as uuid from 'uuid';

export class Message {
  messageId: string;  //  uuid唯一标识message后面可以根据唯一识别符进行撤回等相关操作,其实这部分应该交给后端来做，前端只要定义接口即可
  eventType: EventType.MSG;
  user: UserModel;
  content: string;
  messageType: MessageType;

  constructor(user: UserModel, message: string, type: MessageType) {
    this.messageId = uuid.v4();
    this.eventType = EventType.MSG;
    this.user = user;
    this.content = message;
    this.messageType = MessageType[type];
  }
}
