import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrelloService {
  private appKey;
  private appTitle;
  private baseUrl;

  constructor(private _http: HttpClient) {
    this.appKey = "fa469e740b7ec7fe2286bfefd1217e7a"
    this.appTitle = "TrelloTemplateCreatorApp"
  }

  public obtenerEnlaceAutorizacion(): string {
    return "https://trello.com/1/authorize?expiration=1day&name=" + this.appTitle + "&scope=read&response_type=token&key=" + this.appKey;
  }

  public buscarArtistaPorNombre(artistName: string): any {
    this._http.get(this.baseUrl + 'search?q=' + artistName + '&type=artist').subscribe(result => {
      console.log("Job finished");
    }, error => {
      console.error(error)
    });
  }

}
