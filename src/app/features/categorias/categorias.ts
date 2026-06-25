import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/product/product';
import { CategoryService } from '../../core/category-service/category-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  categories: Category[] = [];
  categoryName = '';
  menuOpen = false;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ){}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(){
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  saveCategory(){
    if(!this.categoryName.trim()) return;

    this.categoryService.addCategory(this.categoryName).subscribe(newCat => {
      this.categories = [newCat, ...this.categories];
      this.categoryName = '';
    })
  }

  deleteCategory(id: number){
    if(confirm('¿Eliminar categoría?')){
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.categories = this.categories.filter(c => c.id !== id);
      });
    }
  }
}
