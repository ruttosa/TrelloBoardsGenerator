import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { runTest } from 'tslint/lib/test';
import { Album, Artista } from './spotify';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private spotifyToken: string;
  private spotifyTokenType: string;

  constructor(private _http: HttpClient) { 
    this.authorize();
    //this.auth();
  }

  public searchArtist(artistName: string): Promise<Artista[]>{
    const authUrl = "https://api.spotify.com/v1/search?q=" + artistName + "&type=artist";

    const headers = new HttpHeaders({ 
      'Authorization': this.spotifyTokenType + ' ' + this.spotifyToken
    });

    return this._http.get(authUrl, {headers}).toPromise()
    .then(res => {
      return res  ['artists'].items as Artista[];
    })
    .catch(err =>{
      console.log(err);
      return null;
    })
  }
  public getAlbumsByArtistId(artistId: string): Promise<Album[]>{
    const authUrl = "https://api.spotify.com/v1/artists/" + artistId + "/albums?limit=50&include_groups=album";

    const headers = new HttpHeaders({ 
      'Authorization': this.spotifyTokenType + ' ' + this.spotifyToken
    });

    return this._http.get(authUrl, {headers}).toPromise()
    .then(res => {
      return res['items'] as Album[];
    })
    .catch(err =>{
      console.log(err);
      return null;
    })
  }

  private auth(){    
    this._http.get("http://localhost:5000/Discography").subscribe(result => {
      this.spotifyToken = result as string;
      this.spotifyTokenType = "Bearer";
    }, error => {
      console.error(error)
    });
  }

  private authorize(){
    const authUrl = "https://accounts.spotify.com/api/token";

    const headers = new HttpHeaders({ 
      'Authorization': 'Basic ZDc0MmM2Mjg0MGU5NGU0MDliZjc3MzM1MDkyNDI2YzY6MGRlODcwZDQ0MTlkNDBkNWFiMGYwMWNlZDg2YzY2MDY', 
      'Content-Type': 'application/x-www-form-urlencoded'     
    });
    let params: any = {
      grant_type: 'client_credentials'
    };
    // Encodes the parameters.  
    let body: string = this.encodeParams(params);

    this._http.post(authUrl, body.toString(), {headers}).subscribe(result => {
      this.spotifyToken = result['access_token'];
      this.spotifyTokenType = result['token_type'];
    }, error => {
      console.error(error)
    });
  }

  private encodeParams(params: any): string {
    let body: string = '';
    for (let key in params) {
        if (body.length) {
            body += '&';
        }
        body += key + '=';
        body += encodeURIComponent(params[key]);
    }

    return body;
  }

}
