import {NgModule} from '@angular/core';
import {UserPage} from './user';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {UserItemComponent} from './user-item/user-item.component';

@NgModule({
    declarations: [
        UserPage,
        UserItemComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
})
export class UserModule {
}
