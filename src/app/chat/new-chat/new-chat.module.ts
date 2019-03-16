import {NgModule} from '@angular/core';
import {NewChatPage} from './new-chat.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        NewChatPage
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: NewChatPage}])
    ],
})
export class NewChatModule {
}
