import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  CheckInUserGQL,
  CreateEventRegistrationCodeGQL,
  DeregisterFromEventGQL,
  LoadEventForManagementGQL,
  LoadEventForManagementQuery,
} from '@tumi/data-access';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'tumi-event-manage-page',
  templateUrl: './event-manage-page.component.html',
  styleUrls: ['./event-manage-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventManagePageComponent implements OnDestroy {
  public event$: Observable<LoadEventForManagementQuery['event']>;
  private loadEventQueryRef;
  private destroyed$ = new Subject();
  constructor(
    private title: Title,
    private loadEvent: LoadEventForManagementGQL,
    private removeUser: DeregisterFromEventGQL,
    private checkInMutation: CheckInUserGQL,
    private createEventRegistrationCodeGQL: CreateEventRegistrationCodeGQL,
    private route: ActivatedRoute
  ) {
    this.title.setTitle('TUMi - manage event');
    this.loadEventQueryRef = this.loadEvent.watch();
    this.route.paramMap.subscribe((params) =>
      this.loadEventQueryRef.refetch({ id: params.get('eventId') ?? '' })
    );
    this.event$ = this.loadEventQueryRef.valueChanges.pipe(
      map(({ data }) => data.event)
    );
    // this.loadEventQueryRef.startPolling(5000);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.loadEventQueryRef.stopPolling();
  }

  async kickWithRefund(userId: string) {
    // const event = await this.event$.pipe(first()).toPromise();
    // const proceed = confirm('Are you sure you want to remove this user?');
    // if (event && proceed) {
    //   try {
    //     await this.removeUserWithRefund
    //       .mutate({ eventId: event.id, userId })
    //       .toPromise();
    //   } catch (e) {
    //     alert(e.message);
    //   }
    // }
  }

  async kick(registrationId: string) {
    // const event = await firstValueFrom(this.event$);
    // const proceed = confirm(
    //   'Are you sure you want to remove this user without refund?'
    // );
    // if (event && proceed) {
    //   try {
    //     await this.removeUser.mutate({ registrationId }).toPromise();
    //   } catch (e) {
    //     alert(e.message);
    //   }
    // }
  }

  async checkin(id: string) {
    throw await this.checkInMutation.mutate({ id, manual: true }).toPromise();
  }

  getTable(
    participantRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      createdAt: any;
      paymentStatus?: string | null | undefined;
      paymentIntentId?: string | null | undefined;
      netPaid?: number | null | undefined;
      checkInTime?: any;
      submissions: Array<{
        __typename?: 'EventSubmission';
        id: string;
        data: any;
        submissionItem: {
          __typename?: 'EventSubmissionItem';
          id: string;
          name: string;
        };
      }>;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        picture: string;
        email: string;
      };
    }>
  ) {
    return participantRegistrations
      .filter((r) => !r.checkInTime && r.submissions.length)
      .map((r) => ({
        ...r,
        address: r.submissions
          .find((s) => s.submissionItem.name === 'Address')
          ?.data?.value?.split('\n'),
      }));
  }

  joinOrganizers(
    organizerRegistrations: Array<{
      __typename?: 'EventRegistration';
      id: string;
      createdAt: any;
      paymentStatus?: string | null | undefined;
      user: {
        __typename?: 'User';
        id: string;
        fullName: string;
        picture: string;
        email: string;
      };
    }>
  ) {
    return organizerRegistrations.map((r) => r.user.fullName).join(', ');
  }

  async createRegistrationCode() {
    const event = await firstValueFrom(this.event$);
    await firstValueFrom(
      this.createEventRegistrationCodeGQL.mutate({
        eventId: event.id,
        isPublic: false,
      })
    );
    this.loadEventQueryRef.refetch();
  }
}
