import {NgModule} from '@angular/core';
import {ChatsListPage} from './chats-list.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {PipesModule} from '../../pipes/pipes.module';
import {NewChatModule} from '../new-chat/new-chat.module';

@NgModule({
    declarations: [
        ChatsListPage,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        NewChatModule,
        RouterModule.forChild([{path: '', component: ChatsListPage}])
    ],
})
export class ChatsListModule {
}
