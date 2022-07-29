import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IRootState } from '../../../redux/store/store';
import {
  Typography,
  Container,
  Grid,
  CircularProgress,
  Box
} from '@mui/material';
import {
  loadMarketplaceItems,
  purchaseMarketplaceItem
} from '../../../redux/actions/marketActions';
import { INFTItem } from '../../../interfaces/marketplaceInterfaces';
import { NFTMarketplaceCard } from '../components/NFTMarketplaceCard';
import { mainTheme } from '../../../common/mainTheme';

export const MarketplaceScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { marketplaceItems, loadingMarketplaceItems, loadingPurchaseItem } =
    useSelector((state: IRootState) => state.market);

  const handleClickPurchaseItem = (item: INFTItem) => {
    dispatch(purchaseMarketplaceItem(item));
  };

  const handleClickCard = (item: INFTItem) => {
    navigate(`/nft/${item.tokenId}`);
  };

  useEffect(() => {
    if (!loadingPurchaseItem) {
      dispatch(loadMarketplaceItems());
    }
  }, []);

  if (loadingMarketplaceItems) {
    return (
      <Container maxWidth="xl" sx={{ background: mainTheme.fourthColor }}>
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
        background: `linear-gradient(to right bottom, ${mainTheme.fourthColor}, ${mainTheme.secondaryColor})`
      }}
    >
      {marketplaceItems.length > 0 ? (
        <>
          <Grid display="flex" justifyContent="center">
            <Grid>
              <Typography color={mainTheme.textColor} variant="h2">
                Market
              </Typography>
              <Typography color={mainTheme.textColor} variant="subtitle1">
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
          <Typography color={mainTheme.textColor} variant="h5">
            Oops.. no listed assets
          </Typography>
        </Grid>
      )}
    </Container>
  );
};
