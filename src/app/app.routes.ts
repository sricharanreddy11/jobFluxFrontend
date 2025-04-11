import { Routes } from '@angular/router';
import { routes as authRoutes } from './authenticator/authenticator.routes';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthenticatorComponent } from './authenticator/authenticator.component';
import { AuthGuard } from './authenticator/authenticator.guard';
import { AppGuard } from './app.guard';
import { FluxComponent } from './flux/flux.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'flux',
        pathMatch: "full"
    },
    {
        path: 'auth',
        component: AuthenticatorComponent,
        children: authRoutes,
        canActivate: [AuthGuard]
    },
    {
        path: 'flux',
        component: FluxComponent,
        // children: ,
        canActivate: [AppGuard]
    },
    { 
        path: '**', 
        component: PageNotFoundComponent
    }
];
