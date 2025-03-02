import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),provideHttpClient(), provideFirebaseApp(() => initializeApp({ projectId: "artistick-57b56", appId: "1:881250272930:web:1f53d639fd88647423b9fb", storageBucket: "artistick-57b56.firebasestorage.app", apiKey: "AIzaSyBVdQXBSCkjQDcgdpghNEWpme-t3bfSiwI", authDomain: "artistick-57b56.firebaseapp.com", messagingSenderId: "881250272930" })), provideAuth(() => getAuth())]
});
