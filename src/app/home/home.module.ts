import {NgModule} from '@angular/core';
import {HomePage} from './home.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NewTweetModule} from '../tweet/new-tweet/new-tweet.module';

@NgModule({
    declarations: [
        HomePage
    ],
    imports: [
        CommonModule,
        IonicModule,
        NewTweetModule,
        RouterModule.forChild([{path: '', component: HomePage}])
    ]
})
export class HomeModule {
}
