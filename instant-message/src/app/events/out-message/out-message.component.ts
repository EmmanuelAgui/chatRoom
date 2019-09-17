import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../models/message.model';


@Component({
    selector: 'app-out-message',
    templateUrl: './out-message.component.html',
    styleUrls: ['./out-message.component.scss']
})
export class OutMessageComponent implements OnInit {
    @Input() message: Message;
    @Input() username: string;

    constructor() {}

    ngOnInit() {}
}
