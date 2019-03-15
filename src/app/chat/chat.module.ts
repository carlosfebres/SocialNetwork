import {NgModule} from '@angular/core';
import {ChatPage} from './chat.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ChatRoutingModule} from './chat-routing.module';

@NgModule({
    declarations: [
        ChatPage,
    ],
    imports: [
        CommonModule,
        IonicModule,
        ChatRoutingModule
    ],
})
export class ChatModule {
}
