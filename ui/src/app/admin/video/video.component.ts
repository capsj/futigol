import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Video} from "../../shared/models/video-model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../shared/services/http.service";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  providers: [HttpService],
})
export class VideoComponent implements OnInit {

  public video: Video;
  public videoLoaded: boolean;
  public videoLoadError: boolean;
  public addingVideo: boolean;
  public videoChangeUrlError: boolean;
  public videoFormGroup: FormGroup;
  public videoUrl: string;
  public videoSuccess = false;
  public videoError = false;
  @ViewChild('fileInput') fileInput:ElementRef;

  constructor(public http: HttpService, public fb: FormBuilder) { }

  ngOnInit() {
    this.getVideo();
    this.videoLoaded = false;
    this.videoLoadError = false;
    this.addingVideo = false;
    this.videoChangeUrlError = false;
    this.createVideoFormControls();
    this.videoUrl = '';
  }

  getVideo(){
    this.http.get('/api/video').then(res => {
      this.video = Video.from(res.data);
      this.videoLoaded = true;
      this.videoLoadError = false;
    }).catch(() => {
      this.video = Video.empty();
      this.videoLoaded = true;
      this.videoLoadError = true;
    });
  }

  updateVideo(){
    this.videoLoaded = false;
    this.http.put('/api/video', {id: 1, url: this.videoUrl}).then(() => {
      this.video.url = this.videoUrl;
      this.videoLoaded = true;
      this.addingVideo = false;
      this.videoChangeUrlError = false;
      this.addingVideo = false;
      this.videoSuccess = true;
      setTimeout(() => {
        this.videoSuccess = false;
        this.videoUrl = '';
        this.fileInput.nativeElement.click()
      }, 3000);
    }).catch(() => {
      this.videoLoaded = true;
      this.videoChangeUrlError = true;
      this.videoError = true;
      setTimeout(() => {
        this.videoError = false;
      }, 3000);
    })
  }

  createVideoFormControls() {
    this.videoFormGroup = this.fb.group({
      url: ['', [Validators.required]],
    });
  }

}
