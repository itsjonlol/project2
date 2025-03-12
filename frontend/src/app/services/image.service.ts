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

  uploadBlob(blob:Blob):Observable<UploadResponse> {
    const file = new File([blob], 'canvas-image.png', { type: 'image/png' });

    // Create FormData
    const formData = new FormData();
    formData.append('name', 'canvasImage');
    formData.append('file', file);
    return this.httpClient.post<UploadResponse>(`${this.backendUrl}/upload`, formData);

  }
}
