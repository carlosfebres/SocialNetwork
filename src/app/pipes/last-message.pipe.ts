import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'lastMessage',
})
export class LastMessagePipe implements PipeTransform {

    transform(messages) {
        const last = messages[messages.length - 1];
        if (last.type === 'image') {
            return 'Image...';
        } else {
            return last.message;
        }
    }
}
