import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { INFTItem } from '../../interfaces/marketplaceInterfaces';

export type MarketTypes =
  | { type: 'setAccount'; payload: string }
  | { type: 'setContracts'; payload: { nft: any; marketplace: any } }
  | { type: 'setMarketplaceItems'; payload: INFTItem[] }
  | { type: 'setMyNFTsItems'; payload: INFTItem[] }
  | { type: 'setBalanceToClaim'; payload: string }
  | { type: 'loadingMarketplaceItems'; payload: boolean }
  | { type: 'loadingMyNFTsItems'; payload: boolean }
  | { type: 'loadingPurchaseItem'; payload: boolean }
  | { type: 'loadingSetItemOnSale'; payload: boolean }
  | { type: 'loadingActiveNFT'; payload: boolean }
  | { type: 'loadingNFTTransactions'; payload: boolean }
  | { type: 'loadingClaimEarns'; payload: boolean }
  | { type: 'loadingBalanceToClaim'; payload: boolean }
  | { type: 'setIsOwner'; payload: boolean }
  | { type: 'hideSnackbarTransactionResult' }
  | {
      type: 'showSnackbarTransactionResult';
      payload: {
        okStatus?: boolean;
        description?: string;
      };
    }
  | { type: 'setActiveNFT'; payload: INFTItem }
  | { type: 'setNFTTransactions'; payload: any[] }
  | { type: 'clearActiveNFT' }
  | {
      type: 'setEnqueueSnackbar';
      payload: (
        message: SnackbarMessage,
        options?: OptionsObject | undefined
      ) => SnackbarKey;
    };
