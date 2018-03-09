import {Component, OnInit, TemplateRef} from '@angular/core';
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {Supplier} from "../../shared/models/supplier-model";
import {SuppliersService} from "../../shared/services/suppliers.service";
import {HttpService} from "../../shared/http.service";
import {Observable} from 'rxjs/Rx';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  providers: [SuppliersService, HttpService],
})
export class SuppliersComponent implements OnInit {

  public homepageSuppliers: Supplier[];
  public homepageSuppliersLoaded: boolean;
  public homepageSuppliersError: boolean;
  public nonHomepageSuppliersLoaded: boolean;
  public nonHomepageSuppliersError: boolean;
  public errorRemovingSupplier: boolean;
  public addingSupplier: boolean;
  public addingSupplierError: boolean;
  public maxSuppliersError: boolean;
  public supplierToDelete: Supplier;
  public supplierToDeleteIndex: number;
  public supplierSearchName: string;
  modalRef: BsModalRef;

  public paginatedPastBudgetObject: PaginationModel;
  public nonHomepageSuppliersPaginated: Supplier[];
  public currentPage: number;
  public numberOfPastPages: number[];
  private alive: boolean;

  constructor(public router: Router, public titleService: Title, public suppliersService: SuppliersService, private modalService: BsModalService) {}

  ngOnInit() {
    this.titleService.setTitle('Admin-Panel | Utile');
    this.homepageSuppliers = [];
    this.getHomepageSuppliers();
    this.homepageSuppliersLoaded = false;
    this.homepageSuppliersError = false;
    this.nonHomepageSuppliersLoaded = false;
    this.nonHomepageSuppliersError = false;
    this.errorRemovingSupplier = false;
    this.addingSupplier = false;
    this.addingSupplierError = false;
    this.maxSuppliersError = false;
    this.nonHomepageSuppliersPaginated = [];
    this.paginatedPastBudgetObject = new PaginationModel(0,5, []);
    this.getPaginatedNonHomepageSuppliers();
    this.currentPage = 1;
    this.supplierToDelete = Supplier.empty();
  }

  getHomepageSuppliers(){
    this.suppliersService.getHomepageSuppliers().then((suppliers: Supplier[]) => {
      console.log(suppliers);
      this.homepageSuppliers = suppliers;
      this.homepageSuppliersError = false;
      this.homepageSuppliersLoaded = true;
    }).catch(() => {
      this.homepageSuppliersError = true;
      this.homepageSuppliersLoaded = true;
    })
  }

  removeSupplierFromHomepage(){
    this.getPaginatedNonHomepageSuppliers();
    this.suppliersService.removeSupplierFromHomepage(this.supplierToDelete.id).then(() => {
      this.homepageSuppliers.splice(this.supplierToDeleteIndex,1);
      this.nonHomepageSuppliersPaginated.push(this.supplierToDelete);
      this.errorRemovingSupplier = false;
      this.supplierToDelete = Supplier.empty();
      this.supplierToDeleteIndex = undefined;
    }).catch(() => this.errorRemovingSupplier = true)
  }

  addSupplier(supplier: Supplier, i: number) {
    if (this.homepageSuppliers.length < 8) {
      this.maxSuppliersError = false;
      this.suppliersService.addSupplierToHomepage(supplier.id).then(() => {
        this.homepageSuppliers.push(supplier);
        this.nonHomepageSuppliersPaginated.splice(i, 1);
        this.addingSupplierError = false;
        if (this.homepageSuppliers.length > 7) this.addingSupplier = false;
      }).catch(() => this.addingSupplierError = true);
    }else {
      this.maxSuppliersError = true;
    }
  }

  //Pagination

  getPaginatedNonHomepageSuppliers(){
    this.numberOfPastPages = [];
    this.suppliersService.getPaginatedNonHomepageSuppliers(this.paginatedPastBudgetObject).then((data: any) => {
      this.nonHomepageSuppliersError = false;
      for(let i = 0; i < data.pages; i++){
        this.numberOfPastPages.push(i);
      }
      this.nonHomepageSuppliersPaginated = data.suppliers;
      this.nonHomepageSuppliersLoaded = true;
    }).catch(() => {
      this.nonHomepageSuppliersError = true;
      this.nonHomepageSuppliersLoaded = true;
    })
  }

  filterPaginatedPast(){
    const seconds = new Date().getMilliseconds();
    this.alive = true;
    Observable.interval(2000).takeWhile(() => this.alive).subscribe(() => {
      if(seconds >= new Date().getMilliseconds()-2000) this.alive = false;
      this.nonHomepageSuppliersLoaded = false;
      this.paginatedPastBudgetObject.filters = [];
      this.paginatedPastBudgetObject.filters.push({property: 'name', value: this.supplierSearchName});
      this.getPaginatedNonHomepageSuppliers();
    });
  }

  getNextPastPage(i: number){
    this.nonHomepageSuppliersLoaded = false;
    this.currentPage=i+1;
    this.paginatedPastBudgetObject.pageIndex = i;
    this.getPaginatedNonHomepageSuppliers();
  }

  //Modal

  confirm(): void {
    this.modalRef.hide();
    this.removeSupplierFromHomepage();
  }

  decline(): void {
    this.modalRef.hide();
    this.supplierToDelete = Supplier.empty();
    this.supplierToDeleteIndex = undefined;
  }

  openDeleteSupplierModal(template: TemplateRef<any>, supplier, i) {
    this.supplierToDelete = supplier;
    this.supplierToDeleteIndex = i;
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
  }
}

export class PaginationModel{

  static empty(): PaginationModel{
    return new PaginationModel(undefined, undefined, []);
  }
  constructor(public pageIndex: number, public pageSize: number, public filters: {}[]){}
}
