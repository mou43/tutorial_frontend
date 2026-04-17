import { Component, Inject, OnInit } from '@angular/core';
import { Rental } from '../model/rental';
import { RentalService } from '../rental';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Game } from '../../game/model/game';
import { Client } from '../../client/model/client';
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './rental-error-dialog';

@Component({
  selector: 'app-rental-edit',
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './rental-edit.html',
  styleUrl: './rental-edit.scss',
})
export class RentalEdit implements OnInit {
  rental: Rental;
  games: Game[] = [];
  clients: Client[] = [];

  constructor(
    private gameService: GameService,
    private clientService: ClientService,
    private rentalService: RentalService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RentalEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.rental = this.data.rental ? Object.assign({}, this.data.rental) : new Rental();

    this.gameService.getGames().subscribe((games) => {
      this.games = games;

      if (this.rental.game != null) {
        this.rental.game = games.find(g => g.id == this.data.rental.game.id);
      }
    });

    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;

      if (this.rental.client != null) {
        this.rental.client = clients.find(c => c.id == this.data.rental.client.id);
      }
    });

  }

  onSave() {

    this.rentalService.saveRental(this.rental).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        const message = err.status === 400
          ? err.error?.message
          : 'Error inesperado. Inténtalo de nuevo.';

        this.dialog.open(ErrorDialogComponent, {
          width: '400px',
          data: { message }
        });

      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
