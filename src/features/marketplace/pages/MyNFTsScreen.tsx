import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CardActionArea,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Container,
  CardActions,
  Button,
  Grid,
  Modal,
  Box,
  TextField,
  CircularProgress,
} from '@mui/material';
import { ethers } from 'ethers';
import { IRootState } from '../../../redux/store/store';
import {
  loadMyNFTsItems,
  setItemOnSale,
} from '../../../redux/actions/marketActions';
import { INFTItem } from '../../../interfaces/marketplaceInterfaces';
import { useNavigate } from 'react-router';

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
    navigate(`/nft/${item.itemId}`);
  };

  useEffect(() => {
    if (!loadingSetItemOnSale) {
      dispatch(loadMyNFTsItems());
    }
  }, []);

  if (loadingMyNFTsItems) {
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
    <Container maxWidth="xl" sx={{ background: '#0c1410', paddingTop: 2 }}>
      {myNFTsItems.length > 0 ? (
        <>
          <Grid display="flex" justifyContent="center">
            <Grid>
              <Typography color="white" variant="h2">
                My NFTs
              </Typography>
              <Typography color="white" variant="subtitle1">
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
                  p: 4,
                }}
                style={{
                  background:
                    'linear-gradient(to right bottom, #0c1410, #192112)',
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  color="white"
                >
                  Insert price to your NFT
                </Typography>
                <Typography
                  id="modal-modal-description"
                  color="white"
                  sx={{ mt: 2 }}
                >
                  Remember you can't change the price. When you put on sale the
                  token, you need to wait to someone buy your token.
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Price in ETH"
                  variant="outlined"
                  type="number"
                  value={price}
                  onChange={(p) => setPrice(p.target.value)}
                  sx={{ input: { color: 'white' }, marginTop: 4 }}
                  InputLabelProps={{
                    style: { color: '#fff' },
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
              <Card
                key={idx}
                sx={{ maxWidth: 300, ml: 2, mr: 2, mb: 4 }}
                style={{
                  background: `linear-gradient(to right bottom, ${
                    item.latestPrice > 0 ? '#5e7b37' : '#d0f177'
                  }, #192112)`,
                }}
              >
                <CardActionArea onClick={() => handleClickCard(item)}>
                  <CardMedia
                    component="img"
                    height="300"
                    src={item.image}
                    alt={item.name}
                  />
                  <CardContent>
                    {/* Name */}
                    <Grid
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-end"
                    >
                      {
                        <>
                          <Typography
                            variant="caption"
                            color="white"
                            fontWeight="bold"
                            fontSize={16}
                          >
                            {item.name}{' '}
                            <Typography
                              variant="caption"
                              color="white"
                            >{` #${String(item.itemId)}`}</Typography>
                          </Typography>
                          <Typography
                            variant="caption"
                            color="white"
                            textAlign="center"
                            fontSize={14}
                            fontWeight="600"
                          >
                            {item.team ? item.team : item.game}
                          </Typography>
                        </>
                      }
                    </Grid>

                    {/* Team and price */}
                    <Grid
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      {
                        <>
                          <Grid display="flex" alignItems="center">
                            <Typography
                              variant="caption"
                              color="white"
                              textAlign="center"
                              fontSize={14}
                              fontWeight="600"
                            >
                              {item.team ? item.team : item.game}
                            </Typography>
                          </Grid>
                          <Grid display="flex" alignItems="center">
                            <Typography variant="caption" color="white">
                              Bought
                            </Typography>
                            <img
                              src="../../assets/ether-gold.png"
                              alt="logo"
                              width={16}
                              height={16}
                              style={{ marginLeft: 2, marginRight: 2 }}
                            />
                            <Typography
                              variant="caption"
                              color="white"
                              textAlign="center"
                              fontSize={14}
                              fontWeight="600"
                            >
                              {ethers.utils.formatEther(item.latestPrice)}
                            </Typography>
                          </Grid>
                        </>
                      }
                    </Grid>

                    {/* Game and latest price */}
                    <Grid
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      {
                        <>
                          {item.team && (
                            <Grid display="flex" alignItems="center">
                              <Typography
                                variant="caption"
                                color="white"
                                textAlign="center"
                                fontSize={14}
                                fontWeight="600"
                              >
                                {item.game}
                              </Typography>
                            </Grid>
                          )}
                        </>
                      }
                    </Grid>
                  </CardContent>
                </CardActionArea>
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                  {item.onSale ? (
                    <Typography color="primary" fontWeight="bold">
                      ON SALE FOR {ethers.utils.formatEther(item.price)} ETH
                    </Typography>
                  ) : (
                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      component="label"
                      onClick={() => handleClickOpenSetOnSale(item)}
                    >
                      Set ON SALE
                    </Button>
                  )}
                </CardActions>
              </Card>
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
            <Typography color="white" variant="h5">
              You don't have any NFT.. Explore the market to buy one
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
