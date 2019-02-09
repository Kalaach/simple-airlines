import { Component } from '@angular/core';
import { ISearchParams } from 'src/app/interfaces/search-params.interface';
import { Router } from '@angular/router';

@Component({
  templateUrl: './search.page.component.html',
  styleUrls: ['./search.page.component.scss']
})
export class SearchPageComponent {
  public constructor(private router: Router) { }

  public onSubmit(searchParams: ISearchParams): void {
    this.router.navigate(['flights'], {
      queryParams: searchParams
    });
  }
}
