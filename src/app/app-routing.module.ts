import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPageComponent } from './pages/search/search.page.component';
import { FlightsPageComponent } from './pages/flights/flights.page.component';

const routes: Routes = [
  {
    path: 'search',
    component: SearchPageComponent
  },
  {
    path: 'flights',
    component: FlightsPageComponent
  },
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/search'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
