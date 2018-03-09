import {Component, OnInit, TemplateRef} from '@angular/core';
import {Image} from "../../shared/models/image-model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ImagesService} from "../../shared/services/images.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
  providers: [ImagesService],
})
export class ImagesComponent implements OnInit {

  public images: Image[];
  public sliderImages: Image[];
  public sliderImagesLoaded: boolean;
  public sliderImagesError: boolean;
  public imagesLoaded: boolean;
  public imagesLoadError: boolean;
  public errorRemovingImage: boolean;
  public maxSlidersImages: boolean;
  public addingImage: boolean;
  public addingNewImageError: boolean;
  public addingImageError: boolean;
  public maxImageResolution: boolean;
  public uploadingImage: boolean;
  public imageFormGroup: FormGroup;
  public imageUrl: string;
  public imageToDelete: Image;
  public imageToDeleteIndex: number;
  modalRef: BsModalRef;
  message: string;
  public imageSuccess = false;
  public imageError = false;
  public imageSizeWarning = false;

  constructor(public fb: FormBuilder, public imagesService: ImagesService, private modalService: BsModalService) {}

  ngOnInit() {
    this.sliderImages = [];
    this.getSliderImages();
    this.createImageFormControls();
    this.sliderImagesLoaded = false;
    this.sliderImagesError = false;
    this.imagesLoaded = false;
    this.imagesLoadError = false;
    this.errorRemovingImage = false;
    this.addingNewImageError = false;
    this.addingImage = false;
    this.addingImageError = false;
    this.maxSlidersImages = false;
    this.maxImageResolution = false;
  }

  getSliderImages(){
    this.imagesService.getSliderImages().then((images: Image[]) => {
      this.sliderImages = images;
      this.sliderImagesError = false;
      this.sliderImagesLoaded = true;
    }).catch(() => {
      this.sliderImagesError = true;
      this.sliderImagesLoaded = true;
    })
  }

  removeImageFromSlider(){
    this.imagesService.removeImageFromSlider(this.imageToDelete.id).then(() => {
      this.sliderImages.splice(this.imageToDeleteIndex,1);
      this.images.push(this.imageToDelete);
      this.errorRemovingImage = false;
    }).catch(() => this.errorRemovingImage = true)
  }

  addImageToSlider(image: Image, i: number){
    if(this.sliderImages.length < 8) {
      this.maxSlidersImages = false;
      this.imagesService.addImageToSlider(image.id).then(() => {
        this.sliderImages.push(image);
        this.images.splice(i, 1);
        this.addingImageError = false;
        if (this.sliderImages.length > 7 || this.images.length < 1) this.addingImage = false;
        this.imageToDelete = Image.empty();
        this.imageToDeleteIndex = undefined;
      }).catch(() => this.addingImageError = true);
    } else {
      this.maxSlidersImages = true;
    }
  }

  createImageFormControls() {
    this.imageFormGroup = this.fb.group({
      url: ['', [Validators.required]],
    });
  }

  onChange(event) {
    this.uploadingImage = true;
    let formData: FormData = new FormData;
    let file = event.srcElement.files[0];
    let img = document.createElement('img');
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      if (img.height > 720 && img.width > 1200 && file.size < 5000000) {
        this.maxImageResolution = false;
        // console.log(file);
        formData.append("file", file, file.name);
        formData.append("slider", "false");
        this.imagesService.jeroAddImage(formData)
          .then((res) => {
            console.log("Imagen subida.");
            this.sliderImages.push(res);
            this.uploadingImage = false;
            this.imageSuccess = true;
            setTimeout(()=>{
              this.imageSuccess = false;
            }, 3000)
          })
          .catch((err) => {
            this.uploadingImage = false;
            this.imageError = true;
            setTimeout(()=>{
              this.imageError = false;
            }, 3000)
          })
      } else {
        this.uploadingImage = false;
        this.imageSizeWarning = true;
        setTimeout(()=>{
          this.imageSizeWarning = false;
        }, 3000)
      }
    }
  };

  confirm(): void {
    this.modalRef.hide();
    this.removeImageFromSlider();
  }

  decline(): void {
    this.modalRef.hide();
    this.imageToDelete = Image.empty();
    this.imageToDeleteIndex = undefined;
  }

  openDeleteImageModal(template: TemplateRef<any>, image, i) {
    this.imageToDelete = image;
    this.imageToDeleteIndex = i;
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
  }

}
