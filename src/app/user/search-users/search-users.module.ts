import {NgModule} from '@angular/core';
import {SearchUsersPage} from './search-users.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        SearchUsersPage,
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: SearchUsersPage}])
    ]
})
export class SearchUsersModule {
}
