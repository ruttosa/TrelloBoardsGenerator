import { Component, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { TrelloService } from '../services/trello.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SpotifyService } from '../services/spotify.service';
import { Album, Artista } from '../services/spotify';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class HomeComponent {

  private fileToUpload: File = null;
  private baseUrl: string;

  faShieldAlt = faShieldAlt;
  faCircle = faCircle;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public showBusy = false;
  public dashboardTitle: string;
  public showKeyInput: boolean = false;
  public artists: Artista[];
  public authorizationToken: string;
  public artistSelected: Artista;
  public artistAlbums: Album[];

  constructor(private _http: HttpClient,
              private _trelloService: TrelloService,
              private _spotifyService: SpotifyService,
              private _formBuilder: FormBuilder,
              @Inject('BASE_URL') _baseUrl: string) {
    this.baseUrl = _baseUrl;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.firstFormGroup = this._formBuilder.group({
      dashboardTitle: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  public loadFile(fileInput) {
    this.fileToUpload = fileInput.files[0];
    document.getElementById(fileInput.id).nextElementSibling.innerHTML = this.fileToUpload.name;
  }

  public sendFile() {
    this.showBusy = true;
    var self = this;
    // Convert file to Base64 and send
    const reader = new FileReader();
    reader.readAsDataURL(this.fileToUpload);
    reader.onload = function () {
      console.log(reader.result);
      const data = {
        dashboardTitle: self.dashboardTitle,
        file: reader.result
      }
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      self._http.post(self.baseUrl + 'discography', data, { headers }).subscribe(result => {
        self.showBusy = false;
        alert("Job finished");
      }, error => {
        self.showBusy = false;
        console.error(error)
      });
    };
    reader.onerror = function (error) {
      self.showBusy = false;
      console.log('Error: ', error);
    };
  }

  public uploadFile(inputFile) {
    var selectedFile = inputFile[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result.toString().trim();
      var linesArray = text.split(/[\r\n]+/);
      linesArray.forEach(line => {
        const lineSeparator = line.indexOf(" ");
        const year = line.substring(0, lineSeparator - 1);
        if (year.length === 4) {
          const title = line.substring(lineSeparator, line.length - lineSeparator);
          
        }
        else {
          console.log("formato datos de año incorrecto en la lína:  " + line.toString())
        }
      })

    }
    
    reader.readAsText(selectedFile);
  }

  public solicitarAutorizacion(){
    this.showKeyInput = true;
    window.open(this._trelloService.obtenerEnlaceAutorizacion(), "_blank");
  }

  public buscarArtista(){
    if(this.dashboardTitle != undefined){
      this._spotifyService.searchArtist(this.dashboardTitle).then(searchResult => {
        this.artists = searchResult;
        this.artistAlbums = null;
      });
    }
  }

  public getArtistImageUrl(artist: Artista, size: string): string {
    if (artist.images.length > 0) {
      var art;
      switch (size) {
        case "sm":
          art = artist.images.filter(a => a.width <= 64)[0];
          break;
        case "md":
          art = artist.images.filter(a => a.width > 64 && a.width <= 200)[0];
          break;
        case "lg":
          art=  artist.images.filter(a => a.width > 200 && a.width <= 640)[0];
          break;
        case "xl":
          art = artist.images.filter(a => a.width > 640 && a.width <= 1000)[0];
          break;
        default:
          art = artist.images[0];
          break;
      }
      if (!art) {
        return artist.images[0].url;
      }
      return art.url;
    }
    return "../../assets/images/grey-block.png";
  }

  public seleccionarArtista(artist: Artista){
    this.artistAlbums = null;
    if(this.artistSelected){
      if(this.artistSelected.id == artist.id){
        this.artistSelected = null;
        return;
      }
    }
    this.artistSelected = artist;
    // cargar albumes del artista
    this.obtenerAlbumesArtista(this.artistSelected);
  }

  public isSelectedArtist(artistId: string){
    if(this.artistSelected){
      if(this.artistSelected.id == artistId){
        return true
      }
    }
    return false;
  }

  public obtenerAlbumesArtista(artist: Artista){
    this._spotifyService.getAlbumsByArtistId(artist.id).then(albums => {
      this.artistAlbums = albums;
    });
  }
}
