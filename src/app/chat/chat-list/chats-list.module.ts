import {NgModule} from '@angular/core';
import {ChatsListPage} from './chats-list.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        ChatsListPage,
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: ChatsListPage}])
    ],
})
export class ChatsListModule {
}
