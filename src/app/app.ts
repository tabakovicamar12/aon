import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { trackPageview } from './core/hotjar';
import { SessionStore } from './core/auth/session.store';
import { DatabaseService } from './core/db/database.service';
import { I18nService } from './core/i18n/i18n.service';
import { StorageUnavailableComponent } from './features/storage-unavailable.component';
import { ToastOutletComponent } from './shared/ui/toast-outlet.component';
import { UpdateBannerComponent } from './shared/ui/update-banner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastOutletComponent, StorageUnavailableComponent, UpdateBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (database.state() === 'UNAVAILABLE') {
      <aon-storage-unavailable [detail]="database.failure()" />
    } @else {
      <router-outlet />
    }
    <aon-toast-outlet />
    <aon-update-banner />
  `,
})
export class App {
  protected readonly database = inject(DatabaseService);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  constructor() {
    // Hotjar/Contentsquare: the tag counts the first page itself; report every later in-app page change.
    let first = true;
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      if (first) {
        first = false;
        return;
      }
      trackPageview(e.urlAfterRedirects);
    });
    // Session dropped (logout in another tab, consent declined): leave protected areas.
    effect(() => {
      if (this.session.session() === null) {
        const url = this.router.url;
        if (url.startsWith('/w') || url.startsWith('/m') || url.startsWith('/consent')) {
          void this.router.navigateByUrl('/login');
        }
      }
    });
  }
}
