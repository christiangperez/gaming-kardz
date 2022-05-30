import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../redux/store/store';
import {
  Typography,
  Container,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  loadMarketplaceItems,
  purchaseMarketplaceItem,
} from '../../../redux/actions/marketActions';
import { INFTItem } from '../../../interfaces/marketplaceInterfaces';
import { useNavigate } from 'react-router-dom';
import { NFTMarketplaceCard } from '../components/NFTMarketplaceCard';

export const MarketplaceScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { marketplaceItems, loadingMarketplaceItems, loadingPurchaseItem } =
    useSelector((state: IRootState) => state.market);

  const handleClickPurchaseItem = (item: INFTItem) => {
    dispatch(purchaseMarketplaceItem(item));
  };

  const handleClickCard = (item: INFTItem) => {
    navigate(`/nft/${item.itemId}`);
  };

  useEffect(() => {
    if (!loadingPurchaseItem) {
      dispatch(loadMarketplaceItems());
    }
  }, []);

  if (loadingMarketplaceItems) {
    return (
      <Container maxWidth="xl" sx={{ background: '#0c1410' }}>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '90vh' }}
        >
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </Grid>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ paddingTop: 2 }}
      style={{
        background: 'linear-gradient(to right bottom, #0c1410, #192112)',
      }}
    >
      {marketplaceItems.length > 0 ? (
        <>
          <Grid display="flex" justifyContent="center">
            <Grid>
              <Typography color="white" variant="h2">
                Market
              </Typography>
              <Typography color="white" variant="subtitle1">
                Explore and collect your NFTs
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            display="flex"
            justifyContent="center"
            sx={{ marginTop: 4 }}
          >
            {marketplaceItems.map((item, idx) => (
              <NFTMarketplaceCard
                key={idx}
                item={item}
                handleClickCard={handleClickCard}
                handleClickPurchaseItem={handleClickPurchaseItem}
              />
            ))}
          </Grid>
        </>
      ) : (
        <Grid display="flex" justifyContent="center">
          <Typography color="white" variant="h5">
            Oops.. no listed assets
          </Typography>
        </Grid>
      )}
    </Container>
  );
};
