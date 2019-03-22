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
                children: [
                    {path: '', loadChildren: '../home/home.module#HomeModule'}
                ]
            },
            {
                path: 'profile',
                children: [
                    {path: '', loadChildren: '../user/user-page/user.module#UserModule'},
                    {path: 'edit', loadChildren: '../user/user-info/user-info.module#UserInfoModule'}
                ]
            },
            {
                path: 'search',
                children: [
                    {path: '', loadChildren: '../user/search-users/search-users.module#SearchUsersModule'}
                ]
            },
            {
                path: 'chat',
                children: [
                    {path: '', loadChildren: '../chat/chat.module#ChatModule'}
                ]
            }, {
                path: 'user',
                loadChildren: '../user/user-routing.module#UserRoutingModule'
            },

            {
                path: '',
                redirectTo: 'tabs/dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tabs/dashboard'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsRoutingModule {
}
