import {Pipe, PipeTransform} from '@angular/core';
import {FromNowPipe} from './from-now.pipe';

@Pipe({
    name: 'lastMessageTime',
})
export class LastMessageTimePipe implements PipeTransform {

    transform(messages) {
        const last = messages[messages.length - 1];
        return new FromNowPipe().transform(last.sentAt);
    }
}
