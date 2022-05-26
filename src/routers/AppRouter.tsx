import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';

import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';
import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import { Navbar } from '../features/nav/Navbar';
import { MarketplaceScreen } from '../features/marketplace/pages/MarketplaceScreen';
import { MyNFTsScreen } from '../features/marketplace/pages/MyNFTsScreen';
import { IRootState } from '../redux/store/store';
import { MintProvisional } from '../features/marketplace/pages/MintProvisional';
import { AboutScreen } from '../features/home/pages/AboutScreen';
import {
  getContractOwner,
  loadMarketplaceItems,
  loadMyNFTsItems,
} from '../redux/actions/marketActions';
import { NFTDetailScreen } from '../features/marketplace/pages/NFTDetailScreen';
import { HomeScreen } from '../features/home/pages/HomeScreen';
import { ConnectWalletScreen } from '../features/home/pages/ConnectWalletScreen';
import { NotFoundScreen } from '../features/home/pages/NotFoundScreen';

export const AppRouter = () => {
  const dispatch = useDispatch();
  const { account, isOwner, marketplaceContract } = useSelector(
    (state: IRootState) => state.market
  );

  interface ITxsSetOnSale {
    itemId: any;
    tokenId: any;
    price: any;
    seller: any;
  }

  interface ITxsBought {
    itemId: any;
    nft: any;
    tokenId: any;
    price: any;
    seller: any;
    buyer: any;
  }

  const [txsSetOnSale, setTxsSetOnSale] = useState<ITxsSetOnSale[]>([]);
  const [txsBought, setTxsBought] = useState<ITxsBought[]>([]);

  const [loading, setLoading] = useState(true);

  // Metamask login/connect
  const web3Handler = async () => {
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    window.ethereum.on('chainChanged', (chainId: any) => {
      window.location.reload();
    });

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    dispatch({
      type: 'setAccount',
      payload: String(accounts[0]).toLowerCase(),
    });
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    loadContracts(signer);
  };

  const handleAccountsChanged = (accounts: any[]) => {
    dispatch({ type: 'setAccount', payload: accounts[0] });
  };

  const loadContracts = async (signer: any) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);

    dispatch({ type: 'setContracts', payload: { nft, marketplace } });

    setLoading(false);
  };

  useEffect(() => {
    if (!loading) {
      dispatch(getContractOwner());
    }
  }, [loading]);

  useEffect(() => {
    if (txsSetOnSale.length > 0) {
      dispatch(loadMyNFTsItems());
    }
  }, [txsSetOnSale]);

  useEffect(() => {
    if (txsBought.length > 0) {
      dispatch(loadMarketplaceItems());
    }
  }, [txsBought]);

  useEffect(() => {
    const handleItemOnSaleEvent = (
      itemId: any,
      tokenId: any,
      price: any,
      seller: any
    ) => {
      if (String(seller).toLowerCase() === account) {
        setTxsSetOnSale((prev: any) => [
          {
            itemId,
            tokenId,
            price,
            seller,
          },
          ...prev,
        ]);
      }
    };

    const handleBoughtEvent = (
      itemId: any,
      nft: any,
      tokenId: any,
      price: any,
      seller: any,
      buyer: any
    ) => {
      if (
        String(seller).toLowerCase() === account ||
        String(buyer).toLowerCase() === account
      ) {
        setTxsBought((prev: any) => [
          {
            itemId,
            nft,
            tokenId,
            price,
            seller,
            buyer,
          },
          ...prev,
        ]);
      }
    };

    if (marketplaceContract.address) {
      marketplaceContract.on('ItemOnSale', handleItemOnSaleEvent);
      marketplaceContract.on('Bought', handleBoughtEvent);
    }

    return () => {
      if (marketplaceContract.address) {
        marketplaceContract.removeAllListeners('ItemOnSale');
        marketplaceContract.removeAllListeners('Bought');
      }
    };
  }, [marketplaceContract]);

  return (
    <Router>
      <Navbar web3Handler={web3Handler} account={account} isOwner={isOwner} />

      <Routes>
        <Route path="/home" element={<HomeScreen />} />

        {!loading ? (
          <>
            <Route path="/mint" element={<MintProvisional />} />
            <Route path="/market" element={<MarketplaceScreen />} />
            <Route path="/mynfts" element={<MyNFTsScreen />} />
            <Route path="/nft/:idNft" element={<NFTDetailScreen />} />
          </>
        ) : (
          <>
            <Route path="/mint" element={<ConnectWalletScreen />} />
            <Route path="/market" element={<ConnectWalletScreen />} />
            <Route path="/mynfts" element={<ConnectWalletScreen />} />
            <Route path="/nft/:idNft" element={<ConnectWalletScreen />} />
          </>
        )}

        <Route path="/about" element={<AboutScreen />} />

        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Router>
  );
};
