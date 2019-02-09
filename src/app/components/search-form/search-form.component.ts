import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ISearchParams } from '../../interfaces/search-params.interface';
import { IAirport } from 'src/app/interfaces/airport.interface';
import { Moment } from 'moment';
import { Form, NgForm } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  @Output()
  public searchFormSubmit: EventEmitter<ISearchParams> = new EventEmitter();

  @Input()
  public searchParams: ISearchParams = {};

  @ViewChild('searchForm')
  public searchForm: NgForm;

  public onSubmit(): void {
    if (this.displayAirportWarning() || this.displayTravelDateWarning()) {
      return;
    }
    this.searchFormSubmit.emit(this.searchParams);
  }

  public onOriginChange(origin: IAirport): void {
    this.searchParams.origin = origin;
  }

  public onDestinationChange(destination: IAirport): void {
    this.searchParams.destination = destination;
  }

  public onDepartureChange(departure: Moment): void {
    this.searchParams.departure = departure;
  }

  public onArrivalChange(arrival: Moment): void {
    this.searchParams.arrival = arrival;
  }

  public displayAirportWarning(): boolean {
    return this.searchForm.submitted && (!this.searchParams.origin || !this.searchParams.destination);
  }

  public displayTravelDateWarning(): boolean {
    return this.searchForm.submitted && !this.searchParams.departure;
  }
}
