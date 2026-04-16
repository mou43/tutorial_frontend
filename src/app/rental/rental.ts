import { Injectable } from '@angular/core';
import { Pageable } from '../core/model/page/Pageable';
import { Observable, of } from 'rxjs';
import { RentalPage } from './model/rentalPage';
import { Rental } from './model/rental';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8080/rental';

  getRental(pageable: Pageable): Observable<RentalPage> {
    return this.http.post<RentalPage>(this.baseUrl, { pageable: pageable });
  }

  saveRental(rental: Rental): Observable<Rental> {
    const { id } = rental;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Rental>(url, rental);

  }

  deleteRental(idRental: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idRental}`);
  }

  getAllRental(): Observable<Rental[]> {
    return this.http.get<Rental[]>(this.baseUrl);
  }

}
