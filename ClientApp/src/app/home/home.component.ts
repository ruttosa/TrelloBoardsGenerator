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
import { error } from 'selenium-webdriver';

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
  public processMessages: string[] = [];

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
      authorizationToken: ['', Validators.required]
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
        artist:self.artistSelected,
        albums:self.artistAlbums
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

  public group(){
    var albumsByDecade = this.groupBy(this.artistAlbums, 'release_date');
    var t = albumsByDecade;
  }

  public getDecadesFromYear(year: number): any {
    if (Number.isNaN(year) || (year.toString().length < 4) || (year.toString().length > 4)) {
        throw new Error('Date must be valid and have a 4-digit year attribute');
    }
    let start       = Number(`${year.toString()[2]}0`);
    let startIdx    = year.toString().substring(0, 2);
    let end         = 0;
    start           = (start === 0) ? Number(`${startIdx}00`) : Number(`${startIdx}${start}`);
    end             = start + 10;
    return { start: start, end: end };
  }
  
  public groupBy(xs, key){
    var _self = this;
      return xs.reduce(function(rv, x) {
        var decade =  _self.getDecadesFromYear(new Date(x[key]).getFullYear());
        (rv[decade.start] = rv[decade.start] || []).push(x);
        return rv;
      }, {});
  }

  public crearTablero(){

    // Crear Tablero en Trello con el nombre del artista
    this._trelloService.crearTablero(this.artistSelected.name, this.authorizationToken).then(tablero =>{

      var tableroId = tablero.id;
      this.processMessages.push("Tablero creado. Nombre del tablero: " + tablero.name);
      var albumsByDecade = this.groupBy(this.artistAlbums, 'release_date');
      Object.entries(albumsByDecade).forEach(decade => {
        var decTitle = decade[0] as string;
        var decAlbums = decade[1] as Array<any>;

        // Crear listas de décadas en tablero de Trello
        this._trelloService.crearLista(decTitle, tableroId, this.authorizationToken).then(lista =>{
          this.processMessages.push("Lista creada. Título de la lista: " + lista.name);
          decAlbums.forEach(album => {  
            // Crear tarjeta para cada albums
            this._trelloService.CrearTarjeta(album.name, lista.id, this.authorizationToken).then(tarjeta => {
              this.processMessages.push("Tarjeta creada. Album: " + tarjeta.name);
              var t = tarjeta;
            });
          });
        }, error => {
          throw error;
        });       
      });

    },error => {
      alert(error.status + ' ' + error.statusText + ' - ' + error.error.message);
    });

    


  }
}
