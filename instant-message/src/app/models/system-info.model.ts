import { EventType } from './event.types';
import { UserModel } from './user.model';
import { SystemInfoType } from './system-info.types';

export class SystemInfoModel {
  eventType: EventType.SYSTEM_INFO;
  user: UserModel;
  infoType: SystemInfoType;
  info: string;
  constructor(user: UserModel, infoType: SystemInfoType, isCurrentUser: boolean) {
    this.eventType = EventType.SYSTEM_INFO;
    this.user = user;
    this.infoType = SystemInfoType[infoType];
    switch (infoType) {
      case SystemInfoType.NEW_USER:
        this.info = isCurrentUser ? ' welcome to the chat room!' : 'has joined the chat';
        break;
      case SystemInfoType.USER_LEFT:
        this.info = 'has left the chat';
        break;
      case SystemInfoType.WITHDRAW:
        this.info = isCurrentUser ? ' You recalled a message' : 'has recalled a message';
    }
  }
}
