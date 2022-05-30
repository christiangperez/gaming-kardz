export interface INFTItem {
  totalPrice: number;
  latestPrice: number;
  itemId: number;
  name: string;
  team: string;
  game: string;
  description: string;
  image: string;
  seller: string;
  price: number;
  onSale: boolean;
}

export interface IJsonCollection {
  beneficiary: string;
  nfts: Nft[];
}

export interface Nft {
  image: string;
  price: string;
  name: string;
  team: string;
  game: string;
  description: string;
}
