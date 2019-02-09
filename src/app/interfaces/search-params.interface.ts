import { IAirport } from 'src/app/interfaces/airport.interface';
import { Moment } from 'moment';

export interface ISearchParams {
    origin?: IAirport;
    destination?: IAirport;
    departure?: Moment;
    arrival?: Moment;
}
