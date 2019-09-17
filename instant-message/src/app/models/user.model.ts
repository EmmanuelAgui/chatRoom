import * as uuid from 'uuid';

export class UserModel {
    username: string;
    id: string;

    constructor(username: string) {
        // const randId = Math.floor(Math.random() * 100);
        this.username = username;
        this.id = uuid.v4();
    }
}
