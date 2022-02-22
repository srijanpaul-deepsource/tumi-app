import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import {
  GetCostItemsForEventGQL,
  GetCostItemsForEventQuery,
  UpdateCostItemsFromTemplateGQL,
} from '@tumi/data-access';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tumi-manage-event-finances',
  templateUrl: './manage-event-finances.component.html',
  styleUrls: ['./manage-event-finances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageEventFinancesComponent implements OnChanges {
  @Input() public eventId: string | undefined;
  public data$: Observable<GetCostItemsForEventQuery>;
  private getDataQueryRef;
  constructor(
    private getCostItems: GetCostItemsForEventGQL,
    private updateCostItems: UpdateCostItemsFromTemplateGQL,
    private snackbar: MatSnackBar
  ) {
    this.getDataQueryRef = this.getCostItems.watch();
    this.data$ = this.getDataQueryRef.valueChanges.pipe(
      map(({ data }) => data)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.eventId) {
      this.getDataQueryRef.refetch({ eventId: changes.eventId.currentValue });
    }
  }

  async getFromTemplate() {
    const { event } = await firstValueFrom(this.data$);
    if (event) {
      try {
        await this.updateCostItems.mutate({ eventId: event.id }).toPromise();
        await this.getDataQueryRef.refetch();
      } catch (e: unknown) {
        console.log(e);
        if (e instanceof Error) {
          this.snackbar.open(e.message, 'OK', { duration: 5000 });
        }
      }
    }
  }

  async removeCostItem() {}

  async updateCostItem() {}
}
