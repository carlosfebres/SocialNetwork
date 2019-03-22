import {NgModule} from '@angular/core';
import {NewTweetPage} from './new-tweet.home';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@NgModule({
    declarations: [
        NewTweetPage,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    entryComponents: [
        NewTweetPage
    ]
})
export class NewTweetModule {
}
