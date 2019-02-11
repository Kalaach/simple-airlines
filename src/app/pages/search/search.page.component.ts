import { Component } from '@angular/core';
import { ISearchParams } from 'src/app/interfaces/search-params.interface';
import { Router } from '@angular/router';

const DATE_FORMAT: string = 'YYYY-MM-DD';
const FLIGHTS_PAGE_PATH: string = 'flights';

@Component({
  templateUrl: './search.page.component.html',
  styleUrls: ['./search.page.component.scss']
})
export class SearchPageComponent {
  public constructor(private router: Router) { }

  public onSubmit(searchParams: ISearchParams): void {
    const queryParams: any = {
      origin: searchParams.origin.iata,
      destination: searchParams.destination.iata,
      departure: searchParams.departure.format(DATE_FORMAT),
      arrival: searchParams.arrival ? searchParams.arrival.format(DATE_FORMAT) : undefined
    };

    this.router.navigate([FLIGHTS_PAGE_PATH], { queryParams });
  }
}
