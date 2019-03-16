import {NgModule} from '@angular/core';
import {CommentsPage} from './comments.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        CommentsPage
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: CommentsPage}])
    ]
})
export class CommentsModule {
}
