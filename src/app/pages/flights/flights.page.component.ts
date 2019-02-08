import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ISearchParams } from 'src/app/interfaces/search-params.interface';
import { FlightService } from 'src/app/services/flight.service';

@Component({
    templateUrl: './flights.page.component.html',
    styleUrls: ['./flights.page.component.scss']
})
export class FlightsPageComponent {
    public searchParams: ISearchParams = {};

    public constructor(
        private activatedRoute: ActivatedRoute,
        private flightService: FlightService
    ) {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.searchParams = params;

            // this.flightService.getFlights(
            //     this.searchParams.origin.iata,
            //     this.searchParams.destination.iata,
            //     this.searchParams.departureDate.toDateString()
            // );

            // this.flightService.getFlights(
            //     this.searchParams.destination.iata,
            //     this.searchParams.origin.iata,
            //     this.searchParams.arrivalDate.toDateString()
            // );
        });
    }

    public onSearchFormSubmit(searchParams: ISearchParams): void {
        console.log('submit:', searchParams);
    }
}
