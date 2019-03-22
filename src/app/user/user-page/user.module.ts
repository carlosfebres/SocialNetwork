import {NgModule} from '@angular/core';
import {UserPage} from './user.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TweetModule} from '../../tweet/tweet.module';
import {RouterModule} from '@angular/router';
import {UploadPictureModule} from '../../upload-picture/upload-picture.module';

@NgModule({
    declarations: [
        UserPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TweetModule,
        UploadPictureModule,
        RouterModule.forChild([{path: '', component: UserPage}])
    ],
})
export class UserModule {
}
