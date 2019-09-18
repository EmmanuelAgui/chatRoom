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
  userRecall: any;
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

    // 订阅聊天消息流
    this.msgConnection = this.socketService.onMessage()
      .subscribe((res) => {
        if (this.user) {
          this.allEvents.push(res);
          this.scrollToBottom();
        }
      });

    // 订阅新用户加入提示信息流
    this.userConnection = this.socketService.onNewUser()
      .subscribe((user: UserModel) => {
        this.handleSystemInfo(user, SystemInfoType.NEW_USER);
      });

    // 订阅用户撤回提示信息流
    this.userRecall = this.socketService.onUserRecall()
      .subscribe((message: Message) => {
        this.handleSystemInfo(message.user, SystemInfoType.RECALL);
        const isCurrentUser = this.isCurrentUser(message.user);
        if (!isCurrentUser) {
          this.allEvents = this.allEvents.filter(item => item.messageId !== message.messageId);
        }
      });
    // 订阅用户离开提示信息流
    this.userLeft = this.socketService.onUserLeft()
      .subscribe((user: UserModel) => {
        const isCurrentUser = this.isCurrentUser(user);
        if (this.user && !isCurrentUser) {
          this.addSystemInfo(user, SystemInfoType.USER_LEFT, false);
        }
      });
    this.socketService.onEvent('connected')
      .subscribe(() => console.log('connected'));

    this.socketService.onEvent('disconnected')
      .subscribe(() => console.log('disconnected'));
  }

  /* 处理系统信息 */
  handleSystemInfo = (user: UserModel, infoType: SystemInfoType) => {
    // check if new user is the current user, if so, skip notifying user
    const isCurrentUser = this.isCurrentUser(user);
    if (this.user && !isCurrentUser) {
      this.addSystemInfo(user, infoType, false);
    } else if (isCurrentUser) {
      this.addSystemInfo(user, infoType, true);
    }
  }
  /* 添加系统信息 */
  addSystemInfo(user: UserModel, infoType: SystemInfoType, isCurrentUser: boolean) {
    const newSystemInfo = new SystemInfoModel(user, infoType, isCurrentUser);
    this.allEvents.push(newSystemInfo);
    this.scrollToBottom();
  }
  /* 滚动到底部 */
  scrollToBottom = () => {
    const msgContainer = document.getElementById('message-container');
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  /* 是否当前用户 */
  isCurrentUser = (user: UserModel) => {
    return (this.user && user.id === this.user.id);
  }
  /* 聊天输入表单 */
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
  /* 撤回消息 */
  recall(): void {
    this.allEvents = this.allEvents.filter(item => item.messageId !== this.selectedMessage.messageId);
    this.dropdown.close();
    this.socketService.sendRecall(this.selectedMessage);
  }
  /* 提交发送聊天内容 */
  onSubmit(form: FormGroup): void {
    const msg = form.controls['msg'].value;
    const newMsg = new Message(this.user, msg, MessageType.TEXT);
    this.socketService.sendMessage(newMsg);
    this.messageForm.reset();
  }

  sendImg() {
    const randId = Math.floor(Math.random() * 10);
    const url = this.images[randId];
    const newMsg = new Message(this.user, url, MessageType.IMG);
    this.socketService.sendMessage(newMsg);
    return false;
  }

  trackByIndex(index) {
    return index;
  }

  loginUser(user: UserModel) {
    this.user = user;
  }
  /* 用户离开聊天室 */
  leavingRoom = () => {
    // 取消所有订阅
    this.msgConnection.unsubscribe();
    this.userConnection.unsubscribe();
    this.userRecall.unsubscribe();
    this.userLeft.unsubscribe();
    // 发送离开相关信息
    const newMsg = new Message(this.user, '我先撤啦，后会有期', MessageType.TEXT);
    this.socketService.sendMessage(newMsg);
    this.socketService.sendUserLeaving(this.user);
    this.user = undefined;
  }

}
