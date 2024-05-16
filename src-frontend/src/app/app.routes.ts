import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminDashComponent } from './admin-dash/admin-dash.component';
import { UserDashComponent } from './user-dash/user-dash.component';
import { roleoGuard, userGuard } from './roleo.guard';
import { AdminDashListUsersComponent } from './admin-dash/admin-dash-list-users/admin-dash-list-users.component';
import { AdminDashListProyectsComponent } from './admin-dash/admin-dash-list-proyects/admin-dash-list-proyects.component';
import { AdminDashListNotesComponent } from './admin-dash/admin-dash-list-notes/admin-dash-list-notes.component';
import { AdminDashModUserComponent } from './admin-dash/admin-dash-mod-user/admin-dash-mod-user.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'adminDash', component: AdminDashComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/usuarios', component: AdminDashListUsersComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/usuarios/:id', component: AdminDashModUserComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/notas', component: AdminDashListNotesComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/proyectos', component: AdminDashListProyectsComponent, canMatch: [roleoGuard] },
  { path: 'userDash', component: UserDashComponent, canMatch: [userGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
