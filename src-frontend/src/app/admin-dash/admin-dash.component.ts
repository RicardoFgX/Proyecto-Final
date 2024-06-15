import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { UserSidebarComponent } from '../components/user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-admin-dash',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, UserSidebarComponent],
  templateUrl: './admin-dash.component.html',
  styleUrl: './admin-dash.component.css'
})
export class AdminDashComponent {
  
}
