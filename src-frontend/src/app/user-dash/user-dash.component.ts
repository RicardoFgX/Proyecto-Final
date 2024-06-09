import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';



@Component({
  selector: 'app-user-dash',
  standalone: true,
  imports: [MatButtonModule,MatMenuModule, FormsModule, CommonModule, CdkDropListGroup, CdkDropList, CdkDrag, MatExpansionModule],
  templateUrl: './user-dash.component.html',
  styleUrl: './user-dash.component.css'
})
export class UserDashComponent {
  objetos1: string[] = ['Item 1', 'Item 2', 'Item 3'];
  objetos2: string[] = [];

  panelOpenState = false;
  

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // Mover dentro del mismo contenedor
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Mover a un contenedor diferente
      const movedItem = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(`El objeto ${movedItem} ahora está en la columna ${event.container.id}`);
    }
  }
  
  

  mostrarElementos() {
    console.log("Elementos en la lista de disponibles:", this.objetos1.join(', '));
    console.log("Elementos en la lista de la cesta de compras:", this.objetos2.join(', '));
  }

  isModal1Open = false;
  isModal2Open = false;

  openModal(modal: string) {
    if (modal === 'modal1') {
      this.isModal1Open = true;
    } else if (modal === 'modal2') {
      this.isModal2Open = true;
    }
  }

  closeModal(modal: string) {
    if (modal === 'modal1') {
      this.isModal1Open = false;
    } else if (modal === 'modal2') {
      this.isModal2Open = false;
    }
  }

  confirmAction() {
    // Acción de confirmación (ej. eliminar un elemento)
    console.log('Elemento borrado');
    this.closeModal('modal2');
  }
}