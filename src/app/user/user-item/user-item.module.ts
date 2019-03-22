import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserItemComponent} from './user-item.component';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

@NgModule({
    declarations: [
        UserItemComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
        UserItemComponent
    ]
})
export class UserItemModule {
}
