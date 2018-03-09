import {Component, OnInit, TemplateRef} from '@angular/core';
import {CategoriesService} from "../../shared/services/categories.service";
import {Category} from "../../shared/models/category-model";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [CategoriesService]
})
export class CategoriesComponent implements OnInit {

  public unassignedCategories: Category[];
  public assignedCategories: Category[];
  public unassignedCategoriesLoaded: boolean;
  public unassignedCategoriesError: boolean;
  public assignedCategoriesLoaded: boolean;
  public assignedCategoriesLoadError: boolean;
  public errorUnassigningCategory: boolean;
  public assigningCategory: boolean;
  public assigningCategoryError: boolean;
  public categoryToDelete: Category;
  public categoryToDeleteIndex: number;
  modalRef: BsModalRef;

  constructor(public categoriesService: CategoriesService, private modalService: BsModalService) { }

  ngOnInit() {
    this.unassignedCategories = [];
    this.assignedCategories = [];
    this.getUnassignedCategories();
    this.getAssignedCategories();
    this.unassignedCategoriesLoaded = false;
    this.unassignedCategoriesError = false;
    this.assignedCategoriesLoaded = false;
    this.assignedCategoriesLoadError = false;
    this.errorUnassigningCategory = false;
    this.assigningCategory = false;
    this.assigningCategoryError = false;
  }

  getUnassignedCategories(){
    this.categoriesService.getUnassignedCategories().then((categories: Category[]) => {
      this.unassignedCategories = categories;
      this.unassignedCategoriesError = false;
      this.unassignedCategoriesLoaded = true;
    }).catch(() => {
      this.unassignedCategoriesError = true;
      this.unassignedCategoriesLoaded = true;
    })
  }

  getAssignedCategories(){
    this.categoriesService.getAssignedCategories().then((categories: Category[]) => {
      this.assignedCategories = categories;
      console.log(categories);
      this.assignedCategoriesLoadError = false;
      this.assignedCategoriesLoaded = true;
    }).catch(() => {
      this.assignedCategoriesLoadError = true;
      this.assignedCategoriesLoaded = true;
    })
  }

  removeCategoryFromHomepage(){
    this.categoriesService.unassignCategory(this.categoryToDelete.id).then(() => {
      this.assignedCategories.splice(this.categoryToDeleteIndex,1);
      this.unassignedCategories.push(this.categoryToDelete);
      this.errorUnassigningCategory = false;
      this.categoryToDelete = Category.empty();
      this.categoryToDeleteIndex = undefined;
    }).catch(() => this.errorUnassigningCategory = true)
  }

  assignCategory(category: Category, i: number){
    this.categoriesService.assignCategory(category.id).then(() => {
      this.assignedCategories.push(category);
      this.unassignedCategories.splice(i, 1);
      this.assigningCategoryError = false;
      if(this.assignedCategories.length > 7 || this.unassignedCategories.length < 1) this.assigningCategory = false;
    }).catch(() => this.assigningCategoryError = true);
  }

  //Modal

  confirm(): void {
    this.modalRef.hide();
    this.removeCategoryFromHomepage();
  }

  decline(): void {
    this.modalRef.hide();
    this.categoryToDelete = Category.empty();
    this.categoryToDeleteIndex = undefined;
  }

  openDeleteCategoryModal(template: TemplateRef<any>, category, i) {
    this.categoryToDelete = category;
    this.categoryToDeleteIndex = i;
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
  }

}
