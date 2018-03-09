import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {Image} from '../models/image-model';

/*
Image routes
  GET         /api/image/all                                      controllers.ImageController.getAll
  POST        /api/image/slider                                   controllers.ImageController.registerSliderImage
  POST        /api/image/supplier                                 controllers.ImageController.saveOrUpdateSupplierImage
  GET         /api/image/id/:id                                   controllers.ImageController.getById(id: Long)
  GET         /api/image/slider                                   controllers.ImageController.getSliderImages
  GET         /api/image/slider/add/:id                           controllers.ImageController.addToSlider(id: Long)
  GET         /api/image/slider/remove/:id                        controllers.ImageController.removeFromSlider(id: Long)
  DELETE      /api/image/:id                                      controllers.ImageController.delete(id: Long)
*/

@Injectable()
export class ImagesService {

  private _allImagesLoaded: boolean;
  private _imagesById: Map<number, Image>;

  constructor(private http: HttpService) {
    this._allImagesLoaded = false;
    this._imagesById = new Map();
  }

  get images(): Promise<Image[]> {
    return this._allImagesLoaded ? Promise.resolve(this.allImagesToArray()) : this.requestImages();
  }

  public getImageById(id: number): Promise<Image> {
    return this._imagesById.get(id) ? Promise.resolve(this._imagesById.get(id)) : this.requestImageById(id);
  }

  public getSliderImages(): Promise<Image[]> {
    return this.http
      .get('/api/image/slider')
      .then(res => {
        return res.data as Image[];
      });
  }

  public getNonSliderImages(): Promise<Image[]> {
    return this.http
      .get('/api/image/slider/not')
      .then(res => {
        return res.data as Image[];
      });
  }

  public addImage(url: string): Promise<Image> {
    return this.http
      .post('/api/image/slider', {id: undefined, path: url, slider: true, supplier: false})
      .then(res => {
        this._imagesById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public jeroAddImage(data: FormData): Promise<Image> {
    return this.http
      .jeroPost('/api/image/slider', data)
      .then(res => {
        return res.data;
      });
  }

  public removeImageFromSlider(id: number): Promise<any> {
    return this.http
      .get('/api/image/slider/remove/'+id)
      .then(res => {
        return res.data;
      });
  }

  public addImageToSlider(id: number): Promise<any> {
    return this.http
      .get('/api/image/slider/add/'+id)
      .then(res => {
        return res.data;
      });
  }

  public saveOrUpdateSupplierImage(image: Image): Promise<Image> {
    if(this._imagesById.get(image.id)) {
      return this.http
        .post('/api/image/supplier', image)
        .then(res => {
          this._imagesById.set(image.id, res.data);
          return res.data;
        });
    } else {
      this.requestImageById(image.id).then(res => this.saveOrUpdateSupplierImage(image));
    }
  }

  public deleteImage(id: number): Promise<any> {
    return this.http.delete('/api/image/' + id)
      .then(res => {
        this._imagesById.delete(id);
        return res;
      });
  }

  private allImagesToArray(): Image[] {
    return Array.from(this._imagesById.values());
  }

  private requestImages(): Promise<Image[]> {
    return this.http
      .get('/api/image/all')
      .then(res => {
        const images = res.data as Image[];
        images.forEach(image => this._imagesById = this._imagesById.set(image.id, image));
        this._allImagesLoaded = true;
        return this.allImagesToArray();
      });
  }

  private requestImageById(id: number): Promise<Image> {
    return this.http
      .get('/api/image/id/' + id)
      .then(res => {
        this._imagesById.set(id,res.data);
        return res.data;
      });
  }
}
