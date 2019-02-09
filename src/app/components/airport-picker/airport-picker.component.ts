import * as _ from 'lodash';
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { AirportService } from 'src/app/services/airport.service';
import { IAirport } from 'src/app/interfaces/airport.interface';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-airport-picker',
  templateUrl: './airport-picker.component.html',
  styleUrls: ['./airport-picker.component.scss']
})
export class AirportPickerComponent {
  @Output()
  public originChange: EventEmitter<IAirport> = new EventEmitter<IAirport>();

  @Output()
  public destinationChange: EventEmitter<IAirport> = new EventEmitter<IAirport>();

  @Input()
  public origin?: IAirport;

  @Input()
  public destination?: IAirport;

  public originShortName: string;
  public destinationShortName: string;
  public lastEditedInputName: string;
  public airportDropdownVisible: boolean = false;
  public airportDropdownList: Array<IAirport> = [];

  public constructor(private airportService: AirportService) {
    this.originShortName = _.get(this.origin, 'shortName');
    this.destinationShortName = _.get(this.destination, 'shortName');

    window.addEventListener('click', this.onWindowClick);
  }

  public onDestoy(): void {
    window.removeEventListener('click', this.onWindowClick);
  }

  public onAirportClick(airport: IAirport) {
    this[this.lastEditedInputName] = airport;
    this[`${this.lastEditedInputName}ShortName`] = airport.shortName;
    this[`${this.lastEditedInputName}Change`].emit(airport);
  }

  public onAirportInputDebounce: Function = _.debounce(this.onAirportInput, 300);

  private onAirportInput($event: any) {
    this.lastEditedInputName = $event.target.attributes.name.value;
    this.populateAirportDropdownList($event.target.value);
  }

  private onWindowClick = (): void => {
    this.airportDropdownVisible = false;
    this.originShortName = _.get(this.origin, 'shortName');
    this.destinationShortName = _.get(this.destination, 'shortName');
  };

  private populateAirportDropdownList(searchPhrase: string): void {
    this.airportService.getAirportsBySearchPhrase(searchPhrase)
      .then(airports => {
        this.airportDropdownList = airports.slice(0, environment.airportDropdownItemCount);

        /* TODO: come up with a better solution, because this is UGLY UGLY UGLY... */
        if (this.lastEditedInputName === 'destination') {
          this.airportDropdownList = _.filter(this.airportDropdownList, airport =>
            _.find(this.origin.connections, { iata: airport.iata })
          ) as Array<IAirport>
        }

        console.log(this.airportDropdownList);

        this.airportDropdownVisible = this.airportDropdownList.length > 0 || !!searchPhrase;
      });
  }

}
