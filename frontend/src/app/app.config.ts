import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideLottieOptions } from 'ngx-lottie';
import { routes } from './app.routes';
import { environment } from '../environments/environment.development';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import player from 'lottie-web';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { NgxsModule, provideStore } from '@ngxs/store';
import { PostState } from './store/post.actions';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideLottieOptions({
        player: () => player,
    }),
  
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()), provideStore(
[PostState],
withNgxsReduxDevtoolsPlugin(),
withNgxsLoggerPlugin())]
};
