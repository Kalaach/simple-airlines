import { IAirportConnection } from './airport-connection.interface';

export interface IAirport {
    iata: string;
    latitude: number;
    longitude: number;
    shortName: string;
    connections: Array<IAirportConnection>;
}
