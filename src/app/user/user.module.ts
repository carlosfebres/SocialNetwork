import {NgModule} from '@angular/core';
import {UserPage} from './user.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {UserItemComponent} from './user-item/user-item.component';
import {UserRoutingModule} from './user-routing.module';

@NgModule({
    declarations: [
        UserPage,
        UserItemComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        UserRoutingModule
    ],
})
export class UserModule {
}
