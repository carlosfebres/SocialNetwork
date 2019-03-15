import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'dashboard',
                outlet: 'dashboard-tab',
                loadChildren: './home/home.module#HomeModule'
            },
            {
                path: 'profile',
                outlet: 'profile-tab',
                loadChildren: './user/user.module#UserModule'
            },
            {
                path: 'user/search',
                outlet: 'search-tab',
                loadChildren: './user/search-users/search-users.module#SearchUsersModule'
            },
            {
                path: 'chats',
                outlet: 'chats-tab',
                loadChildren: './chat/chat-list/chat-list.module#ChatsListModule'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/(dashboard-tab:dashboard)'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsRoutingModule {
}
