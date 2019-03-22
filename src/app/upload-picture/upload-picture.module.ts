import {NgModule} from '@angular/core';
import {UploadPicturePage} from './upload-picture-page.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@NgModule({
    declarations: [
        UploadPicturePage,
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule
    ],
    entryComponents: [
        UploadPicturePage
    ]
})
export class UploadPictureModule {
}
