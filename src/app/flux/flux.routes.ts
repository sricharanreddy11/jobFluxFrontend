import { Routes } from '@angular/router';
import { NoteMakerComponent } from './note-maker/note-maker.component';
import { OutreachComponent } from './outreach/outreach.component';
import {routes as outreachRoutes} from './outreach/outreach.routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: "full"
    },
    // {
    //     path: 'dashboard',
    //     component: DashboardComponent,
    // },
    // {
    //     path: 'tasks',
    //     component: TasksComponent,
    // },
    // {
    //     path: 'projects',
    //     component: ProjectsComponent,
    // },
    // { 
    //     path: 'projects/:id',
    //      component: ProjectComponent
    // },
    {
        path: 'outreach',
        component: OutreachComponent,
        children: outreachRoutes,
    },
    {
        path: 'note-maker',
        component: NoteMakerComponent,
    },
    // {
    //     path: 'assistant',
    //     component: AssistantComponent,
    // },
    // {
    //     path: 'profile',
    //     component: ProfileComponent,
    // },
    // {
    //     path: 'settings',
    //     component: SettingsComponent,
    // },
];
