import {NgModule} from '@angular/core';
import {UserListPage} from './user-list.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        UserListPage,
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: UserListPage}])
    ],
})
export class UserListModule {
}
