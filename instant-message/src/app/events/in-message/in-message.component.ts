import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-in-message',
  templateUrl: './in-message.component.html',
  styleUrls: ['./in-message.component.scss']
})
export class InMessageComponent implements OnInit {
  @Input() message: Message;
  @Input() username: string;

  constructor() { }

  ngOnInit() {
  }
}
