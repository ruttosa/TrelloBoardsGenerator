import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrelloService {
  private http;
  private appKey;
  private appTitle;

  constructor(_http: HttpClient) { 
    this.http = _http;
    this.appKey = "fa469e740b7ec7fe2286bfefd1217e7a"
    this.appTitle = "TrelloTemplateCreatorApp"
  }

  public obtenerAutorizacion(){

    let url = "https://trello.com/1/authorize?expiration=1day&name=" + this.appTitle + "&scope=read&response_type=token&key=" + this.appKey;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.get(url).subscribe(
      result => {
        console.log(result)
        alert("Authorized");
      }, 
      error => {
        console.error(error);
      }
    );
  }
}
