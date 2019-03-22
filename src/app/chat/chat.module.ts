import {NgModule} from '@angular/core';
import {ChatPage} from './chat.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ChatRoutingModule} from './chat-routing.module';
import {PipesModule} from '../pipes/pipes.module';
import {UploadPictureModule} from '../upload-picture/upload-picture.module';

@NgModule({
    declarations: [
        ChatPage,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        UploadPictureModule,
        ChatRoutingModule
    ],
})
export class ChatModule {
}
