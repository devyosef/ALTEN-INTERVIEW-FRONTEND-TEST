import { Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from "@angular/common";
import { CartService } from "app/products/data-access/cart.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from "@angular/forms";
import { PaginatorModule } from 'primeng/paginator';
import { InputNumberModule } from 'primeng/inputnumber';
import { Subscription } from "rxjs";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, ChipModule, CommonModule, ToastModule, InputTextModule, FormsModule, PaginatorModule],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private readonly messageService = inject(MessageService);
  private readonly cartService = inject(CartService);

  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedData: Product[] = [];
  quantities: { [productCode: string]: number } = {};
  subs: Subscription[] = [];

  addToCart(productCode: string, price: number): void {
    const qty = this.quantities[productCode] || 1;
    this.cartService.addToCart(productCode, qty, price);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cart updated successfully !' });
    this.quantities[productCode] = 1;
  }

  public readonly products = this.productsService.products;
  filteredData: Product[] = [];

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  ngOnInit() {
    this.subs.push(
      this.productsService.get().subscribe((products) => {
        this.filteredData = products;
        this.filteredData.forEach(product => {
          this.quantities[product.code] = 1; 
        });
        this.updatePaginatedData();
      })
    );
  }

  public getInventoryStatusColor(status: string): string {
    switch (status) {
      case 'INSTOCK':
        return 'green';
      case 'LOWSTOCK':
        return 'orange';
      default:
        return 'red';
    }
  }

  filterList(): void {
    this.filteredData = this.products().filter(p => p.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.updatePaginatedData();
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
