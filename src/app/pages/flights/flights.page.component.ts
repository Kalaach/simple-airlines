import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ISearchParams } from 'src/app/interfaces/search-params.interface';
import { FlightService } from 'src/app/services/flight.service';
import { AirportService } from 'src/app/services/airport.service';
import { Moment } from 'moment';
import { IAirport } from 'src/app/interfaces/airport.interface';
import { IFlight } from 'src/app/interfaces/flight.interface';
import { SearchFormComponent } from 'src/app/components/search-form/search-form.component';
import { IFare } from 'src/app/interfaces/fare.interface';
import { IFarePickerFlightDetails } from 'src/app/interfaces/fare-picker-flight-details.interface';

const DATE_FORMAT: string = 'YYYY-MM-DD';

@Component({
  templateUrl: './flights.page.component.html',
  styleUrls: ['./flights.page.component.scss']
})
export class FlightsPageComponent {
  @ViewChild('searchFormComponent')
  public searchFormComponent: SearchFormComponent;

  public searchParams: ISearchParams = {};
  public savedSearchParams: ISearchParams;
  public departureFlightList: Array<IFlight> = [];
  public arrivalFlightList: Array<IFlight> = [];
  public selectedFlight: IFlight;
  public selectedFlightDetails: IFarePickerFlightDetails;
  public selectedDepartureFlight: IFlight;
  public selectedArrivalFlight: IFlight;
  public selectedDepartureFare: IFare;
  public selectedArrivalFare: IFare;
  public farePickerVisible: boolean = false;
  public departureFlightListLoading: boolean;
  public arrivalFlightListLoading: boolean;

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

          this.loadFlightLists();
        })
    });
  }

  public onSearchFormSubmit(searchParams: ISearchParams): void {
    this.searchParams = searchParams;
    this.loadFlightLists();
  }

  public onFlightClick(flight: IFlight): void {
    const {
      origin,
      destination,
      departure,
      arrival
    } = this.savedSearchParams;

    this.selectedFlight = flight;

    if (this.departureFlightList.includes(this.selectedFlight)) {
      this.selectedFlightDetails = {
        originShortName: origin.shortName,
        destinationShortName: destination.shortName,
        flightDateFormatted: this.formatDate(departure)
      };
    } else {
      this.selectedFlightDetails = {
        originShortName: destination.shortName,
        destinationShortName: origin.shortName,
        flightDateFormatted: this.formatDate(arrival)
      }
    }

    this.farePickerVisible = true;
  }

  public onFarePick(fare: IFare): void {
    this.farePickerVisible = false;

    if (this.departureFlightList.includes(this.selectedFlight)) {
      this.selectedDepartureFlight = this.selectedFlight;
      this.selectedDepartureFare = fare;
    } else {
      this.selectedArrivalFlight = this.selectedFlight;
      this.selectedArrivalFare = fare;
    }
  }

  public onDepartureFlightSelectionCancel(): void {
    this.selectedDepartureFlight = undefined;
    this.selectedDepartureFare = undefined;
  }

  public onArrivalFlightSelectionCancel(): void {
    this.selectedArrivalFlight = undefined;
    this.selectedDepartureFare = undefined;
  }

  public onModalOverlayClick(): void {
    this.farePickerVisible = false;
  }

  public formatDate(date: Moment): string {
    if (!date) {
      return 'No return flight / One way';
    }

    return date.format('YYYY MMM. DD.');
  }

  private loadFlightLists(): void {
    // if (
    //   this.searchParams.origin.iata !== this.savedSearchParams.origin.iata ||
    //   this.searchParams.destination.iata !== this.savedSearchParams.destination.iata
    // ) {
    //   if (this.searchParams.departure.date() !== this.savedSearchParams.departure.date()) {
    //     this.selectedDepartureFlight = undefined;
    //     this.selectedDepartureFare = undefined;
    //   }

    //   if (this.searchParams.arrival.date() !== this.savedSearchParams.arrival.date()) {
    //     this.selectedDepartureFlight = undefined;
    //     this.selectedDepartureFare = undefined;
    //   }
    // }
    this.selectedDepartureFlight = undefined;
    this.selectedDepartureFare = undefined;
    this.selectedDepartureFlight = undefined;
    this.selectedDepartureFare = undefined;

    this.savedSearchParams = _.cloneDeep(this.searchParams);

    this.departureFlightListLoading = true;
    this.flightService.getFlights(
      this.savedSearchParams.origin.iata,
      this.savedSearchParams.destination.iata,
      this.savedSearchParams.departure.format(DATE_FORMAT)
    )
      .then(flightList => {
        this.departureFlightList = flightList;
      })
      .finally(() => {
        this.departureFlightListLoading = false;
      })

    if (this.savedSearchParams.arrival) {
      this.arrivalFlightListLoading = true;
      this.flightService.getFlights(
        this.savedSearchParams.destination.iata,
        this.savedSearchParams.origin.iata,
        this.savedSearchParams.arrival.format(DATE_FORMAT)
      )
        .then(flightList => {
          this.arrivalFlightList = flightList;
        })
        .finally(() => {
          this.arrivalFlightListLoading = false;
        });
    }
  }
}
