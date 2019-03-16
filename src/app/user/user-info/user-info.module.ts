import {NgModule} from '@angular/core';
import {UserInfoPage} from './user-info';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        UserInfoPage,
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: UserInfoPage}])
    ],
})
export class UserInfoModule {
}
