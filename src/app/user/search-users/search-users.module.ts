import {NgModule} from '@angular/core';
import {SearchUsersPage} from './search-users.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {UserItemModule} from '../user-item/user-item.module';

@NgModule({
    declarations: [
        SearchUsersPage,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserItemModule,
        RouterModule.forChild([{path: '', component: SearchUsersPage}])
    ]
})
export class SearchUsersModule {
}
