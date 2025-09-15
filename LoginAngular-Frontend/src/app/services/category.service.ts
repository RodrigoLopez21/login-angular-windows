import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environment';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private myAppUrl: string;
  private myAPIUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environments.endpoint
    this.myAPIUrl = 'api/category';
  }

  readCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.myAppUrl}${this.myAPIUrl}/read`);
  }

  createCategory(category: Category): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myAPIUrl}/create`, category);
  }

  updateCategory(category: Category): Observable<any> {    
    return this.http.patch(`${this.myAppUrl}${this.myAPIUrl}/update/${category.Cid}`, category);
  }
  
  deleteCategory(category: Category): Observable<any> {    
    return this.http.delete(`${this.myAppUrl}${this.myAPIUrl}/delete/${category.Cid}`);
  }
}
