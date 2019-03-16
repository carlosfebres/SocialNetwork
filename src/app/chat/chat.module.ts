import {NgModule} from '@angular/core';
import {ChatPage} from './chat.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ChatRoutingModule} from './chat-routing.module';
import {NewTweetModule} from '../tweet/new-tweet/new-tweet.module';
import {NewTweetPage} from '../tweet/new-tweet/new-tweet.home';

@NgModule({
    declarations: [
        ChatPage,
    ],
    entryComponents: [
        NewTweetPage
    ],
    imports: [
        CommonModule,
        IonicModule,
        NewTweetModule,
        ChatRoutingModule
    ],
})
export class ChatModule {
}
