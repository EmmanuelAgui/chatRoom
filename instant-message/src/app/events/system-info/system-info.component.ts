import { Component, OnInit, Input } from '@angular/core';
import { SystemInfoModel } from '../../models/system-info.model';

@Component({
    selector: 'app-system-info',
    templateUrl: './system-info.component.html',
    styleUrls: ['./system-info.component.scss']
})
export class SystemInfoComponent implements OnInit {
    @Input() systemInfo: SystemInfoModel;

    constructor() {}

    ngOnInit() {}
}
