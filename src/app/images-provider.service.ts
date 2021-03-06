import { Injectable } from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ImagesProviderService {

  images: string[] = [];

  constructor(private httpClient: HttpClient) { }

  async load() {
    this.images = await this.getImagesBase64(this.getImagesHttp(['/assets/SpriteSheet/SOBER/idle.png',
      '/assets/SpriteSheet/EXTASIS/EXTASIS-Fases.png', '/assets/SpriteSheet/LSD/LSD-Fases.png']));
  }

  getImagesHttp(urls: string[]): Observable<Blob[]> {
   return forkJoin(urls.map((url: string) => {
      return this.getImage(url);
    }));
  }

  getImagesBase64(forkjoined: Observable<Blob[]>): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      forkjoined.subscribe((blobs: Blob[]) => {
        Promise.all(blobs.map((blob: Blob) => {
          return this.convertBlobToBase64(blob);
        })).then((images: string[]) => {
          resolve(images);
        });
      });
    });
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' });
  }

  convertBlobToBase64 (blob: Blob): Promise<string> {
    return new Promise<string>(function (resolve, reject) {
      const reader: FileReader = new FileReader;
      reader.readAsDataURL(blob);
      reader.onerror = reject;
      reader.onloadend = function() {
        // console.log(reader.result);
        resolve(reader.result.toString());
      };
    });
  }

}
