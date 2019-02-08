import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchPageComponent } from './pages/search/search.page.component';
import { FlightsPageComponent } from './pages/flights/flights.page.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { AirportPickerComponent } from './components/airport-picker/airport-picker.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { SummaryComponent } from './components/summary/summary.component';
import { FlightListComponent } from './components/flight-list/flight-list.component';
import { FlightItemComponent } from './components/flight-item/flight-item.component';
import { FlightService } from './services/flight.service';
import { AirportService } from './services/airport.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    FlightsPageComponent,
    SearchFormComponent,
    AirportPickerComponent,
    DatePickerComponent,
    SummaryComponent,
    FlightListComponent,
    FlightItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    FlightService,
    AirportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
