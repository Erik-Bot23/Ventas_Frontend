import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/interfaces/product/product';
import { CategoryService } from '../../core/service/category-service/category-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { HasPermissionDirectives } from '../../core/routes/directives/has-permission-directives';
import { AuthService } from '../../core/service/auth-service/auth-service';
// Servicio compartido del sidebar
import { SidebarService } from '../../core/service/sidebar-service/sidebar-service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, HasPermissionDirectives],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  categories: Category[] = [];
  categoryName = '';
  // ANTES: menuOpen = false aqui. AHORA: se elimino, se usa sidebar.menuOpen

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    public auth: AuthService,
    public sidebar: SidebarService
  ){}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(){
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  // ANTES: toggleMenu() controlaba menuOpen local.
  // AHORA: el sidebar maneja el estado via servicio compartido

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
