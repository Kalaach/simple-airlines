import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchPageComponent } from './pages/search/search.page.component';
import { FlightsPageComponent } from './pages/flights/flights.page.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { AirportPickerComponent } from './components/airport-picker/airport-picker.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { SummaryComponent } from './components/summary/summary.component';
import { FlightItemComponent } from './components/flight-item/flight-item.component';
import { FlightService } from './services/flight.service';
import { AirportService } from './services/airport.service';
import { HttpClientModule } from '@angular/common/http';
import { FarePickerComponent } from './components/fare-picker/fare-picker.components';

const DATE_PICKER_FORMATS: OwlDateTimeFormats = {
  parseInput: 'l LT',
    fullPickerInput: 'l LT',
    datePickerInput: 'YYYY.MM.DD',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
};

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    FlightsPageComponent,
    SearchFormComponent,
    AirportPickerComponent,
    DatePickerComponent,
    SummaryComponent,
    FlightItemComponent,
    FarePickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NoopAnimationsModule,
    HttpClientModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule
  ],
  providers: [
    FlightService,
    AirportService,
    { provide: OWL_DATE_TIME_FORMATS, useValue: DATE_PICKER_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
