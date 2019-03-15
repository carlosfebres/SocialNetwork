import {NgModule} from '@angular/core';
import {FromNowPipe} from './from-now.pipe';
import {UrlPipe} from './url';
import {ServicesModule} from '../services/services.module';
import {LastMessagePipe} from './last-message.pipe';
import {LastMessageTimePipe} from './last-message-time.pipe';

@NgModule({
    declarations: [
        FromNowPipe,
        UrlPipe,
        LastMessagePipe,
        LastMessageTimePipe
    ],
    imports: [ServicesModule],
    exports: [
        FromNowPipe,
        UrlPipe,
        LastMessagePipe,
        LastMessageTimePipe
    ]
})
export class PipesModulePipe {
}
