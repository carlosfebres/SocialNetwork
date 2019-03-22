import {NgModule} from '@angular/core';
import {UserListPage} from './user-list.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {UserItemModule} from '../user-item/user-item.module';

@NgModule({
    declarations: [
        UserListPage,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserItemModule,
        RouterModule.forChild([{path: '', component: UserListPage}])
    ]
})
export class UserListModule {
}
