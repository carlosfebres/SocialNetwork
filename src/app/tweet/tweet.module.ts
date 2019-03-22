import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TweetComponent} from './tweet.component';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {UserItemModule} from '../user/user-item/user-item.module';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PipesModule} from '../pipes/pipes.module';
import {CommentsModule} from './comments/comments.module';

@NgModule({
    declarations: [
        TweetComponent
    ],
    providers: [
        SocialSharing
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserItemModule,
        CommentsModule,
        PipesModule
    ],
    exports: [
        TweetComponent
    ]
})
export class TweetModule {
}
