import { CartItem } from './cart-item';

export interface Customer {
  id?: number; // Added id for completeness, based on your backend response
  firstName: string;
  lastName: string;
  email: string;
  orders?: any; // Optional, adjust as per your requirements
}

export interface ShippingAddress {
  shippingCountry: string;
  shippingCity: string;
  shippingStreet: string;
  shippingState: string;
  shippingPosteCode: string;
}

export interface BillingAddress {
  billingCountry: string;
  billingCity: string;
  billingStreet: string;
  billingState: string;
  billingPosteCode: string;
}

export interface CreditCardDetails {
  cardType: string;
  nameOnCard: string;
  cardNumber: string;
  securityCode: string;
  expirationMonth: string;
}

export interface City {
  adminCode1: string;
  lng: string;
  geonameId: number;
  toponymName: string;
  countryId: string;
  fcl: string;
  population: number;
  countryCode: string;
  name: string;
  fclName: string;
  adminCodes1: {
    ISO3166_2: string;
  };
  countryName: string;
  fcodeName: string;
  adminName1: string;
  lat: string;
  fcode: string;
}

export class CheckoutSubmit {
  constructor(
    public cartItems: CartItem[],
    public customer: Customer,
    public shippingAddress: ShippingAddress,
    public billingAddress: BillingAddress,
    public creditCardDetails: CreditCardDetails
  ) {}
}

export function createShippingAddressFromCity(city: City): ShippingAddress {
  if (!city) {
    throw new Error('City object is required to create a ShippingAddress.');
  }

  return {
    shippingCountry: city.countryName || 'Unknown Country', 
    shippingCity: city.name || 'Unknown City',              
    shippingStreet: '', 
    shippingState: city.adminName1 || 'Unknown State', 
    shippingPosteCode: '', 
  };
}

export function createBillingAddressFromCity(city: City): BillingAddress {
  if (!city) {
    throw new Error('City object is required to create a BillingAddress.');
  }

  return {
    billingCountry: city.countryName || 'Unknown Country',
    billingCity: city.name || 'Unknown City',
    billingStreet: '', // This should be set from form input, not from city
    billingState: city.adminName1 || 'Unknown State',
    billingPosteCode: '', // This should be set from form input, not from city
  };
}
