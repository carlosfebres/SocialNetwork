import {Pipe, PipeTransform} from '@angular/core';
import {HelperService} from '../services/helper.service';

@Pipe({
    name: 'url',
})
export class UrlPipe implements PipeTransform {

    constructor(public helper: HelperService) {
    }

    transform(value: string) {
        return this.helper.getUrl(value);
    }
}
