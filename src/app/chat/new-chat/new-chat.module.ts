import {NgModule} from '@angular/core';
import {NewChatPage} from './new-chat.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {UserItemModule} from '../../user/user-item/user-item.module';

@NgModule({
    declarations: [NewChatPage],
    entryComponents: [NewChatPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserItemModule
    ],
})
export class NewChatModule {
}
