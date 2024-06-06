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
import { AdminDashNewUserComponent } from './admin-dash/admin-dash-new-user/admin-dash-new-user.component';
import { AdminDashModNotesComponent } from './admin-dash/admin-dash-mod-notes/admin-dash-mod-notes.component';
import { AdminDashNewNoteComponent } from './admin-dash/admin-dash-new-note/admin-dash-new-note.component';
import { AdminDashModProyectsComponent } from './admin-dash/admin-dash-mod-proyects/admin-dash-mod-proyects.component';
import { AdminDashNewProyectComponent } from './admin-dash/admin-dash-new-proyect/admin-dash-new-proyect.component';
import { AdminDashModTareaComponent } from './admin-dash/admin-dash-mod-tarea/admin-dash-mod-tarea.component';
import { AdminDashNewTareaComponent } from './admin-dash/admin-dash-new-tarea/admin-dash-new-tarea.component';
import { UserProfileComponent } from './user-dash/user-profile/user-profile.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'perfil', component: UserProfileComponent },
  { path: 'adminDash', component: AdminDashComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/usuarios', component: AdminDashListUsersComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/usuarios/:id', component: AdminDashModUserComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/crearUsuario', component: AdminDashNewUserComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/notas/:id', component: AdminDashModNotesComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/crearNota', component: AdminDashNewNoteComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/proyectos/:id', component: AdminDashModProyectsComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/proyectos/:id/tareas/:id', component: AdminDashModTareaComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/proyectos/:id/tareas', component: AdminDashNewTareaComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/crearProyecto', component: AdminDashNewProyectComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/crearProyecto/tareas', component: AdminDashNewTareaComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/notas', component: AdminDashListNotesComponent, canMatch: [roleoGuard] },
  { path: 'adminDash/proyectos', component: AdminDashListProyectsComponent, canMatch: [roleoGuard] },
  { path: 'userDash', component: UserDashComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
//canMatch: [userGuard]