export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
  maxQuantity: number;
}

export enum CoinValue {
  TWO_EURO = 2.00,
  ONE_EURO = 1.00,
  FIFTY_CENT = 0.50,
  TWENTY_CENT = 0.20,
  TEN_CENT = 0.10
}

export interface Coin {
  value: CoinValue;
  name: string;
  emoji: string;
}
