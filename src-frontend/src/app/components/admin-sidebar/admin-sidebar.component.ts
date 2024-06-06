import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent implements OnInit{
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Obtener la ruta actual
    const currentRoute = this.router.url;
    console.log(currentRoute);
    this.setActiveSidebarItem(currentRoute);
  }

  setActiveSidebarItem(currentRoute: string): void {
    const sidebarItems = document.querySelectorAll(".sidenav-item");
    console.log(sidebarItems);
    sidebarItems.forEach(item => {
      item.classList.remove("active");
    });
    switch (currentRoute) {
      case '/adminDash/usuarios':
        document.querySelector(".usuarios")?.classList.add("active");
        break;
      case '/adminDash/notas':
        document.querySelector(".notas")?.classList.add("active");
        break;
      case '/adminDash/proyectos':
        document.querySelector(".proyectos")?.classList.add("active");
        break;
      default:
        break;
    }
  }

}
