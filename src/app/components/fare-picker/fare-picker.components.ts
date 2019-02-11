import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IFare } from 'src/app/interfaces/fare.interface';
import { IFlightDirectionDetails } from 'src/app/interfaces/fare-picker-flight-details.interface';

@Component({
  selector: 'app-fare-picker',
  templateUrl: './fare-picker.component.html',
  styleUrls: ['./fare-picker.component.scss']
})
export class FarePickerComponent {
  @Input()
  public fares: Array<IFare>;

  @Input()
  public flightDirectionDetails: IFlightDirectionDetails;

  @Output()
  public fareSelect: EventEmitter<IFare> = new EventEmitter<IFare>();

  public onFareClick(fare: IFare): void {
    this.fareSelect.emit(fare);
  }
}
