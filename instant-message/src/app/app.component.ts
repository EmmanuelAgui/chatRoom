import { Message } from './models/message.model';
import { UserModel } from './models/user.model';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDropdownContextComponent, NzDropdownService, NzMenuItemDirective } from 'ng-zorro-antd';
import { SocketService } from './socket.service';
import { SystemInfoModel } from './models/system-info.model';
import { SystemInfoType } from './models/system-info.types';
import { MessageType } from './models/message.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: UserModel;
  selectedMessage: Message;
  allEvents = [];
  messageForm: FormGroup;
  images = [
    '../../../assets/images/EmmanuelAgui.jpg',
    '../../../assets/images/lucy.jpg',
    '../../../assets/images/比殺人還冷血.jpg',
    '../../../assets/images/曾经我相信.png',
    '../../../assets/images/老人家不能久站.png',
    '../../../assets/images/某程序员.jpg',
    '../../../assets/images/你有著多少溫柔，才能從不輕言傷心.jpg',
    '../../../assets/images/如果我的人生是.png',
    '../../../assets/images/朝好的方向发展.jpg',
    '../../../assets/images/真的猝死了.jpg',
  ];

  msgConnection: any;
  userConnection: any;
  userWithdraw: any;
  userLeft: any;
  private dropdown: NzDropdownContextComponent;

  constructor(
    private socketService: SocketService,
    private fb: FormBuilder,
    private nzDropdownService: NzDropdownService
  ) { }

  /* 初始化 */
  ngOnInit(): void {
    this.initIoConnection();
    this.initMessageForm();
    //  刷新标签页用户离开
    window.onbeforeunload = this.leavingRoom;
  }

  initIoConnection(): void {
    this.socketService.initSocket();

    this.msgConnection = this.socketService.onMessage()
      .subscribe((res) => {
        if (this.user) {
          this.allEvents.push(res);
          this.scrollToBottom();
        }
      });

    this.userConnection = this.socketService.onNewUser()
      .subscribe((user: UserModel) => {
        this.handleSystemInfo(user, SystemInfoType.NEW_USER);
      });

    this.userWithdraw = this.socketService.onUserWithdraw()
      .subscribe((message: Message) => {
        this.handleSystemInfo(message.user, SystemInfoType.WITHDRAW);
        const isCurrentUser = this.isCurrentUser(message.user);
        if (!isCurrentUser) {
          this.allEvents = this.allEvents.filter(item => item.messageId !== message.messageId);
        }
      });

    this.userLeft = this.socketService.onUserLeft()
      .subscribe((user: UserModel) => {
        const isCurrentUser = this.isCurrentUser(user);
        if (!isCurrentUser) {
          this.addSystemInfo(user, SystemInfoType.USER_LEFT, false);
        }
      });
    this.socketService.onEvent('connected')
      .subscribe(() => console.log('connected'));

    this.socketService.onEvent('disconnected')
      .subscribe(() => console.log('disconnected'));
  }

  handleSystemInfo = (user: UserModel, infoType: SystemInfoType) => {
    // check if new user is the current user, if so, skip notifying user
    const isCurrentUser = this.isCurrentUser(user);
    if (this.user && !isCurrentUser) {
      this.addSystemInfo(user, infoType, false);
    } else if (isCurrentUser) {
      this.addSystemInfo(user, infoType, true);
    }
  }

  addSystemInfo(user: UserModel, infoType: SystemInfoType, isCurrentUser: boolean) {
    const newSystemInfo = new SystemInfoModel(user, infoType, isCurrentUser);
    this.allEvents.push(newSystemInfo);
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const msgContainer = document.getElementById('message-container');
    const shouldScroll = msgContainer.scrollTop + msgContainer.clientHeight === msgContainer.scrollHeight;
    if (shouldScroll) {
      msgContainer.scrollTop = msgContainer.scrollHeight - msgContainer.clientHeight;
    }
  }

  isCurrentUser = (user: UserModel) => {
    return (this.user && user.id === this.user.id);
  }

  initMessageForm(): void {
    this.messageForm = this.fb.group({
      msg: [null, Validators.required]
    });
  }

  /* 右键菜单 */
  contextMenu($event: MouseEvent, template: TemplateRef<void>, message: Message): void {
    this.selectedMessage = message;
    this.dropdown = this.nzDropdownService.create($event, template);
  }

  withdraw(): void {
    this.allEvents = this.allEvents.filter(item => item.messageId !== this.selectedMessage.messageId);
    this.dropdown.close();
    this.socketService.sendWithdraw(this.selectedMessage);
  }

  onSubmit(form: FormGroup): void {
    const msg = form.controls['msg'].value.trim();
    let newMsg;
    switch (msg) {
      case '图片':
        const randId = Math.floor(Math.random() * 10);
        const url = this.images[randId];
        newMsg = new Message(this.user, url, MessageType.IMG);
        break;
      default:
        newMsg = new Message(this.user, msg, MessageType.TEXT);
    }
    this.socketService.sendMessage(newMsg);
    this.messageForm.reset();
  }

  trackByIndex(index) {
    return index;
  }

  loginUser(user: UserModel) {
    this.user = user;
  }

  leavingRoom = () => {
    const newMsg = new Message(this.user, '我先撤啦，后会有期', MessageType.TEXT);
    this.socketService.sendMessage(newMsg);
    this.socketService.sendUserLeaving(this.user);
  }

}
