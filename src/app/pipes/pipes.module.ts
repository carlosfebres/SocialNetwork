import {NgModule} from '@angular/core';
import {FromNowPipe} from './from-now.pipe';
import {UrlPipe} from './url.pipe';
import {LastMessagePipe} from './last-message.pipe';
import {LastMessageTimePipe} from './last-message-time.pipe';

@NgModule({
    declarations: [
        FromNowPipe,
        UrlPipe,
        LastMessagePipe,
        LastMessageTimePipe
    ],
    exports: [
        FromNowPipe,
        UrlPipe,
        LastMessagePipe,
        LastMessageTimePipe
    ]
})
export class PipesModule {
}
