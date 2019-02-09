import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Moment } from 'moment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {
  @Input()
  public departure?: Moment;

  @Input()
  public arrival?: Moment;

  @Output()
  public departureChange: EventEmitter<Moment> = new EventEmitter<Moment>();

  @Output()
  public arrivalChange: EventEmitter<Moment> = new EventEmitter<Moment>();

  public minimumDate: Date = new Date();
  public travelDates: Array<Moment> = [];

  public ngOnChanges(): void {
    this.travelDates = [this.departure, this.arrival];
  }

  public onClearArrivalDateClick(): void {
    this.travelDates = this.travelDates.slice(0, 1);
    this.arrivalChange.emit();
  }

  public afterDepartureDatePickerClosed(): void {
    this.departureChange.emit(this.travelDates[0]);
  }

  public afterArrivalDatePickerClosed(): void {
    this.arrivalChange.emit(this.travelDates[1]);
  }
}
