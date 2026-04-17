import { Component, OnInit } from '@angular/core';
import { Rental } from '../model/rental';
import { RentalService } from '../rental';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { Pageable } from '../../core/model/page/Pageable';
import { RentalEdit } from '../rental-edit/rental-edit';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';
import { Game } from '../../game/model/game';
import { Client } from '../../client/model/client';
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client';
import type { Moment } from 'moment';

@Component({
  selector: 'app-rental-list',
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
  templateUrl: './rental-list.html',
  styleUrl: './rental-list.scss',
})
export class RentalListComponent implements OnInit {
  games: Game[] = [];
  clients: Client[] = [];
  filterGame: Game = null;
  filterClient: Client = null;
  filterDate: Moment | null = null;

  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Rental>();
  displayedColumns: string[] = ['id', 'game', 'client', 'rentalDate', 'returnDate', 'action'];

  constructor(
    private gameService: GameService,
    private clientService: ClientService,
    private rentalService: RentalService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => (this.games = games));
    this.clientService.getClients().subscribe((clients) => (this.clients = clients));

    this.loadPage();
  }

  onCleanFilter(): void {
    this.filterGame = null;
    this.filterClient = null;
    this.filterDate = null;
    this.onSearch();
  }

  onSearch(): void {
    this.pageNumber = 0;
    this.loadPage();
  }

  loadPage(event?: PageEvent) {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    const gameId =
      this.filterGame != null ? this.filterGame.id : null;

    const clientId =
      this.filterClient != null ? this.filterClient.id : null;

    const rentalDate = this.filterDate != null
      ? (typeof this.filterDate.format === 'function'
        ? this.filterDate.format('YYYY-MM-DD') // Moment
        : this.filterDate.toISOString().split('T')[0] // Date
      )
      : null;

    this.rentalService.getRental(pageable, gameId, clientId, rentalDate).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });

  }

  createRental() {
    const dialogRef = this.dialog.open(RentalEdit, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  editRental(rental: Rental) {
    const dialogRef = this.dialog.open(RentalEdit, {
      data: { rental: rental },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  deleteRental(rental: Rental) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar préstamo',
        description:
          'Atención si borra el préstamos se perderán sus datos.<br> ¿Desea eliminar el préstamo?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rentalService.deleteRental(rental.id).subscribe((result) => {
          this.ngOnInit();
        });
      }
    });
  }
}
