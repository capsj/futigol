import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {Supplier} from '../models/supplier-model';
import {PaginationModel} from "../../admin/suppliers/suppliers.component";

/*
Supplier routes
  POST        /api/supplier                                       controllers.SupplierController.register
  POST        /api/supplier/rate                                  controllers.SupplierController.rate
  GET         /api/supplier/id/:id                                controllers.SupplierController.getById(id: Long)
  GET         /api/supplier/username/:username                    controllers.SupplierController.getByUsername(username)
  GET         /api/supplier/email/:email                          controllers.SupplierController.getByEmail(email)
  GET         /api/supplier/all                                   controllers.SupplierController.getAll
  GET         /api/supplier/homepage                              controllers.SupplierController.getHomepageSuppliers
  GET         /api/supplier/nonhomepage                           controllers.SupplierController.getNonHomepageSuppliers
  GET         /api/supplier/homepage/add/:id                      controllers.SupplierController.addToHompage(id: Long)
  GET         /api/supplier/homepage/remove/:id                   controllers.SupplierController.removeFromHompage(id: Long)
  PUT         /api/supplier                                       controllers.SupplierController.update
  PUT         /api/supplier/image                                 controllers.SupplierController.updateImage
  DELETE      /api/supplier/:id                                   controllers.SupplierController.delete(id: Long)
*/

@Injectable()
export class SuppliersService {

  private _allSuppliersLoaded: boolean;
  private _suppliersById: Map<number, Supplier>;

  constructor(private http: HttpService) {
    this._allSuppliersLoaded = false;
    this._suppliersById = new Map();
  }

  get suppliers(): Promise<Supplier[]> {
    return this._allSuppliersLoaded ? Promise.resolve(this.allSuppliersToArray()) : this.requestSuppliers();
  }

  public getSupplierById(id: number): Promise<Supplier> {
    return this._suppliersById.get(id) ? Promise.resolve(this._suppliersById.get(id)) : this.requestSupplierById(id);
  }

  public getHomepageSuppliers(): Promise<Supplier[]> {
    return this.http
      .get('/api/supplier/homepage')
      .then(res => {
        return res.data as Supplier[];
      });
  }

  public getNonHomepageSuppliers(): Promise<Supplier[]> {
    return this.http
      .get('/api/supplier/nonhomepage')
      .then(res => {
        return res.data as Supplier[];
      });
  }

  public addSupplier(supplier: Supplier): Promise<Supplier> {
    return this.http
      .post('/api/supplier', supplier)
      .then(res => {
        this._suppliersById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public removeSupplierFromHomepage(id: number): Promise<any> {
    return this.http
      .get('/api/supplier/homepage/remove/'+id)
      .then(res => {
        return res.data;
      });
  }

  public addSupplierToHomepage(id: number): Promise<any> {
    return this.http
      .get('/api/supplier/homepage/add/'+id)
      .then(res => {
        return res.data;
      });
  }

  public updateSupplier(supplier: Supplier): Promise<Supplier> {
    if(this._suppliersById.get(supplier.id)) {
      return this.http
        .put('/api/supplier', supplier)
        .then(res => {
          this._suppliersById.set(supplier.id, res.data);
          return res.data;
        });
    } else {
      this.requestSupplierById(supplier.id).then(res => this.updateSupplier(supplier));
    }
  }

  public deleteSupplier(id: number): Promise<any> {
    return this.http.delete('/api/supplier/' + id)
      .then(res => {
        this._suppliersById.delete(id);
        return res;
      });
  }

  private allSuppliersToArray(): Supplier[] {
    return Array.from(this._suppliersById.values());
  }

  private requestSuppliers(): Promise<Supplier[]> {
    return this.http
      .get('/api/supplier/all')
      .then(res => {
        const suppliers = res.data as Supplier[];
        suppliers.forEach(supplier => this._suppliersById = this._suppliersById.set(supplier.id, supplier));
        this._allSuppliersLoaded = true;
        return this.allSuppliersToArray();
      });
  }

  private requestSupplierById(id: number): Promise<Supplier> {
    return this.http
      .get('/api/supplier/id/' + id)
      .then(res => {
        this._suppliersById.set(id,res.data);
        return res.data;
      });
  }

  private requestSupplierByName(name: string): Promise<Supplier> {
    return this.http
      .get('/api/supplier/name/' + name)
      .then(res => {
        this._suppliersById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public getPaginatedNonHomepageSuppliers(pagination: PaginationModel): Promise<any> {
    return this.http
      .post('/api/supplier/nonhomepage', pagination)
      .then(res => {
        return res.data;
      });
  }
}
