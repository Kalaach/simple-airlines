import { IFare } from './fare.interface';

export interface IFlight {
    carrierCode: string;
    flightNumber: string;
    remainingTickets: number;
    departure: string;
    arrival: string;
    fares: Array<IFare>;
}
