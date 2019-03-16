import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: '/home', loadChildren: './home/home.module#HomeModule'},
    {path: '/login', loadChildren: './login/login.module#LoginModule'},
    {path: '/tabs', loadChildren: './tabs/tabs.module#TabsModule'},
    {path: '/tweet/new', loadChildren: './tweet/new-tweet/new-tweet.module#TweetModule'},
    {path: '/tweet/:id/comments', loadChildren: './tweet/comments/comments.module#CommentsModule'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
