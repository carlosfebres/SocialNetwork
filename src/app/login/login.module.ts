import {NgModule} from '@angular/core';
import {LoginPage} from './login';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {SMS} from '@ionic-native/sms/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@NgModule({
    declarations: [
        LoginPage
    ],
    providers: [
        FingerprintAIO,
        SMS,
        AndroidPermissions
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
})
export class LoginModule {
}
