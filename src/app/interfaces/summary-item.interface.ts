import { IFare } from './fare.interface';
import { IFlightDirectionDetails } from './fare-picker-flight-details.interface';

export interface ISummaryItem {
    flightDirectionDetails: IFlightDirectionDetails;
    fare: IFare;
}
