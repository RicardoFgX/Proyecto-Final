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

@Component({
  selector: 'app-user-dash',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './user-dash.component.html',
  styleUrl: './user-dash.component.css'
})
export class UserDashComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  ocultarElemento(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      console.log("Id de ejemplo", id);
      elemento.style.display = 'none';
    } else {
      console.error('Elemento no encontrado con ID:', id);
    }
  }

  otraFuncion() {
    console.log("Segunda Función");
  }
}
@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'hola.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
})
export class DialogAnimationsExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}

  ocultarElemento(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.style.display = 'none';
    } else {
      console.error('Elemento no encontrado con ID:', id);
    }
  }

  otraFuncion() {
    console.log("Segunda Función");
  }
}