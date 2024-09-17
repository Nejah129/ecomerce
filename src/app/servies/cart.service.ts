import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  
  cartItems: CartItem[] = [];
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor() {}

  addToCart(theCartItem: CartItem) {
    let alredyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined;
    // if (this.cartItems.length > 0) {
    for (let temCartItem of this.cartItems) {
      if (temCartItem.id === theCartItem.id) {
        existingCartItem = temCartItem;
        console.log(this.cartItems);
        break;
      }
    }
    // existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );

    alredyExistInCart = existingCartItem != undefined;
    if (existingCartItem != undefined) {
      existingCartItem && existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    // }
    this.computeTotal();
  }
  computeTotal() {
    let totalPriceValue: number = 0; 
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }
    totalPriceValue= parseFloat(totalPriceValue.toFixed(2))
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    //this.logCartData(totalPriceValue, totalQuantityValue);
    // this.totalPriceValue.toFixed(2);

   

  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('content for the cart');
    for (let tempCartItem of this.cartItems) {
      let subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      // console.log("tempCartItem--------",this.cartItems)
      // console.log("subTotalPrice--------",subTotalPrice)
    }
    // console.log('9999999999999999999999999999999');
    // console.log(this.totalPrice);
    // console.log(this.totalQuantity);
  }

  minusQuantity(theCartItem: CartItem) {
    for (let tempCartItem of this.cartItems) {
      if (tempCartItem.id === theCartItem.id) {
        tempCartItem.quantity--;
      }
      this.computeTotal();
    }
  }
  plusQuantity(theCartItem: CartItem) {
    for (let tempCartItem of this.cartItems) {
      if (tempCartItem.id === theCartItem.id) {
        tempCartItem.quantity++;
      }
      this.computeTotal();
    }
  }
  deleteProductFromCart(theCartItem: CartItem) {
    this.cartItems = this.cartItems.filter((el) => el.id !== theCartItem.id);
    this.computeTotal()
    console.log(this.cartItems)
    console.log(theCartItem)
   
  }
}
