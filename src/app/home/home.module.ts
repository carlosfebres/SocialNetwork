import {NgModule} from '@angular/core';
import {HomePage} from './home.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {TweetModule} from '../tweet/tweet.module';
import {NewTweetModule} from '../tweet/new-tweet/new-tweet.module';

@NgModule({
    declarations: [
        HomePage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TweetModule,
        NewTweetModule,
        RouterModule.forChild([{path: '', component: HomePage}])
    ]
})
export class HomeModule {
}
