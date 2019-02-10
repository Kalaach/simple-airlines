import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IFlight } from 'src/app/interfaces/flight.interface';
import { IFare } from 'src/app/interfaces/fare.interface';

@Component({
  selector: 'app-flight-item',
  templateUrl: './flight-item.component.html',
  styleUrls: ['./flight-item.component.scss']
})
export class FlightItemComponent {
  @Input()
  public flight: IFlight;

  @Input()
  public selectedFare: IFare;

  @Output()
  public selectionCancel: EventEmitter<void> = new EventEmitter<void>();

  public formattedDepartureTime: string;
  public formattedArrivalTime: string;
  public formattedTravelTime: string;
  public lowestFarePrice: number;
  public selectedFarePrice: number;
  public soldOut: boolean;

  public ngOnChanges(): void {
    if (this.flight) {
      this.formattedDepartureTime = this.getFormattedFlightTime(this.flight.departure);
      this.formattedArrivalTime = this.getFormattedFlightTime(this.flight.arrival);
      this.formattedTravelTime = this.getFormattedFlightTravelTime(this.flight.departure, this.flight.arrival);
      this.lowestFarePrice = this.getFlightLowestFarePrice(this.flight);
      this.selectedFarePrice = this.getSelectedFarePrice(this.flight, this.selectedFare);
      this.soldOut = this.isFightSoldOut(this.flight);
    }
  }

  public onChangeLabelClick(): void {
    this.selectionCancel.emit();
  }

  public getFormattedFlightTime(date: string): string {
    return moment(date).format('HH:mm');
  }

  public getFormattedFlightTravelTime(departureDate: string, arrivalTime: string): string {
    const difference: number =  moment(arrivalTime).diff(moment(departureDate));
    const duration = moment.duration(difference);
    const hours = Math.floor(duration.asHours());
    const minutes = moment.utc(difference).format('m');
    return `${hours}h ${minutes}m`;
  }

  public getFlightLowestFarePrice(flight: IFlight): number {
    return _.get(_.minBy(flight.fares, fare => fare.price), 'price');
  }

  public getSelectedFarePrice(flight: IFlight, selectedFare: IFare): number {
    if (!selectedFare) {
      return 0;
    }
    return _.get(_.find(flight.fares, { bundle: selectedFare.bundle }), 'price', -1);
  }

  public isFightSoldOut(flight: IFlight): boolean {
    return flight.remainingTickets === 0;
  }
}
