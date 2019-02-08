import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ISearchParams } from '../../interfaces/search-params.interface';

@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
    @Output()
    public searchFormSubmit: EventEmitter<ISearchParams> = new EventEmitter();

    @Input()
    public searchParams: ISearchParams = {};

    public constructor() {

    }

    public onSubmit(): void {
        this.searchFormSubmit.emit(this.searchParams);
    }
}
