import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { INFTItem } from '../../interfaces/marketplaceInterfaces';
import { MarketTypes } from '../actionTypes/MarketTypes';

interface IStateMarket {
  account: string;
  nftContract: any;
  marketplaceContract: any;
  marketplaceItems: INFTItem[];
  myNFTsItems: INFTItem[];
  activeNFT?: INFTItem | null;
  isOwner: boolean;
  transactionResult: {
    show: boolean;
    okStatus?: boolean;
    description?: string;
  };
  loadingMarketplaceItems: boolean;
  loadingMyNFTsItems: boolean;
  loadingPurchaseItem: boolean;
  loadingSetItemOnSale: boolean;
  loadingActiveNFT: boolean;
  enqueueSnackbar?: (
    message: SnackbarMessage,
    options?: OptionsObject | undefined
  ) => SnackbarKey;
}

const initialState: IStateMarket = {
  account: '',
  nftContract: {},
  marketplaceContract: {},
  marketplaceItems: [],
  myNFTsItems: [],
  activeNFT: null,
  isOwner: false,
  transactionResult: {
    show: false,
  },
  loadingMarketplaceItems: false,
  loadingMyNFTsItems: false,
  loadingPurchaseItem: false,
  loadingSetItemOnSale: false,
  loadingActiveNFT: false,
  enqueueSnackbar: undefined,
};

export const marketReducer = (
  state: IStateMarket = initialState,
  action: MarketTypes
) => {
  switch (action.type) {
    case 'setAccount':
      return {
        ...state,
        account: action.payload,
      };

    case 'setContracts':
      return {
        ...state,
        nftContract: action.payload.nft,
        marketplaceContract: action.payload.marketplace,
      };

    case 'setMarketplaceItems':
      return {
        ...state,
        marketplaceItems: action.payload,
      };

    case 'setMyNFTsItems':
      return {
        ...state,
        myNFTsItems: action.payload,
      };

    case 'loadingMarketplaceItems':
      return {
        ...state,
        loadingMarketplaceItems: action.payload,
      };

    case 'loadingMyNFTsItems':
      return {
        ...state,
        loadingMyNFTsItems: action.payload,
      };

    case 'loadingPurchaseItem':
      return {
        ...state,
        loadingPurchaseItem: action.payload,
      };

    case 'loadingSetItemOnSale':
      return {
        ...state,
        loadingSetItemOnSale: action.payload,
      };

    case 'loadingActiveNFT':
      return {
        ...state,
        loadingActiveNFT: action.payload,
      };

    case 'setIsOwner':
      return {
        ...state,
        isOwner: action.payload,
      };

    case 'showSnackbarTransactionResult':
      return {
        ...state,
        transactionResult: {
          ...state.transactionResult,
          ...action.payload,
          show: true,
        },
      };

    case 'hideSnackbarTransactionResult':
      return {
        ...state,
        transactionResult: {
          ...state.transactionResult,
          show: false,
        },
      };

    case 'setActiveNFT':
      return {
        ...state,
        activeNFT: action.payload,
      };

    case 'setEnqueueSnackbar':
      return {
        ...state,
        enqueueSnackbar: action.payload,
      };

    default:
      return state;
  }
};
