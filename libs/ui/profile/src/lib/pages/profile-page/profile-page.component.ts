import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  GetPaymentSetupSessionGQL,
  MembershipStatus,
  UpdateProfileGQL,
  UserProfileGQL,
  UserProfileQuery,
} from '@tumi/data-access';
import { first, map } from 'rxjs/operators';
import { firstValueFrom, Observable } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js/pure';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from '../../../../../../../apps/tumi-app/src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileDialogComponent } from '../../components/update-profile-dialog/update-profile-dialog.component';
import { ClaimEventDialogComponent } from '../../components/claim-event-dialog/claim-event-dialog.component';

@Component({
  selector: 'tumi-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnDestroy {
  public profile$: Observable<UserProfileQuery['currentUser']>;
  public profileQueryRef;
  public MembershipStatus = MembershipStatus;
  constructor(
    private title: Title,
    private profileQuery: UserProfileGQL,
    private getStripeSession: GetPaymentSetupSessionGQL,
    private updateProfileMutation: UpdateProfileGQL,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.title.setTitle('TUMi - profile');
    this.profileQueryRef = this.profileQuery.watch();
    this.profileQueryRef.startPolling(5000);
    this.profile$ = this.profileQueryRef.valueChanges.pipe(
      map(({ data }) => data.currentUser)
    );
    this.route.queryParamMap.pipe(first()).subscribe((queryMap) => {
      const status = queryMap.get('stripe');
      if (status === 'success') {
        this.snackBar.open('✔️ We are processing your payment method...');
      }
      if (status === 'fail') {
        this.snackBar.open('❌ The process was cancelled');
      }
      const claimCode = queryMap.get('code');
      if (claimCode) {
        this.claimEvent(claimCode);
      }
    });
  }
  ngOnDestroy(): void {
    this.profileQueryRef.stopPolling();
  }

  async setupStripePayment() {
    const { data } = await firstValueFrom(this.getStripeSession.fetch());
    const stripe = await loadStripe(environment.stripeKey);
    if (stripe) {
      await stripe.redirectToCheckout({
        sessionId: data.getPaymentSetupSession.id,
      });
    }
  }

  async updateProfile() {
    const profile = await firstValueFrom(this.profile$);
    const result = await this.dialog
      .open(UpdateProfileDialogComponent, { data: { profile } })
      .afterClosed()
      .toPromise();
    if (result && profile) {
      await this.updateProfileMutation.mutate({ input: result }).toPromise();
    }
  }

  claimEvent(code?: string): void {
    this.dialog.open(ClaimEventDialogComponent, { data: { code } });
  }
}
