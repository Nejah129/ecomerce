import { ProductService } from './../../servies/product.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  constructor(private router: Router,private productService: ProductService) {}
  doSearch(value: string) {
    this.productService.updateKeyword(value); // Update the keyword in the shared service
    this.router.navigateByUrl(`/search/${value}`);
  }
  onSubmit(event: Event,value: string): void {
    event.preventDefault(); 
    this.doSearch(value);
    console.log('Form submission prevented  value', value);
  }

}
