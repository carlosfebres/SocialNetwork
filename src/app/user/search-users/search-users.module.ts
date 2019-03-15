import {NgModule} from '@angular/core';
import {SearchUsersPage} from './search-users';

@NgModule({
    declarations: [
        SearchUsersPage,
    ],
    imports: [
        UserPageModule,
        ComponentsModule,
        IonicPageModule.forChild(SearchUsersPage),
    ]
})
export class SearchUsersModule {
}
