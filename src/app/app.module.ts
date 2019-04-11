import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {IonicStorageModule} from '@ionic/storage';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {PipesModule} from './pipes/pipes.module';
import {HttpClientModule} from '@angular/common/http';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {SMS} from '@ionic-native/sms/ngx';
import {AndroidFingerprintAuth} from '@ionic-native/android-fingerprint-auth/ngx';
import {SocketIoModule} from 'ngx-socket-io';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        PipesModule,
        HttpClientModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        SocketIoModule,
        AppRoutingModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        AndroidFingerprintAuth,
        SMS,
        AndroidPermissions,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
