import { provideRouter, RouterConfig }  from '@angular/router';
import { AppComponent } from './app.component';
import { PesquisaComponent } from './pages/pesquisa.component';
import { HomeComponent } from './pages/home.component';

const routes: RouterConfig = [
    {
        path: "",
        component: AppComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'pesquisa',
        component: PesquisaComponent
    }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];