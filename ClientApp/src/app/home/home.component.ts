import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css'], 
  animations: [NgxLoadingModule.forRoot({})]
})
export class HomeComponent {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public showBusy = false;
  public dashboardTitle: string;
  private fileToUpload: File = null;
  private http: HttpClient;
  private baseUrl: string;

  constructor(_http: HttpClient, @Inject('BASE_URL') _baseUrl: string) {
    this.http = _http;
    this.baseUrl = _baseUrl;
  }

  public loadFile(inputFile) {
    this.fileToUpload = inputFile[0];
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
      self.http.post(self.baseUrl + 'discography', data, { headers }).subscribe(result => {
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
}
