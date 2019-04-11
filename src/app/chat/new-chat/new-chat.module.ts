import {NgModule} from '@angular/core';
import {NewChatPage} from './new-chat.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {UserItemModule} from '../../user/user-item/user-item.module';
import {NotLoggedUserPipe} from './not-logged-user.pipe';
import {Contacts} from '@ionic-native/contacts/ngx';
import {ContactComponent} from './contact/contact.component';

@NgModule({
    declarations: [NewChatPage, NotLoggedUserPipe, ContactComponent],
    entryComponents: [NewChatPage],
    providers: [Contacts],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserItemModule
    ],
})
export class NewChatModule {
}
