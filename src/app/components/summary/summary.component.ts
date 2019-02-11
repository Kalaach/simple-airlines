import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { SummaryService } from 'src/app/services/summary.service';
import { ISummaryItem } from 'src/app/interfaces/summary-item.interface';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  public summary: Array<ISummaryItem> = [];
  public totalCost: number = 0;

  public constructor(private summaryService: SummaryService) { }

  public ngOnInit(): void {
    this.summaryService.getSummary().subscribe(summary => {
      this.summary = summary;
      this.totalCost = this.getTotalCost(summary);
    });
  }

  public onCheckoutClick(): void {
    alert('That\'s it. Thanks for "watching". :)');
  }

  private getTotalCost(summary: Array<ISummaryItem>): number {
    return summary.reduce((accumulator, summaryItem) => accumulator + _.get(summaryItem, 'fare.price', 0), 0);
  }
}
