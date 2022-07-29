import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Container,
  Button,
  Grid,
  Modal,
  Box,
  TextField,
  CircularProgress
} from '@mui/material';
import { IRootState } from '../../../redux/store/store';
import {
  loadMyNFTsItems,
  setItemOnSale
} from '../../../redux/actions/marketActions';
import { INFTItem } from '../../../interfaces/marketplaceInterfaces';
import { useNavigate } from 'react-router';
import { MyNFTCard } from '../components/MyNFTCard';
import { mainTheme } from '../../../common/mainTheme';

export const MyNFTsScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myNFTsItems, loadingMyNFTsItems, loadingSetItemOnSale } = useSelector(
    (state: IRootState) => state.market
  );

  const [price, setPrice] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<INFTItem>();

  const handleOpen = () => {
    setPrice('');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setPrice('');
  };

  const handleClickSetOnSale = () => {
    if (price && activeItem) {
      dispatch(setItemOnSale(activeItem, price));
      handleClose();
    }
  };

  const handleClickOpenSetOnSale = (item: INFTItem) => {
    setActiveItem(item);
    handleOpen();
  };

  const handleClickExploreMarketplace = () => {
    navigate('/market');
  };

  const handleClickCard = (item: INFTItem) => {
    navigate(`/nft/${item.tokenId}`);
  };

  useEffect(() => {
    if (!loadingSetItemOnSale) {
      dispatch(loadMyNFTsItems());
    }
  }, []);

  if (loadingMyNFTsItems) {
    return (
      <Container maxWidth="xl">
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
    <Container maxWidth="xl" sx={{ paddingTop: 2 }}>
      {myNFTsItems.length > 0 ? (
        <>
          <Grid display="flex" justifyContent="center">
            <Grid>
              <Typography color={mainTheme.textColor} variant="h2">
                My NFTs
              </Typography>
              <Typography color={mainTheme.textColor} variant="subtitle1">
                Increase your collection buying more
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            display="flex"
            justifyContent="center"
            sx={{ marginTop: 4 }}
          >
            <Modal open={open} onClose={handleClose}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  boxShadow: 24,
                  p: 4
                }}
                style={{
                  background: `linear-gradient(to right bottom, ${mainTheme.fourthColor}, ${mainTheme.secondaryColor})`
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  color={mainTheme.textColor}
                >
                  Insert price to your NFT
                </Typography>
                <Typography
                  id="modal-modal-description"
                  color={mainTheme.textColor}
                  sx={{ mt: 2 }}
                >
                  Remember you can not change the price. When you put on sale
                  the token, you need to wait to someone buy your token.
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Price in ETH"
                  variant="outlined"
                  type="number"
                  value={price}
                  onChange={(p) => setPrice(p.target.value)}
                  InputLabelProps={{
                    style: { color: mainTheme.textColor }
                  }}
                  sx={{
                    marginTop: 4,
                    input: { color: 'white' },
                    '& .MuiInputLabel-root': { color: '#dbdbdb' },
                    '& .MuiOutlinedInput-root': {
                      '& > fieldset': { borderColor: '#dbdbdb' }
                    },
                    '& .MuiOutlinedInput-root.Mui-focused': {
                      '& > fieldset': {
                        borderColor: mainTheme.primaryColor
                      }
                    },
                    '& .MuiOutlinedInput-root:hover': {
                      '& > fieldset': {
                        borderColor: mainTheme.primaryColor
                      }
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleClickSetOnSale}
                  sx={{ marginTop: 4 }}
                >
                  SEND TOKEN TO SALE
                </Button>
              </Box>
            </Modal>
            {myNFTsItems.map((item, idx) => (
              <MyNFTCard
                key={idx}
                item={item}
                handleClickCard={handleClickCard}
                handleClickOpenSetOnSale={handleClickOpenSetOnSale}
              />
            ))}
          </Grid>
        </>
      ) : (
        <>
          <Grid
            display="flex"
            justifyContent="center"
            sx={{ marginTop: 10, marginLeft: 5, marginRight: 5 }}
          >
            <Typography color={mainTheme.textColor} variant="h5">
              You don not have any NFT.. Explore the market to buy one
            </Typography>
          </Grid>
          <Grid display="flex" justifyContent="center" sx={{ marginTop: 8 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleClickExploreMarketplace}
            >
              Explore Marketplace
            </Button>
          </Grid>
        </>
      )}
    </Container>
  );
};
