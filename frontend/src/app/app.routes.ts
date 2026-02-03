import { Routes } from '@angular/router';
import { Home } from './home/home';
import { LiuRen } from './liu-ren/liu-ren';
import { Lenormand } from './lenormand/lenormand';
import { Tarot } from './tarot/tarot';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'liu-ren', component: LiuRen },
  { path: 'lenormand', component: Lenormand },
  { path: 'tarot', component: Tarot },
];
