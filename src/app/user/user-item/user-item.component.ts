import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HelperService} from '../../services/helper.service';

@Component({
    selector: 'user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent {

    @Input() user: any;
    @Input() showNumber = false;

    constructor(public helper: HelperService) {
    }
}
