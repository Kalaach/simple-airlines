import * as moment from 'moment';
import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ISearchParams } from 'src/app/interfaces/search-params.interface';
import { FlightService } from 'src/app/services/flight.service';
import { AirportService } from 'src/app/services/airport.service';
import { Moment } from 'moment';
import { IAirport } from 'src/app/interfaces/airport.interface';

@Component({
  templateUrl: './flights.page.component.html',
  styleUrls: ['./flights.page.component.scss']
})
export class FlightsPageComponent {
  public searchParams: ISearchParams = {};

  public constructor(
    private activatedRoute: ActivatedRoute,
    private airportService: AirportService,
    private flightService: FlightService
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const originIata: string = params.origin;
      const destinationIata: string = params.destination;
      const departure: Moment = moment(params.departure);
      const arrival: Moment = params.arrival ? moment(params.arrival) : undefined;

      Promise.all([
        this.airportService.getAirportByIata(originIata),
        this.airportService.getAirportByIata(destinationIata)
      ])
        .then(([origin, destination]: Array<IAirport>) => {
          this.searchParams = {
            origin,
            destination,
            departure,
            arrival
          };
        })
    });
  }

  public onSearchFormSubmit(searchParams: ISearchParams): void {
    console.log('submit:', searchParams);
  }
}
