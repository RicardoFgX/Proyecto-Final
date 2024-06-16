import { CommonModule } from '@angular/common'; // Importa módulos comunes de Angular
import { Component, OnInit } from '@angular/core'; // Importa decoradores y utilidades para componentes de Angular
import { MatIconModule } from '@angular/material/icon'; // Importa el módulo de íconos de Angular Material
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // Importa funcionalidades de enrutamiento de Angular

@Component({
  selector: 'app-admin-sidebar', // Define el selector del componente
  standalone: true, // Indica que este es un componente independiente
  imports: [RouterLink, RouterLinkActive, MatIconModule, CommonModule], // Importa módulos necesarios para el componente
  templateUrl: './admin-sidebar.component.html', // Define la plantilla HTML del componente
  styleUrl: './admin-sidebar.component.css' // Define la hoja de estilos CSS del componente
})
export class AdminSidebarComponent implements OnInit { // Define la clase del componente e implementa OnInit
  constructor(private router: Router) { } // Inyecta el servicio de enrutador de Angular

  ngOnInit(): void {
    // Se ejecuta al inicializar el componente
    const currentRoute = this.router.url; // Obtiene la ruta actual
    this.setActiveSidebarItem(currentRoute); // Establece el elemento activo de la barra lateral basado en la ruta actual
  }

  setActiveSidebarItem(currentRoute: string): void {
    // Establece el elemento activo de la barra lateral basado en la ruta actual
    const sidebarItems = document.querySelectorAll(".sidenav-item"); // Selecciona todos los elementos de la barra lateral
    sidebarItems.forEach(item => {
      item.classList.remove("active"); // Remueve la clase 'active' de todos los elementos
    });
    // Agrega la clase 'active' al elemento correspondiente basado en la ruta actual
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

  isCollapsed = false; // Define el estado inicial de la barra lateral (no colapsada)

  toggleSidebar() {
    // Alterna el estado colapsado de la barra lateral
    this.isCollapsed = !this.isCollapsed; // Cambia el valor de isCollapsed al opuesto
    const mainContent = document.querySelector('.adminDash') as HTMLElement; // Selecciona el elemento principal del contenido
    if (mainContent) {
      if (this.isCollapsed) {
        mainContent.classList.add('collapsed'); // Agrega la clase 'collapsed' si la barra lateral está colapsada
      } else {
        mainContent.classList.remove('collapsed'); // Remueve la clase 'collapsed' si la barra lateral no está colapsada
      }
    }
  } 
}
