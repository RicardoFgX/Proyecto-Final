import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSidebarComponent } from '../components/user-sidebar/user-sidebar.component';



@Component({
  selector: 'app-user-dash',
  standalone: true,
  imports: [CommonModule, UserSidebarComponent
  ],
  templateUrl: './user-dash.component.html',
  styleUrl: './user-dash.component.css'
})
export class UserDashComponent {
  
}