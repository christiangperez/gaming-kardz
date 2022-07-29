export interface INFTItem {
  totalPrice: number;
  latestPrice: number;
  tokenId: number;
  name: string;
  team: string;
  game: string;
  description: string;
  image: string;
  seller: string;
  price: number;
  onSale: boolean;
}
export interface Nft {
  image: string;
  price: string;
  name: string;
  team: string;
  game: string;
  description: string;
}

export interface IJsonCollection {
  collectionOwner: string;
  earnsPercentage: number;
  imagesUploaded: boolean;
  nfts: Nft[];
}
