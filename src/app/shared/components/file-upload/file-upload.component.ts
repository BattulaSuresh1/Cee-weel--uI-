import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient,HttpEventType } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  @Input()
  requiredFileType:string;

  @Input() uploadType:string = "prescription";

  @Output()
  fileUploaded:EventEmitter<any> = new EventEmitter<any>();

  fileName = '';
  uploadProgress:number;
  uploadSub: Subscription;

  constructor(private http:HttpClient) {}

  ngOnInit(){

  }

  onFileSelected(event) {
      const file:File = event.target.files[0];
    
      if (file) {
          this.fileName = file.name;
          const formData = new FormData();
          formData.append("file", file);
          formData.append("uploadType", this.uploadType);

          let REST_API_SERVER:string = `${environment.REST_API_URL}/api/${environment.version}`;

          const upload$:any = this.http.post(`${REST_API_SERVER}/prescription-attachments`, formData, {
              reportProgress: true,
              observe: 'events'
          })
          .pipe(
              finalize(() => {
                this.reset();
              })
              );
              
            this.uploadSub = upload$.subscribe(event => {
              // console.log(event)
                this.fileUploaded.emit(event.body.data);
            // if (event.type == HttpEventType.UploadProgress ) {
            //   this.uploadProgress = Math.round(100 * (event.loaded / event.total));
            // }
          })
      }
  }

update() {
  this.fileUploaded.emit('Murali');
}

cancelUpload() {
  this.uploadSub.unsubscribe();
  this.reset();
}

reset() {
  this.uploadProgress = null;
  this.uploadSub = null;
}

}
