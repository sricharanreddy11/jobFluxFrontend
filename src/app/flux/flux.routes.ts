import { Routes } from '@angular/router';
import { NoteMakerComponent } from './note-maker/note-maker.component';
import { OutreachComponent } from './outreach/outreach.component';
import {routes as outreachRoutes} from './outreach/outreach.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrganisationsComponent } from './organisations/organisations.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ConnectionsComponent } from './connections/connections.component';
import { EnhanceCvComponent } from './enhance-cv/enhance-cv.component';
import { ConnectionDetailComponent } from './connections/connection-detail/connection-detail.component';
import { ConnectionListComponent } from './connections/connection-list/connection-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: "full"
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'organisations',
        component: OrganisationsComponent,
    },
    {
        path: 'applications',
        component: ApplicationsComponent,
    },
    { 
        path: 'connections',
        component: ConnectionsComponent,
        children: [
            {
                path: '',
                component: ConnectionListComponent,
            },
            {
                path: ':id',
                component: ConnectionDetailComponent,
            }
        ]
    },
    {
        path: 'outreach',
        component: OutreachComponent,
        children: outreachRoutes,
    },
    {
        path: 'note-maker',
        component: NoteMakerComponent,
    },
    {
        path: 'enhancecv',
        component: EnhanceCvComponent,
    },
    // {
    //     path: 'profile',
    //     component: ProfileComponent,
    // },
    // {
    //     path: 'settings',
    //     component: SettingsComponent,
    // },
];
