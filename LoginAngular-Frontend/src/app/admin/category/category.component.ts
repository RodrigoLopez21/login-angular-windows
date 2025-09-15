import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {


  listCategory: Category[] = []
  
  id: number = 0;
  name: string = '';
  description: string = '';
  categoryId?: number = 0;

  selectCategory(category: Category) {
    // Set form values
    this.formCategoryUpdate.patchValue({
      name: category.Cname,
      description: category.Cdescription
    });
  
    // Optionally, you can also update other properties
    this.categoryId = category.Cid;
  }
  

  loading: boolean = false;

  formCategory: FormGroup;
  formCategoryUpdate: FormGroup;

  constructor(
    private _categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router,
    private _errorService: ErrorService,
    private form: FormBuilder
  ) {
    this.formCategory = this.form.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })
    this.formCategoryUpdate = this.form.group({
      name: ['', Validators.required],
      description: [this.name, Validators.required]
    })
  }

  ngOnInit(): void {
    this.readCategory()
  }

  private openModalId: string | null = null;

  openModal(cid: number) {
    this.openModalId = `updateCategoryModal-${cid}`;
  }

  closeModal(cid: number) {
    this.openModalId = null;
  }

  isModalOpen(cid: number): boolean {
    return this.openModalId === `updateCategoryModal-${cid}`;
  }


  readCategory() {
    this._categoryService.readCategory().subscribe(data => {
      console.log(data);

      this.listCategory = data
    })
  }

  createCategory(){
    if (this.formCategory.invalid) {
      this.toastr.error('Por favor, llena todos los campos requeridos', 'Error');
      return;
    }
    const category: Category = {
      Cname: this.formCategory.value.name,
      Cdescription: this.formCategory.value.description,
    };

    this.loading = true;

  this._categoryService.createCategory(category).subscribe({
    next: () => {
      this.loading = false;
      this.toastr.success(`Category ${category.Cname} fue registrado exitosamente`, 'Categoria Registrada');
      this.router.navigate(['/dashboard/category/listCategory']);
    },
    error: (e: HttpErrorResponse) => {
      this.loading = false;
      this._errorService.msgError(e);
    },
    complete: () => console.info('complete'),
  });
  }
  // createCategory() {
  //   this.formCategory = this.form.group({
  //     name: ['', Validators.required],
  //     description: ['', Validators.required]
  //   })
     

  //   const category: Category = {
  //     Cname: this.name,
  //     Cdescription: this.description,
  //   }
  //   console.log(category);
    

  //   this.loading = true

  //   this._categoryService.createCategory(category).subscribe({
  //     next: (v) => {
  //       this.loading = false
  //       this.toastr.success(`Category ${this.name} fue registrado exitosamente", "Categoria Registrado`)
  //       this.router.navigate(['/dashboard/category/listCategory'])
  //     },
  //     error: (e: HttpErrorResponse) => {
  //       this.loading = false
  //       this._errorService.msgError(e)
  //     },
  //     complete: () => console.info('complete')
  //   })
  // }



  updateCategory(form: any, categoryId: number) {

    if (form.valid) {
      console.log(this.formCategoryUpdate);
    }

    if (this.formCategoryUpdate.invalid) {
      this.toastr.error('Por favor, llena todos los campos requeridos', 'Error');
      return;
    }

    const category: Category = {
      Cid: categoryId,
      Cname: this.formCategoryUpdate.value.name,
      Cdescription: this.formCategoryUpdate.value.description,
    };


    
   this.loading = true;

  this._categoryService.updateCategory(category).subscribe({
    next: () => {
      this.loading = false;
      this.toastr.success(`Category ${category.Cname} fue actualizado exitosamente`, 'Categoria Actualizada');
      this.readCategory(); // Refresca la lista de categorías
    },
    error: (e: HttpErrorResponse) => {
      this.loading = false;
      this._errorService.msgError(e);
    },
    complete: () => console.info('complete'),
  });
  }

  deleteCategory(categoryId: number) {

    const category: Category = {
      Cid: categoryId
    }

    this.loading = true

    this._categoryService.deleteCategory(category).subscribe({
      next: (v) => {
        this.loading = false
        this.toastr.success(`Categoria ${this.name} fue eliminado exitosamente", "Categoria Eliminado`)
        this.router.navigate(['/dashboard/category/listCategory'])
        this.readCategory()

      },
      error: (e: HttpErrorResponse) => {
        this.loading = false
        this._errorService.msgError(e)
      },
      complete: () => {
        this.loading = false
        console.info('complete')
      }
    })
  }
}
