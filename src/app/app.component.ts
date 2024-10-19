import {
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { Product } from "./products/data-access/product.model";
import { CartItem, CartService } from "./products/data-access/cart.service";
import { ProductsService } from "./products/data-access/products.service";
import { Subscription } from "rxjs";
import { FormsModule } from "@angular/forms";

export interface CartProduct {
  code: string,
  name: string,
  price: number,
  qty: number,
  totalPrice: number
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, DialogModule, ButtonModule, TableModule, BadgeModule, FormsModule],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "ALTEN SHOP";
  visible: boolean = false;
  products!: Product[];
  cart!: CartProduct[];
  total: number = 0;
  subs: Subscription[] = [];
  productCount!: number;
  quantities: { [productCode: string]: number } = {};

  constructor(private cartService: CartService, private productService: ProductsService) { }

  showDialog() {
    this.visible = true;
  }

  ngOnInit(): void{
    this.subs.push(
      this.productService.get().subscribe((products:Product[]) => {
        this.products = products;
        this.mapCartProducts(this.cartService.getCartItems());
      })
    )
    this.subs.push(
      this.cartService.currentCart.subscribe((cartItems) => {
        this.mapCartProducts(cartItems);
      })
    );
  }

  deleteProduct(productCode: string): void {
    this.cartService.removeFromCart(productCode);
    const cartItems: CartItem[] = this.cartService.getCartItems();
    this.total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  onQtyChange(productCode: string, qty: number): void {
    console.log(productCode + ' '+ qty)
    this.cartService.addToCart(productCode, qty, (this.products.find(p => p.code == productCode) as Product).price)
  }

  mapCartProducts(cartItems: CartItem[]): void {
    this.cart = [];
    cartItems.forEach(item => {
      let product: Product = this.products.find(p => p.code == item.productCode) as Product;
      this.cart.push({code: product.code, name: product.name, price: product.price, qty: item.qty, totalPrice: product.price * item.qty});
      this.total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
      this.quantities[product.code] = item.qty; 
    });
    this.productCount = cartItems.length;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
