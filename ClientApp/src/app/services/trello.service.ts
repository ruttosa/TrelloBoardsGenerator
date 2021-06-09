import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tablero } from './trello';

@Injectable({
  providedIn: 'root'
})
export class TrelloService {
    
  private appKey;
  private appTitle;
  private baseUrl;
  private authToken;

  constructor(private _http: HttpClient) {
    this.appKey = "fa469e740b7ec7fe2286bfefd1217e7a";
    this.appTitle = "TrelloTemplateCreatorApp";
    this.baseUrl = "https://api.trello.com/1/";
  }

  public obtenerEnlaceAutorizacion(): string {
    return "https://trello.com/1/authorize?expiration=1day&name=" + this.appTitle + "&scope=read,write&response_type=token&key=" + this.appKey;
  }

  public setToken(token: string){
    this.authToken = token;
  }

  public crearTablero(nombreTablero: string, token: string): Promise<Tablero>{
    var url = this.baseUrl + 'boards?key=' + this.appKey + '&token=' + token + '&name=' + nombreTablero + '&defaultLists=false';
    return this._http.post(url, {}).toPromise()
    .then(result => {
      return result as Tablero;
    }, error => {
      throw error;
    });
  }

  public crearLista(decTitle: string, idBoard: string, token: string): Promise<any> {
    var url = this.baseUrl + 'lists?key=' + this.appKey + '&token=' + token + '&name=' + decTitle + '&idBoard=' + idBoard;
    return this._http.post(url, {}).toPromise()
    .then(result => {
      return result;
    }, error => {
      throw error;
    });
  }

  CrearTarjeta(cardTitle: any, listaId: any, token: string): Promise<any> {
    var url = this.baseUrl + 'cards?key=' + this.appKey + '&token=' + token + '&name=' + cardTitle + '&idList=' + listaId;
    return this._http.post(url, {}).toPromise()
    .then(result => {
      return result;
    }, error => {
      throw error;
    });
  }
}
