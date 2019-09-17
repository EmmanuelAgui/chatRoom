import { Injectable } from '@angular/core';
import * as socket from 'socket.io-client';

import { Observable } from 'rxjs';
import { UserModel } from './models/user.model';
import { Message } from './models/message.model';

@Injectable()
export class SocketService {
  socket;

  /* 初始连接 */
  initSocket() {
    this.socket = socket('localhost:8383');
  }

  /* 当前用户注册加入聊天室 */
  sendUser(user: UserModel) {
    this.socket.emit('CLIENT_USER', user);
  }

  /* 发送聊天消息 */
  sendMessage(msg) {
    this.socket.emit('OUTGOING_MSG', msg);
  }

  /* 撤回消息 */
  sendWithdraw(message: Message) {
    this.socket.emit('WITHDRAW_MSG', message);
  }

  /* 当前用户离开聊天室 */
  sendUserLeaving(user: UserModel) {
    this.socket.emit('USER_LEAVING', user);
  }

  /* 接收系统消息：新用户加入 */
  onNewUser() {
    return new Observable<any>(observer => {
      this.socket.on('NEW_USER', user => observer.next(user));
    });
  }

  /* 接收系统消息：用户离开 */
  onUserLeft() {
    return new Observable<any>(observer => {
      this.socket.on('USER_LEFT', user => observer.next(user));
    });
  }

  /* 接收系统消息：用户撤回消息 */
  onUserWithdraw() {
    return new Observable<any>(observer => {
      this.socket.on('WITHDRAW_MSG', message => observer.next(message));
    });
  }

  /* 接收聊天信息 */
  onMessage() {
    return new Observable<any>(observer => {
      this.socket.on('INCOMING_MSG', (res) => observer.next(res));
    });
  }

  /* 其他事件信息 */
  onEvent(event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
