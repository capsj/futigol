import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {Category} from '../models/category-model';

/*
Category routes
  POST        /api/category                                       controllers.CategoryController.register
  GET         /api/category/all                                   controllers.CategoryController.getAll
  GET         /api/category/id/:id                                controllers.CategoryController.getById(id: Long)
  GET         /api/category/name/:name                            controllers.CategoryController.getByName(name)
  GET         /api/category/home                                  controllers.CategoryController.getHomeCategories
  PUT         /api/category                                       controllers.CategoryController.update
  DELETE      /api/category/:id                                   controllers.CategoryController.delete(id: Long)
*/

@Injectable()
export class CategoriesService {

  private _allCategoriesLoaded: boolean;
  private _categoriesById: Map<number, Category>;

  constructor(private http: HttpService) {
    this._allCategoriesLoaded = false;
    this._categoriesById = new Map();
  }

  get categories(): Promise<Category[]> {
    return this._allCategoriesLoaded ? Promise.resolve(this.allCategoriesToArray()) : this.requestCategories();
  }

  public getCategoryById(id: number): Promise<Category> {
    return this._categoriesById.get(id) ? Promise.resolve(this._categoriesById.get(id)) : this.requestCategoryById(id);
  }

  public getAssignedCategories(): Promise<Category[]> {
    return this.http
      .get('/api/category/home')
      .then(res => {
        return res.data as Category[];
      });
  }

  public getUnassignedCategories(): Promise<Category[]> {
    return this.http
      .get('/api/category/home/non')
      .then(res => {
        return res.data as Category[];
      });
  }

  public addCategory(category: Category): Promise<Category> {
    return this.http
      .post('/api/category', category)
      .then(res => {
        this._categoriesById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public unassignCategory(id: number): Promise<any> {
    return this.http
      .get('/api/category/home/remove/'+id)
      .then(res => {
        return res.data;
      });
  }

  public assignCategory(id: number): Promise<any> {
    return this.http
      .get('/api/category/home/add/'+id)
      .then(res => {
        return res.data;
      });
  }

  public updateCategory(category: Category): Promise<Category> {
    if(this._categoriesById.get(category.id)) {
      return this.http
        .put('/api/category', category)
        .then(res => {
          this._categoriesById.set(category.id, res.data);
          return res.data;
        });
    } else {
      this.requestCategoryById(category.id).then(res => this.updateCategory(category));
    }
  }

  public deleteCategory(id: number): Promise<any> {
    return this.http.delete('/api/category/' + id)
      .then(res => {
        this._categoriesById.delete(id);
        return res;
      });
  }

  private allCategoriesToArray(): Category[] {
    return Array.from(this._categoriesById.values());
  }

  private requestCategories(): Promise<Category[]> {
    return this.http
      .get('/api/category/all')
      .then(res => {
        const categories = res.data as Category[];
        categories.forEach(category => this._categoriesById = this._categoriesById.set(category.id, category));
        this._allCategoriesLoaded = true;
        return this.allCategoriesToArray();
      });
  }

  private requestCategoryById(id: number): Promise<Category> {
    return this.http
      .get('/api/category/id/' + id)
      .then(res => {
        this._categoriesById.set(id,res.data);
        return res.data;
      });
  }
}
