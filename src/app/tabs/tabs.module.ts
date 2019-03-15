import {NgModule} from '@angular/core';
import {TabsPage} from './tabs.page';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TabsRoutingModule} from './tabs-routing.module';

@NgModule({
    declarations: [
        TabsPage,
    ],
    imports: [
        CommonModule,
        IonicModule,
        TabsRoutingModule
    ],
})
export class TabsModule {
}
