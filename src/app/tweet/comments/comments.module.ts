import {NgModule} from '@angular/core';
import {CommentsPage} from './comments.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        CommentsPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    entryComponents: [
        CommentsPage
    ]
})
export class CommentsModule {
}
