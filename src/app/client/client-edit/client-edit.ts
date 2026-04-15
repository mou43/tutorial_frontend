import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../client';
import { Client } from '../model/client';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './client-error-dialog';


@Component({
  selector: 'app-client-edit',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.scss',
})

export class ClientEditComponent implements OnInit {
  client: Client;

  constructor(
    public dialogRef: MatDialogRef<ClientEditComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {client : Client},
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.client = this.data.client ? Object.assign({}, this.data.client) : new Client();
    }


  onSave() {
    this.clientService.saveClients(this.client).subscribe({
      next: () => {
    this.dialogRef.close(true);
    },
    error: (err) => {
      const message = err.status === 409
      ? err.error?.message
      : 'Error inesperado. Inténtalo de nuevo.';

      this.dialog.open(ErrorDialogComponent, {
        width: '400px',
        data: {message}
      });

    }
    });
    
  }



  onClose() {
    this.dialogRef.close();
  }
}