import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';
import { loadHotjar } from './app/core/hotjar';

loadHotjar(environment.hotjarSiteId);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
