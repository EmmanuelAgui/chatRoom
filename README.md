# Instant Messages Chat Room
#### Live data with Socket.io / Node.js / Angular | An instant messaging app that supports multiple clients

## Slides

## Install
1. `$ cd chatRoom/instant-messages`
2. `$ npm install`
3. `$ cd chatRoom/server`
4. `$ npm install`

## Run
1. `$ cd chatRoom/instant-messages`
2. `$ ng serve`
3. *new terminal*
4. `$ cd chatRoom/server/src`
5. `$ node index.js`

## Access
   + Client runs on `localhost:4200`
   + Server runs on `localhost: 8383`


## Use
1.  输入用户名回车即注册登录聊天室（会有系统欢迎信息，其他客户端会有系统提示信息 ××× has joined the chat）
2.  输入文字信息按发送按钮即发送
3.  点击图片按钮，即随机出现一张图片
4.  pc端在自己发送的消息右键，撤回，即可撤回信息，并有系统提示
5.  刷新客户端页面，其他客户端页面会收到当前用户告辞信息："我先撤啦，后会有期"，以及系统提示信息 xxx left the chat room
