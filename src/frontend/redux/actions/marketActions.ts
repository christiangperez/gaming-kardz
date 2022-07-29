import { Dispatch } from 'react';
import { ethers } from 'ethers';
import { INFTItem } from '../../interfaces/marketplaceInterfaces';
import { MarketTypes } from '../actionTypes/MarketTypes';

export const loadMarketplaceItems = () => {
  return async (dispatch: Dispatch<MarketTypes>, getState: any) => {
    try {
      dispatch({ type: 'loadingMarketplaceItems', payload: true });

      const { nftContract, marketplaceContract, account } = getState().market;

      // Load all on sale items
      const itemCount = await marketplaceContract.itemCount();

      const items: INFTItem[] = [];

      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplaceContract.items(i);
        if (item.onSale && item.seller.toLowerCase() !== account) {
          // get uri url from nft contract
          const uri = await nftContract.tokenURI(item.tokenId);
          // use uri to fetch the nft metadata stored on ipfs
          const response = await fetch(uri);
          const metadata = await response.json();
          // get total price of item (item price + fee)
          const totalPrice = await marketplaceContract.getTotalPrice(
            item.tokenId
          );

          items.push({
            totalPrice,
            latestPrice: item.latestPrice,
            tokenId: item.tokenId,
            name: metadata.name,
            team: metadata.team,
            game: metadata.game,
            description: metadata.description,
            image: metadata.image,
            seller: item.seller,
            price: item.price,
            onSale: true,
          });
        }
      }

      dispatch({ type: 'setMarketplaceItems', payload: items });
      dispatch({ type: 'loadingMarketplaceItems', payload: false });
    } catch (error) {
      const { enqueueSnackbar } = getState().market;

      console.log('Exception error: ' + error, 'Exception');
      dispatch({ type: 'loadingMarketplaceItems', payload: false });
      enqueueSnackbar('Exception error: ' + error, { variant: 'error' });
    }
  };
};

export const loadMyNFTsItems = () => {
  return async (dispatch: Dispatch<MarketTypes>, getState: any) => {
    try {
      dispatch({ type: 'loadingMyNFTsItems', payload: true });

      const { nftContract, marketplaceContract, account } = getState().market;

      const itemCount = await marketplaceContract.itemCount();
      const listedItems: INFTItem[] = [];
      for (let indx = 1; indx <= itemCount; indx++) {
        const i = await marketplaceContract.items(indx);
        if (i.seller.toLowerCase() === account) {
          // get uri url from nft contract
          const uri = await nftContract.tokenURI(i.tokenId);
          // use uri to fetch the nft metadata stored on ipfs
          const response = await fetch(uri);
          const metadata = await response.json();
          // get total price of item (item price + fee)
          const totalPrice = await marketplaceContract.getTotalPrice(i.tokenId);

          const item = {
            totalPrice,
            latestPrice: i.latestPrice,
            tokenId: i.tokenId,
            name: metadata.name,
            team: metadata.team,
            game: metadata.game,
            description: metadata.description,
            image: metadata.image,
            seller: i.seller,
            price: i.price,
            onSale: i.onSale,
          };
          listedItems.push(item);
        }
      }

      dispatch({ type: 'setMyNFTsItems', payload: listedItems });
      dispatch({ type: 'loadingMyNFTsItems', payload: false });
    } catch (error) {
      const { enqueueSnackbar } = getState().market;

      console.log('Exception error: ' + error, 'Exception');
      dispatch({ type: 'loadingMyNFTsItems', payload: false });
      enqueueSnackbar('Exception error: ' + error, { variant: 'error' });
    }
  };
};

export const purchaseMarketplaceItem = (item: INFTItem) => {
  return async (dispatch: Dispatch<MarketTypes>, getState: any) => {
    try {
      dispatch({ type: 'loadingPurchaseItem', payload: true });

      const { nftContract, marketplaceContract, enqueueSnackbar } =
        getState().market;

      // Approve transaction needed
      await (
        await nftContract.setApprovalForAll(marketplaceContract.address, true)
      ).wait();

      await (
        await marketplaceContract.purchaseItem(item.tokenId, {
          value: item.totalPrice,
        })
      ).wait();

      enqueueSnackbar('The transaction has been sent', { variant: 'info' });

      dispatch({ type: 'loadingPurchaseItem', payload: false });
    } catch (error) {
      const { enqueueSnackbar } = getState().market;

      console.log('Exception error: ' + error, 'Exception');
      dispatch({ type: 'loadingPurchaseItem', payload: false });
      enqueueSnackbar('Exception error: ' + error, { variant: 'error' });
    }
  };
};

export const setItemOnSale = (item: INFTItem, price: any) => {
  return async (dispatch: Dispatch<MarketTypes>, getState: any) => {
    try {
      dispatch({ type: 'loadingSetItemOnSale', payload: true });

      const { marketplaceContract, enqueueSnackbar } = getState().market;

      if (price) {
        await (
          await marketplaceContract.setItemOnSale(
            item.tokenId,
            ethers.utils.parseEther(String(price))
          )
        ).wait();

        enqueueSnackbar('The transaction has been sent', { variant: 'info' });
      }

      dispatch({ type: 'loadingSetItemOnSale', payload: false });
    } catch (error) {
      const { enqueueSnackbar } = getState().market;

      console.log('Exception error: ' + error, 'Exception');
      dispatch({ type: 'loadingSetItemOnSale', payload: false });
      enqueueSnackbar('Exception error: ' + error, { variant: 'error' });
    }
  };
};

export const getContractOwner = () => {
  return async (dispatch: Dispatch<MarketTypes>, getState: any) => {
    try {
      const { marketplaceContract, account } = getState().market;

      const contractOwner = await marketplaceContract.getContractOwner();

      dispatch({
        type: 'setIsOwner',
        payload:
          (String(contractOwner).toLowerCase() === String(account).toLowerCase()) === true
      });
    } catch (error) {
      const { enqueueSnackbar } = getState().market;

      console.log('Exception error: ' + error, 'Exception');
      enqueueSnackbar('Exception error: ' + error, { variant: 'error' });
    }
  };
};

export const getNFTItem = (tokenId: any) => {
  return async (dispatch: Dispatch<MarketTypes>, getState: any) => {
    try {
      dispatch({ type: 'loadingActiveNFT', payload: true });

      const { nftContract, marketplaceContract } = getState().market;

      const i = await marketplaceContract.items(tokenId);

      // get uri url from nft contract
      const uri = await nftContract.tokenURI(i.tokenId);
      // use uri to fetch the nft metadata stored on ipfs
      const response = await fetch(uri);
      const metadata = await response.json();
      // get total price of item (item price + fee)
      const totalPrice = await marketplaceContract.getTotalPrice(i.tokenId);

      const item: INFTItem = {
        totalPrice,
        latestPrice: i.latestPrice,
        tokenId: i.tokenId,
        name: metadata.name,
        team: metadata.team,
        game: metadata.game,
        description: metadata.description,
        image: metadata.image,
        seller: i.seller,
        price: i.price,
        onSale: i.onSale,
      };

      dispatch({ type: 'setActiveNFT', payload: item });

      dispatch({ type: 'loadingActiveNFT', payload: false });
    } catch (error) {
      const { enqueueSnackbar } = getState().market;

      console.log('Exception error: ' + error, 'Exception');
      dispatch({ type: 'loadingActiveNFT', payload: false });
      enqueueSnackbar('Exception error: ' + error, { variant: 'error' });
    }
  };
};

export const loadNFTTransactions = (tokenId: number) => {
  return async (dispatch: Dispatch<MarketTypes>, getState: any) => {
    try {
      dispatch({ type: 'loadingNFTTransactions', payload: true });

      const { marketplaceContract } = getState().market;

      const filter = marketplaceContract.filters.Bought(
        tokenId,
        null,
        null,
        null,
        null,
        null
      );

      const results = await marketplaceContract.queryFilter(filter);

      const purchases = await Promise.all(
        results.map(async (i: any) => {
          // fetch arguments from each result
          const args = i.args;

          const purchasedItem = {
            totalPrice: args.totalPrice,
            price: args.price,
            tokenId: args.tokenId,
            seller: args.seller,
            buyer: args.buyer,
          };

          return purchasedItem;
        })
      );

      dispatch({ type: 'setNFTTransactions', payload: purchases });
      dispatch({ type: 'loadingNFTTransactions', payload: false });
    } catch (error) {
      const { enqueueSnackbar } = getState().market;

      console.log('Exception error: ' + error, 'Exception');
      dispatch({ type: 'loadingNFTTransactions', payload: false });
      enqueueSnackbar('Exception error: ' + error, { variant: 'error' });
    }
  };
};

export const claimEarns = () => {
  return async (dispatch: Dispatch<MarketTypes>, getState: any) => {
    try {
      dispatch({ type: 'loadingClaimEarns', payload: true });

      const { marketplaceContract, enqueueSnackbar } = getState().market;

      await marketplaceContract.claimEarns();

      enqueueSnackbar('The transaction has been sent', { variant: 'info' });

      dispatch({ type: 'loadingClaimEarns', payload: false });
    } catch (error) {
      const { enqueueSnackbar } = getState().market;

      console.log('Exception error: ' + error, 'Exception');
      dispatch({ type: 'loadingClaimEarns', payload: false });
      enqueueSnackbar('Exception error: ' + error, { variant: 'error' });
    }
  };
};

export const getBalanceToClaim = () => {
  return async (dispatch: Dispatch<MarketTypes>, getState: any) => {
    try {
      dispatch({ type: 'loadingBalanceToClaim', payload: true });

      const { marketplaceContract, account } = getState().market;

      const balanceToClaim = await marketplaceContract.getAccountsBalance(
        account
      );

      dispatch({
        type: 'setBalanceToClaim',
        payload: balanceToClaim.toString(),
      });

      dispatch({ type: 'loadingBalanceToClaim', payload: false });
    } catch (error) {
      const { enqueueSnackbar } = getState().market;

      console.log('Exception error: ' + error, 'Exception');
      dispatch({ type: 'loadingBalanceToClaim', payload: false });
      enqueueSnackbar('Exception error: ' + error, { variant: 'error' });
    }
  };
};
