import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/product/product';
import { CategoryService } from '../../core/category-service/category-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  categories: Category[] = [];
  categoryName = '';
  menuOpen = true;

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

  //Navegación del menú
  perfil(){
    this.router.navigate(['/perfil']);
  }

  ventas(){
    this.router.navigate(['/ventas']);
  }

  inicio(){
    this.router.navigate(['/cobro']);
  }

  caja(){
    this.router.navigate(['/caja']);
  }

  clientes(){
    this.router.navigate(['/cliente']);
  }

  compras(){
    this.router.navigate(['/compras']);
  }

  facturas(){
    this.router.navigate(['/facturas']);
  }

  productos(){
    this.router.navigate(['/productos']);
  }

  categorias(){
    this.router.navigate(['/categorias'])
  }

  reportes(){
    this.router.navigate(['/reportes']);
  }

  usuarios(){
    this.router.navigate(['/usuarios']);
  }
}
