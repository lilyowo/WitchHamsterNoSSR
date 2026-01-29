import { Routes } from '@angular/router';
import { Home } from './home/home';
import { LiuRen } from './liu-ren/liu-ren';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'liu-ren', component: LiuRen }
];
