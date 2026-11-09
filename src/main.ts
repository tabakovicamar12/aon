import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';
import { loadHotjar } from './app/core/hotjar';
import { loadClarity } from './app/core/clarity';

loadHotjar(environment.hotjarSiteId);
loadClarity(environment.clarityProjectId);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
