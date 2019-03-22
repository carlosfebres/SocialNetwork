import {NgModule} from '@angular/core';
import {TabsPage} from './tabs.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TabsRoutingModule} from './tabs-routing.module';

@NgModule({
    declarations: [
        TabsPage,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TabsRoutingModule
    ],
})
export class TabsModule {
}
