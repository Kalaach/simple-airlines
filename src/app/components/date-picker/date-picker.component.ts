import * as moment from 'moment';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Moment } from 'moment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnChanges {
  @Input()
  public departure?: Moment;

  @Input()
  public arrival?: Moment;

  @Output()
  public departureChange: EventEmitter<Moment> = new EventEmitter<Moment>();

  @Output()
  public arrivalChange: EventEmitter<Moment> = new EventEmitter<Moment>();

  @ViewChild('arrivalDatePicker')
  public arrivalDatePicker: ElementRef;

  public minimumDate: Moment = moment().subtract(1, 'd');
  public travelDates: Array<Moment> = [];

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
