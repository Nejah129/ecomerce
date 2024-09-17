export class Product {
  constructor(
    public id:number,
    public sku: string,
    public name: string,
    public description: string,
    public unitPrice: number,
    public imgUrl: string,
    public active: boolean,
    public unitStock: number,
    public dateCreated: Date,
    public lastUpdate: Date,
   
  ) {}
}
export interface PaginatedProductResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  products: Product[];
}