import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-cobro',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './cobro.html',
  styleUrl: './cobro.css',
})
export class Pagos implements OnInit {


  ngOnInit(): void {
    
  }

}
