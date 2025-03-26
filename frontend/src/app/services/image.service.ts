import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { UploadResponse } from '../models/gamemodels';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  httpClient = inject(HttpClient)

  

  //convert base 64 to blob. Because fabric canvas returns base64
  dataURItoBlob(dataURI: string): Blob{
    const [meta, base64Data] = dataURI.split(',');
    const mimeMatch = meta.match(/:(.*?);/);

    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const byteString = atob(base64Data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for(let i = 0; i < byteString.length; i++){
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type: mimeType});
  }
  // to upload the canvas that has been converted to a blob
  uploadBlob(blob:Blob):Observable<UploadResponse> {
    const file = new File([blob], 'canvas-image.png', { type: 'image/png' });
    const formData = new FormData();
    formData.append('name', 'canvasImage');
    formData.append('file', file);
    return this.httpClient.post<UploadResponse>(`${environment.backendUrl}/upload`, formData);

  }
}
