import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import * as fabric from 'fabric';
import { Observable } from 'rxjs';
import { UploadResponse } from '../models/gamemodels';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  httpClient = inject(HttpClient)

  private backendUrl = 'http://localhost:4000/api';


  dataURItoBlob(dataURI:string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  uploadBlob(blob:Blob):Observable<UploadResponse> {
    const file = new File([blob], 'canvas-image.png', { type: 'image/png' });

    // Create FormData
    const formData = new FormData();
    formData.append('name', 'canvasImage');
    formData.append('file', file);
    return this.httpClient.post<UploadResponse>(`${this.backendUrl}/upload`, formData);

  }
}
