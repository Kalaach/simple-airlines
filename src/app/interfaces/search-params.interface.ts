import { IAirport } from 'src/app/interfaces/airport.interface';

export interface ISearchParams {
    origin?: IAirport;
    destination?: IAirport;
    departureDate?: Date;
    arrivalDate?: Date;
}
