import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'home', component: './home/home.module#HomeModule'},
    {path: 'login', loadChildren: './login/login.module#LoginModule'},
    {path: 'tabs', loadChildren: './tabs/tabs.module#TabsModule'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
