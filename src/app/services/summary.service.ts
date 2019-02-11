import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ISummaryItem } from '../interfaces/summary-item.interface';

@Injectable({
    providedIn: 'root'
})
export class SummaryService {
    private summary: Array<ISummaryItem> = [];
    private summarySubject: Subject<Array<ISummaryItem>> = new Subject<Array<ISummaryItem>>();
    private summaryObservable: Observable<Array<ISummaryItem>> = this.summarySubject.asObservable();

    public getSummary(): Observable<Array<ISummaryItem>> {
        return this.summaryObservable;
    }

    public addDepartureSummaryItem(summaryItem: ISummaryItem): void {
        this.summary[0] = summaryItem;
        this.summarySubject.next(this.summary);
    }

    public addArrivalSummaryItem(summaryItem: ISummaryItem): void {
        this.summary[1] = summaryItem;
        this.summarySubject.next(this.summary);
    }

    public removeDepartureSummaryItem(): void {
        this.summary[0] = undefined;
        this.summarySubject.next(this.summary);
    }

    public removeArrivalSummaryItem(): void {
        this.summary[1] = undefined;
        this.summarySubject.next(this.summary);
    }

    public clearSummary(): void {
        this.summary.length = 0;
        this.summarySubject.next(this.summary);
    }

    public updateSummary(summary: Array<ISummaryItem>): void {
        this.summary = summary;
        this.summarySubject.next(this.summary);
    }
}
