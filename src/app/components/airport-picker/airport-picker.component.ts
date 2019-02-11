import * as _ from 'lodash';
import { Component, Output, Input, EventEmitter, ViewChild, ElementRef, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { AirportService } from 'src/app/services/airport.service';
import { IAirport } from 'src/app/interfaces/airport.interface';
import { environment } from '../../../environments/environment';

const INPUT_DEBOUNCE: number = 300;

@Component({
  selector: 'app-airport-picker',
  templateUrl: './airport-picker.component.html',
  styleUrls: ['./airport-picker.component.scss']
})
export class AirportPickerComponent implements OnInit, OnDestroy, OnChanges {
  @Output()
  public originChange: EventEmitter<IAirport> = new EventEmitter<IAirport>();

  @Output()
  public destinationChange: EventEmitter<IAirport> = new EventEmitter<IAirport>();

  @Input()
  public origin?: IAirport;

  @Input()
  public destination?: IAirport;

  @ViewChild('destination')
  public destinationElement: ElementRef;

  public originShortName: string;
  public destinationShortName: string;
  public originDropdownVisible: boolean = false;
  public destinationDropdownVisible: boolean = false;
  public originDropdownList: Array<IAirport> = [];
  public destinationDropdownList: Array<IAirport> = [];

  public constructor(private airportService: AirportService) { }

  public ngOnInit(): void {
    window.addEventListener('click', this.onWindowClick);
  }

  public ngOnDestroy(): void {
    window.removeEventListener('click', this.onWindowClick);
  }

  public ngOnChanges(): void {
    this.originShortName = _.get(this.origin, 'shortName');
    this.destinationShortName = _.get(this.destination, 'shortName');
  }

  private onWindowClick = (): void => {
    this.originDropdownVisible = false;
    this.destinationDropdownVisible = false;
    this.originShortName = _.get(this.origin, 'shortName');
    this.destinationShortName = _.get(this.destination, 'shortName');
  };

  public onOriginItemClick(airport: IAirport): void {
    this.origin = airport;
    this.originShortName = airport.shortName;
    this.originChange.emit(this.origin);
    this.destination = undefined;
    this.destinationShortName = '';
    this.destinationChange.emit(this.destination);
    setTimeout(() => { this.destinationElement.nativeElement.focus(); }, 300);
  }

  public onDestinationItemClick(airport: IAirport): void {
    this.destination = airport;
    this.destinationShortName = airport.shortName;
    this.destinationChange.emit(airport);
  }

  public onOriginInputDebounce: Function = _.debounce(this.onOriginInput, INPUT_DEBOUNCE);
  public onDestinationInputDebounce: Function = _.debounce(this.onDestinationInput, INPUT_DEBOUNCE);

  private onOriginInput($event: any): void {
    const searchPhrase: string = $event.target.value;

    if (!searchPhrase) {
      this.originDropdownList = [];
      this.originDropdownVisible = false;
      this.origin = undefined;
      this.originShortName = '';
      this.originChange.emit(this.origin);
      this.destination = undefined;
      this.destinationShortName = '';
      this.destinationChange.emit(this.destination);
      return;
    }

    this.getAirportDropdownList(searchPhrase)
      .then(airports => {
        this.originDropdownList = airports;
        this.originDropdownVisible = this.originDropdownList.length > 0 || !!searchPhrase;
      });
  }

  private onDestinationInput($event: any): void {
    const searchPhrase: string = $event.target.value;

    if (!searchPhrase) {
      this.destinationDropdownList = [];
      this.destinationDropdownVisible = false;
      this.destination = undefined;
      this.destinationShortName = '';
      this.destinationChange.emit(this.destination);
      return;
    }

    this.getAirportDropdownList(searchPhrase)
      .then(airports => {
        this.destinationDropdownList = _.filter(airports, airport =>
          _.find(this.origin.connections, { iata: airport.iata })) as Array<IAirport>;
        this.destinationDropdownVisible = this.originDropdownList.length > 0 || !!searchPhrase;
      });
  }

  private getAirportDropdownList(searchPhrase: string): Promise<Array<IAirport>> {
    return this.airportService.getAirportsBySearchPhrase(searchPhrase)
      .then(airports => airports.slice(0, environment.airportDropdownItemCount));
  }

}
