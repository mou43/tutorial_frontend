import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../model/client';
import { ClientService } from '../client';
import { MatDialog } from '@angular/material/dialog';
import { ClientEditComponent } from '../client-edit/client-edit';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
  selector: 'app-client-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})

export class ClientListComponent implements OnInit {

  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(
      clients => this.dataSource.data = clients
    );
  }

  createClient() {
    const dialogRef = this.dialog.open(ClientEditComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editClient(client: Client) {
    const dialogRef = this.dialog.open(ClientEditComponent, {
      data: { client }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteClient(client: Client) {    
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { title: "Eliminar cliente", description: "Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.deleteClients(client.id).subscribe(result => {
          this.ngOnInit();
        }); 
      }
    });
  }  

}