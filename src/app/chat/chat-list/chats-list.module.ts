import {NgModule} from '@angular/core';
import {ChatsListPage} from './chats-list.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@NgModule({
    declarations: [
        ChatsListPage,
    ],
    imports: [
        CommonModule,
        IonicModule,
    ],
})
export class ChatsListModule {
}
