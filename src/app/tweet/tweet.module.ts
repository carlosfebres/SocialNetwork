import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TweetComponent} from './tweet.component';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

@NgModule({
    declarations: [
        TweetComponent
    ],
    providers: [
        SocialSharing
    ],
    imports: [
        CommonModule
    ]
})
export class TweetModule {
}
