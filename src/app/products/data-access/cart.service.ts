import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productCode: string;
  qty: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private storageKey = 'cart_items';
  cart = new BehaviorSubject<CartItem[]>([]);
  currentCart = this.cart.asObservable();

  private loadCartItems(): CartItem[] {
    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  }

  private saveCartItems(cartItems: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cartItems));
  }

  addToCart(productCode: string, qty: number, price: number): void {
    const cartItems = this.loadCartItems();
    const existingItem = cartItems.find(item => item.productCode == productCode);
    if (existingItem) {
      existingItem.qty = qty;
    } else {
      cartItems.push({ productCode, qty, price });
    }
    this.saveCartItems(cartItems);
    this.cart.next(this.getCartItems());
  }

  getCartItems(): CartItem[] {
    return this.loadCartItems();
  }

  removeFromCart(productCode: string): void {
    let cartItems = this.loadCartItems();
    cartItems = cartItems.filter(item => item.productCode !== productCode);
    this.saveCartItems(cartItems);
    this.cart.next(this.getCartItems());
  }
}
