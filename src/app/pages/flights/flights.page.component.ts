import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ISearchParams } from 'src/app/interfaces/search-params.interface';
import { FlightService } from 'src/app/services/flight.service';
import { AirportService } from 'src/app/services/airport.service';
import { Moment } from 'moment';
import { IAirport } from 'src/app/interfaces/airport.interface';
import { IFlight } from 'src/app/interfaces/flight.interface';
import { SearchFormComponent } from 'src/app/components/search-form/search-form.component';
import { IFare } from 'src/app/interfaces/fare.interface';
import { IFlightDirectionDetails } from 'src/app/interfaces/fare-picker-flight-details.interface';
import { SummaryService } from 'src/app/services/summary.service';
import { ISummaryItem } from 'src/app/interfaces/summary-item.interface';

const QUERY_PARAM_DATE_FORMAT: string = 'YYYY-MM-DD';
const FLIGHT_LIST_TITE_DATE_FORMAT: string = 'YYYY MMM. DD.';
const FLIGHT_DETAILS_DATE_FORMAT: string = 'YYYY MMM. DD. HH:mm';
const NO_DATE_MESSAGE: string = 'No return flight / One way';

@Component({
  templateUrl: './flights.page.component.html',
  styleUrls: ['./flights.page.component.scss']
})
export class FlightsPageComponent implements OnInit {
  @ViewChild('searchFormComponent')
  public searchFormComponent: SearchFormComponent;

  public searchParams: ISearchParams = {};
  public savedSearchParams: ISearchParams;
  public departureFlightList: Array<IFlight> = [];
  public arrivalFlightList: Array<IFlight> = [];
  public selectedFlight: IFlight;
  public selectedFlightDirectionDetails: IFlightDirectionDetails;
  public selectedDepartureFlight: IFlight;
  public selectedArrivalFlight: IFlight;
  public selectedDepartureFare: IFare;
  public selectedArrivalFare: IFare;
  public farePickerVisible: boolean = false;
  public departureFlightListLoading: boolean;
  public arrivalFlightListLoading: boolean;
  public summaryVisible: boolean = false;
  public summaryOpen: boolean = false;

  private url: string = '';

  public constructor(
    private activatedRoute: ActivatedRoute,
    private airportService: AirportService,
    private flightService: FlightService,
    private summaryService: SummaryService
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.url.subscribe(url => {
      console.log(url);
      this.url = url[0].path;
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const originIata: string = params.origin;
      const destinationIata: string = params.destination;
      const departure: Moment = moment(params.departure);
      const arrival: Moment = params.arrival ? moment(params.arrival) : undefined;

      this.airportService.getAirportsByIatas([originIata, destinationIata])
        .then(([origin, destination]: Array<IAirport>) => {
          this.searchParams = {
            origin,
            destination,
            departure,
            arrival
          };

          this.loadFlightLists();
        });
    });

    this.summaryService.getSummary().subscribe(summary => {
      this.summaryVisible = _.compact(summary).length > 0;
    });
  }

  public onSearchFormSubmit(searchParams: ISearchParams): void {
    const queryParams: any = {
      origin: searchParams.origin.iata,
      destination: searchParams.destination.iata,
      departure: searchParams.departure.format(QUERY_PARAM_DATE_FORMAT)
    };
    if (searchParams.arrival) {
      queryParams.arrival = searchParams.arrival.format(QUERY_PARAM_DATE_FORMAT);
    }
    const encodedQueryParams = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');

    window.history.replaceState({}, '', `/${this.url}?${encodedQueryParams}`);
    this.searchParams = searchParams;
    this.loadFlightLists();
  }

  public onFlightClick(flight: IFlight): void {
    if (flight.remainingTickets === 0) {
      return;
    }

    const {
      origin,
      destination
    } = this.savedSearchParams;

    this.selectedFlight = flight;
    this.selectedFlightDirectionDetails = {
      flightDateFormatted: this.formatFlightDetailsDate(this.selectedFlight.departure)
    };

    if (this.departureFlightList.includes(this.selectedFlight)) {
      this.selectedFlightDirectionDetails.originShortName = origin.shortName;
      this.selectedFlightDirectionDetails.destinationShortName = destination.shortName;
    } else {
      this.selectedFlightDirectionDetails.originShortName = destination.shortName;
      this.selectedFlightDirectionDetails.destinationShortName = origin.shortName;
    }

    this.farePickerVisible = true;
  }

  public onFarePick(fare: IFare): void {
    const summaryItem: ISummaryItem = {
      flightDirectionDetails: this.selectedFlightDirectionDetails,
      fare
    };

    this.farePickerVisible = false;

    if (this.departureFlightList.includes(this.selectedFlight)) {
      this.summaryService.addDepartureSummaryItem(summaryItem);
      this.selectedDepartureFlight = this.selectedFlight;
      this.selectedDepartureFare = fare;
    } else {
      this.summaryService.addArrivalSummaryItem(summaryItem);
      this.selectedArrivalFlight = this.selectedFlight;
      this.selectedArrivalFare = fare;
    }
  }

  public onDepartureFlightSelectionCancel(): void {
    this.summaryService.removeDepartureSummaryItem();
    this.selectedDepartureFlight = undefined;
    this.selectedDepartureFare = undefined;
  }

  public onArrivalFlightSelectionCancel(): void {
    this.summaryService.removeArrivalSummaryItem();
    this.selectedArrivalFlight = undefined;
    this.selectedArrivalFare = undefined;
  }

  public onModalOverlayClick(): void {
    this.farePickerVisible = false;
  }

  public onSummaryOpenerClick(): void {
    this.summaryOpen = !this.summaryOpen;
  }

  public formatFlightListTitleDate(date: Moment): string {
    if (!date) {
      return NO_DATE_MESSAGE;
    }
    return date.format(FLIGHT_LIST_TITE_DATE_FORMAT);
  }

  private formatFlightDetailsDate(date: string): string {
    return moment(date).format(FLIGHT_DETAILS_DATE_FORMAT);
  }

  private loadFlightLists(): void {
    const departureFlightChanged: boolean = this.isDepartureFlightChanged();
    const arrivalFlightChanged: boolean = this.isArrivalFlightChanged();

    this.savedSearchParams = _.cloneDeep(this.searchParams);

    if (departureFlightChanged) {
      this.loadDepartureFlights();
    }

    if (arrivalFlightChanged) {
      this.loadArrivalFlights();
    }
  }

  private loadDepartureFlights(): void {
    this.selectedDepartureFlight = undefined;
    this.selectedDepartureFare = undefined;
    this.summaryService.removeDepartureSummaryItem();

    this.departureFlightListLoading = true;
    this.flightService.getFlights(
      this.savedSearchParams.origin.iata,
      this.savedSearchParams.destination.iata,
      this.savedSearchParams.departure.format(QUERY_PARAM_DATE_FORMAT)
    )
      .then(flightList => {
        this.departureFlightList = flightList;
      })
      .finally(() => {
        this.departureFlightListLoading = false;
      });
  }

  private loadArrivalFlights(): void {
    this.selectedArrivalFlight = undefined;
    this.selectedArrivalFare = undefined;
    this.summaryService.removeArrivalSummaryItem();

    if (this.savedSearchParams.arrival) {
      this.arrivalFlightListLoading = true;
      this.flightService.getFlights(
        this.savedSearchParams.destination.iata,
        this.savedSearchParams.origin.iata,
        this.savedSearchParams.arrival.format(QUERY_PARAM_DATE_FORMAT)
      )
        .then(flightList => {
          this.arrivalFlightList = flightList;
        })
        .finally(() => {
          this.arrivalFlightListLoading = false;
        });
    }
  }

  private isFlightChanged(): boolean {
    return this.savedSearchParams == null ||
      this.searchParams.origin.iata !== this.savedSearchParams.origin.iata ||
      this.searchParams.destination.iata !== this.savedSearchParams.destination.iata;
  }

  private isDepartureFlightChanged(): boolean {
    return this.isFlightChanged() ||
      this.searchParams.departure.date() !== this.savedSearchParams.departure.date();
  }

  private isArrivalFlightChanged(): boolean {
    return this.isFlightChanged() ||
      this.searchParams.arrival == null ||
      this.savedSearchParams.arrival == null ||
      this.searchParams.arrival.date() !== this.savedSearchParams.arrival.date();
  }
}
