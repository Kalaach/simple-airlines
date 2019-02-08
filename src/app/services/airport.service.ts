import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAirport } from '../interfaces/airport.interface';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AirportService {
    private airports: Array<IAirport>;

    public constructor(private httpClient: HttpClient) { }

    public getAirports(): Promise<Array<IAirport>> {
        if (this.airports) {
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
        return this.getAirports()
            .then(airports => {
                return _.filter(airports, airport => {
                    return airport.iata.includes(searchPhrase) || airport.shortName.includes(searchPhrase);
                });
            });
    }
}
