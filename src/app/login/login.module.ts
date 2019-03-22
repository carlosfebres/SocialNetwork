import {NgModule} from '@angular/core';
import {LoginPage} from './login.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {ConfigPageModule} from '../config/config.module';

@NgModule({
    declarations: [
        LoginPage
    ],
    providers: [],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ConfigPageModule,
        RouterModule.forChild([{path: '', component: LoginPage}])
    ],
})
export class LoginModule {
}
