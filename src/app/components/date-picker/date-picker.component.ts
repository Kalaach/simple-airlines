import * as moment from 'moment';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnChanges {
  @Input()
  public departure?: moment.Moment;

  @Input()
  public arrival?: moment.Moment;

  @Output()
  public departureChange: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();

  @Output()
  public arrivalChange: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();

  @ViewChild('arrivalDatePicker')
  public arrivalDatePicker: ElementRef;

  public minimumDate: moment.Moment = moment().subtract(1, 'd');
  public travelDates: Array<moment.Moment> = [];

  public ngOnChanges(): void {
    this.travelDates = [ this.departure, this.arrival ];
  }

  public onClearArrivalDateClick(): void {
    this.travelDates.splice(0, 1);
    this.arrivalChange.emit();
  }

  public afterDatePickerClosed(): void {
    this.departureChange.emit(this.travelDates[0]);
    this.arrivalChange.emit(this.travelDates[1]);
  }
}
