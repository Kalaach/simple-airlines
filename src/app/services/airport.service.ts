import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAirport } from '../interfaces/airport.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  private airports: Array<IAirport> = [];

  public constructor(private httpClient: HttpClient) { }

  public getAirports(): Promise<Array<IAirport>> {
    if (this.airports.length > 0) {
      return Promise.resolve(this.airports);
    }

    const url: string = `${environment.baseUrl}/asset/stations`;

    return this.httpClient.get<Array<IAirport>>(url).toPromise()
      .then(airports => {
        this.airports = airports;
        return airports;
      });
  }

  public getAirportByIata(iata: string): Promise<IAirport> {
    return this.getAirports()
      .then(airports => {
        return _.find(airports, { iata });
      });
  }

  public getAirportsBySearchPhrase(searchPhrase: string): Promise<Array<IAirport>> {
    if (!searchPhrase) {
      return Promise.resolve([]);
    }

    searchPhrase = searchPhrase.toLowerCase();
    return this.getAirports()
      .then(airports =>
        _.filter(airports, airport =>
          airport.iata.toLowerCase().includes(searchPhrase) || airport.shortName.toLowerCase().includes(searchPhrase)
        )
      );
  }
}
