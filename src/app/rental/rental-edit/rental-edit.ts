import { Component, Inject, OnInit } from '@angular/core';
import { Rental } from '../model/rental';
import { RentalService } from '../rental';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { Game } from '../../game/model/game';
import { Client } from '../../client/model/client';
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client';
import type { Moment } from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-rental-edit',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule
  ],
  templateUrl: './rental-edit.html',
  styleUrl: './rental-edit.scss',
})
export class RentalEdit implements OnInit {
  rental: Rental;
  games: Game[] = [];
  clients: Client[] = [];
  filterGame: Game = null;
  filterClient: Client = null;
  filterRentalDate: Moment | null = null;
  filterReturnDate: Moment | null = null;

  constructor(
    private gameService: GameService,
    private clientService: ClientService,
    private rentalService: RentalService,
    public dialogRef: MatDialogRef<RentalEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.rental = this.data.rental ? Object.assign({}, this.data.rental) : new Rental();

    this.gameService.getGames().subscribe((games) => {
      this.games = games;

      if (this.rental.game != null) {
        const gameFilter: Game[] = games.filter(
          (game) => game.id == this.data.rental.game.id
        );
        if (gameFilter != null) {
          this.rental.game = gameFilter[0];
        }
      }
    });

    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;

      if (this.rental.client != null) {
        const clientFilter: Client[] = clients.filter(
          (client) => client.id == this.data.rental.client.id
        );
        if (clientFilter != null) {
          this.rental.client = clientFilter[0];
        }
      }
    });

    const rentalDate = this.rental.rentalDate != null
      ? (typeof this.rental.rentalDate.format === 'function'
        ? this.rental.rentalDate.format('YYYY-MM-DD') // Moment
        : this.rental.rentalDate.toISOString().split('T')[0] // Date
      )
      : null;

    const returnDate = this.rental.returnDate != null
      ? (typeof this.rental.returnDate.format === 'function'
        ? this.rental.returnDate.format('YYYY-MM-DD') // Moment
        : this.rental.returnDate.toISOString().split('T')[0] // Date
      )
      : null;

  }

  onSave() {
    this.rentalService.saveRental(this.rental).subscribe((result) => {
      this.dialogRef.close();
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
