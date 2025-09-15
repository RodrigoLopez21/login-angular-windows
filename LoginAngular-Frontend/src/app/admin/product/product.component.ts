import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentInit, AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ErrorService } from 'src/app/services/error.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterContentInit {


  listProduct: Product[] = []
  Pid: number = 0;
  Pname: string = '';
  Pdescription: string = '';
  CategoryId: number = 0;


  loading: boolean = false;

  constructor(
    private _productService: ProductService,
    private toastr: ToastrService,
    private router: Router,
    private _errorService: ErrorService
  ) { }

  
  ngOnInit(): void {
    this.getProducts()
    
  }

  ngAfterContentInit(): void {
    this.getProducts()

  }


  getProducts() {
    this._productService.getProducts().subscribe(data => {
      this.listProduct = data
    })
  }

  addProduct() {

    if (this.Pname == '' || this.Pdescription == '') {
      this.toastr.error('Todos los campos son obligatorios!', 'Error');
      return
    }

    const product: Product = {
      Pname: this.Pname,
      Pdescription: this.Pdescription,
      CategoryId: this.CategoryId
    }

    this.loading = true

    this._productService.register(product).subscribe({
      next: (v) => {
        this.loading = false
        this.toastr.success(`Producto ${this.Pname} fue registrado exitosamente", "Usuario Registrado`)
        this.router.navigate(['/dashboard/product/listProduct'])

      },
      error: (e: HttpErrorResponse) => {
        this.loading = false
        this._errorService.msgError(e)
      },
      complete: () => console.info('complete')
    })
  }


  updateProduct(productId: number,) {

    if (this.Pname == '') {
      this.toastr.error('Llena el nombre ', 'Error');
      return
    }

    const product: Product = {
      Pid: productId,
      Pname: this.Pname,
      Pdescription: this.Pdescription,
      CategoryId: this.CategoryId
    }

    this.loading = true

    this._productService.update(product).subscribe({
      next: (v) => {
        this.loading = false
        this.toastr.success(`Producto ${this.Pname} fue registrado actualizado", "Usuario Registrado`)
        this.router.navigate(['/dashboard/product/products'])

      },
      error: (e: HttpErrorResponse) => {
        this.loading = false
        this._errorService.msgError(e)
      },
      complete: () => {
        this.getProducts(),
          console.info('complete')
      }
    })
  }

  deleteProduct(productId: number) {
    console.log("Estoy aca" + productId);

    const product: Product = {
      Pid: productId
    }

    this.loading = true

    this._productService.delete(product).subscribe({
      next: (v) => {
        this.loading = false
        this.toastr.success(`Producto ${this.Pname} fue eliminado exitosamente", "Usuario Eliminado`)
        this.router.navigate(['/dashboard/product/listProduct'])
        this.getProducts()

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
