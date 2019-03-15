import {Component, Input} from '@angular/core';
import {HelperService} from '../../services/helper.service';

@Component({
    selector: 'user-item',
    templateUrl: 'user-item.component.html',
    styleUrls: ['user-item.component.scss']
})
export class UserItemComponent {

    @Input() user: any;
    @Input() background = false;

    constructor(public helper: HelperService) {
    }
}
