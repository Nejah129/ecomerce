import { EmailSenderService } from './../../servies/email-sender.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgSelectModule,
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
} from '@ng-select/ng-select';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormService } from '../../servies/form.service';
import { MenuItem, MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { GeoNamesService } from '../../servies/geo-names.service';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../servies/cart.service';
import {
  BillingAddress,
  CheckoutSubmit,
  City,
  createBillingAddressFromCity,
  createShippingAddressFromCity,
  CreditCardDetails,
  Customer,
  ShippingAddress,
} from '../../common/checkout-submit';
import { HttpClient } from '@angular/common/http';
import { Email } from '../../common/email';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    StepsModule,
    ToastModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [MessageService],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup | any;
  cartItems: CartItem[] = [];
  totalQuantity: number = 0;
  totalPrice: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  startMonth: number = new Date().getMonth() + 1;
  items: MenuItem[] | undefined;

  activeIndex: number = 0;
  countries: any[] = [];
  states: any[] = [];
  selectedCityShippingAddress!: City;
  selectedCityBillingAddress!: City;
  email: Email = new Email('', '', '');
  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    public messageService: MessageService,
    private geoNamesService: GeoNamesService,
    private cartService: CartService,
    private http: HttpClient,
    private emailSenderService: EmailSenderService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      }),
      shippingAddress: this.formBuilder.group({
        shippingStreet: ['', Validators.required],
        shippingCity: ['', Validators.required],
        shippingState: ['', Validators.required],
        shippingCountry: ['', Validators.required],
        shippingPosteCode: ['', Validators.required],
      }),
      billingAddress: this.formBuilder.group({
        billingStreet: ['', Validators.required],
        billingCity: ['', Validators.required],
        billingState: ['', Validators.required],
        billingCountry: ['', Validators.required],
        billingPosteCode: ['', Validators.required],
      }),
      creditCard: this.formBuilder.group({
        cardType: ['', Validators.required],
        nameOnCard: ['', Validators.required],
        cardNumber: ['', Validators.required],
        securityCode: ['', Validators.required],
        expirationMonth: ['', Validators.required],
        expirationYear: ['', Validators.required],
      }),
    });
    this.getCreditCardMonth();
    this.getCreditCardYear();
    this.items = [
      { label: 'Customer Information' },
      { label: 'Shipping Address' },
      { label: 'Billing Address' },
      { label: 'Credit Card Details' },
      { label: 'Review Your Order' },
    ];
    this.getCountries();
    this.getAllProductsFromCartDetails();
  }
  onSubmit(): void {

    this.selectedCityShippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value.shippingCity;
    this.selectedCityBillingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value.billingCity;
    console.log(this.selectedCityBillingAddress);
    console.log(this.selectedCityShippingAddress);
    if (!this.selectedCityShippingAddress) {
      console.error('City must be selected.');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a city before submitting the form.',
      });
      return;
    }

    try {
      const customer = this.checkoutFormGroup.get('customer')
        ?.value as Customer;

      const shippingAddress: ShippingAddress = createShippingAddressFromCity(
        this.selectedCityShippingAddress as City
      );
      shippingAddress.shippingPosteCode =
        this.checkoutFormGroup.controls[
          'shippingAddress'
        ].value.shippingPosteCode;
      shippingAddress.shippingState =
        this.checkoutFormGroup.controls['shippingAddress'].value.shippingStreet;
      const billingAddress: BillingAddress = createBillingAddressFromCity(
        this.selectedCityBillingAddress as City
      );
      this.selectedCityBillingAddress =
        this.checkoutFormGroup.controls['billingAddress'].value.billingCity;
      billingAddress.billingPosteCode =
        this.checkoutFormGroup.controls[
          'billingAddress'
        ].value.billingPosteCode;
      billingAddress.billingStreet =
        this.checkoutFormGroup.controls['billingAddress'].value.billingStreet;
      const creditCard = this.checkoutFormGroup.get('creditCard')
        ?.value as CreditCardDetails;

      const checkoutData = new CheckoutSubmit(
        this.cartItems,
        customer,
        shippingAddress,
        billingAddress,
        creditCard
      );
     
      console.log('checkoutData', checkoutData);
      // console.log(this.email);
      this.formService.submitOrder(checkoutData).subscribe(
        (response) => {
          if (response.error) {
            console.error('Error submitting order', response.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Submission Error',
              detail: response.error,
            });
          } else {
            console.log('Order submitted successfully', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Order submitted successfully!',
            });
          
          }
          // Send the confirmation email
          this.email.to = this.checkoutFormGroup.controls['customer'].value.email;
          this.email.subject = 'A Success Confirmation to By Stuff from Our Store';
          this.email.text = ` you will recive your order of ${this.totalQuantity} for this price ${this.totalPrice} in the next two days`;
          console.log('555555555555555555');
          this.emailSenderService.sendEmail(this.email).subscribe(
            (emailResponse) => {
              console.log('Email sent successfully', this.email);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Confirmation email sent successfully!',
              });
            },
            (emailError) => {
              console.error('Error sending email', emailError);
              this.messageService.add({
                severity: 'error',
                summary: 'Email Error',
                detail: 'There was an error sending the confirmation email.',
              });
            }
          );
        
      
        },
        (error) => {
          console.error('Error submitting order', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Submission Error',
            detail: 'There was an error submitting the order.',
          });
        }
      );
      this.emailSenderService.sendEmail(this.email);
          console.log(this.emailSenderService.sendEmail(this.email));
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  }

  copyShippingDetailsToBillingDetails(event: any) {
    if (event.target.checked) {
      // Use patchValue to update only the fields that should be copied
      this.checkoutFormGroup.controls['billingAddress'].patchValue({
        billingStreet:
          this.checkoutFormGroup.controls['shippingAddress'].value
            .shippingStreet,
        billingCity:
          this.checkoutFormGroup.controls['shippingAddress'].value.shippingCity,
        billingState:
          this.checkoutFormGroup.controls['shippingAddress'].value
            .shippingState,
        billingCountry:
          this.checkoutFormGroup.controls['shippingAddress'].value
            .shippingCountry,
        billingPosteCode:
          this.checkoutFormGroup.controls['shippingAddress'].value
            .shippingPosteCode,
      });
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }
  getCreditCardMonth() {
    this.formService
      .getCreditCardMonths()
      .subscribe((data) => (this.creditCardMonths = data));
  }
  getCreditCardYear() {
    this.formService
      .getCreditCardYears()
      .subscribe((x) => (this.creditCardYears = x));
  }
  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  goToNextStep() {
    if (this.isCurrentStepValid()) {
      this.activeIndex++;
    }
  }

  isCurrentStepValid(): boolean {
    return (
      this.checkoutFormGroup.get('customer').valid &&
      this.checkoutFormGroup.get('shippingAddress').valid &&
      this.checkoutFormGroup.get('billingAddress').valid &&
      this.checkoutFormGroup.get('creditCard').valid
    );
  }
  getFormGroup(name: string): FormGroup {
    return this.checkoutFormGroup.get(name) as FormGroup;
  }
  isFieldInvalid(group: string, field: string): any {
    const control = this.getFormGroup(group).get(field);

    return control?.invalid && (control.touched || control.dirty);
  }
  getCountries(): void {
    this.geoNamesService.getCountries().subscribe((data) => {
      // console.log(data)
      this.countries = data.geonames;
    });
  }
  onCountryChange(event: any): void {
    const countryId = event; // Adjust if necessary
    this.getStates(countryId);
  }

  getStates(countryCode: string): void {
    this.geoNamesService.getStates(countryCode).subscribe((data) => {
      this.states = data.geonames;
      console.log(data);
    });
  }
  getAllProductsFromCartDetails() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe((price) => {
      this.totalPrice = price;
      // this.totalPrice = Math.round(this.totalPrice* 100) / 100;
      this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
    });
    this.cartService.totalQuantity.subscribe((quantity) => {
      this.totalQuantity = quantity;
    });
    console.log(this.cartItems);
  }
}
