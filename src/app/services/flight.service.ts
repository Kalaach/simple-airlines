import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IFlight } from '../interfaces/flight.interface';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FlightService {
    public constructor(private httpClient: HttpClient) {}

    public getFlights(departureStation: string, arrivalStation: string, date: string): Promise<Array<IFlight>> {
        const url: string = `${environment.baseUrl}/search`;

        return this.httpClient.get<Array<IFlight>>(url, {
            params: {
                departureStation,
                arrivalStation,
                date
            }
        }).toPromise();
    }
}
