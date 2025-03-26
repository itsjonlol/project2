import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface EmailRequest {

  to:string;
  subject?:string;
  name:string;

}
export interface EmailResponse {
  message:string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  httpClient = inject(HttpClient)
  
  
  //send name and email details for the backend to send to client
  requestEmailUpdates(emailRequest: EmailRequest): Observable<EmailResponse> {
    return this.httpClient.post<EmailResponse>(`${environment.backendUrl}/sendemail`,emailRequest)
  }
}
