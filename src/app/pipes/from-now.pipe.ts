import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'fromNow',
})
export class FromNowPipe implements PipeTransform {

    transform(value: string, ...args) {
        const published = this._toMinutes(new Date(value).getTime());
        const now = this._toMinutes(new Date().getTime());
        let difference = now - published; // Minutes
        difference = difference === 0 ? 1 : difference;
        if (difference >= 60) {
            difference = Math.floor(difference / 60);
            if (difference >= 24) {
                difference = Math.floor(difference / 24);
                return difference + ' days';
            }
            return difference + 'h';

        }
        return difference + 'min';
    }

    private _toMinutes(time) {
        return Math.floor(time / (1000 * 60));
    }
}
