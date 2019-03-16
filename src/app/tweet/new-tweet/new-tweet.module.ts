import {NgModule} from '@angular/core';
import {NewTweetPage} from './new-tweet.home';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        NewTweetPage,
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: NewTweetPage}])
    ],
    exports: [
        NewTweetPage
    ]
})
export class NewTweetModule {
}
