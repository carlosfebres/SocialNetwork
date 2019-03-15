import {NgModule} from '@angular/core';
import {HomePage} from './home';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';


@NgModule({
    declarations: [
        HomePage
    ],
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class HomeModule {
}
