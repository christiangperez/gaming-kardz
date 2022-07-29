import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';

import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Card,
  CardActionArea,
  CardMedia,
  Button,
  Modal,
  TextField
} from '@mui/material';
import { ethers } from 'ethers';

import {
  getNFTItem,
  loadNFTTransactions,
  purchaseMarketplaceItem,
  setItemOnSale
} from '../../../redux/actions/marketActions';
import { IRootState } from '../../../redux/store/store';
import { INFTItem } from '../../../interfaces/marketplaceInterfaces';
import { NFTTransactions } from '../components/NFTTransactions';
import { mainTheme } from '../../../common/mainTheme';
import EthereumIcon from '../../../assets/blockchains/ethereum-icon.png';

export const NFTDetailScreen = () => {
  const dispatch = useDispatch();
  const {
    activeNFT,
    loadingActiveNFT,
    account,
    loadingSetItemOnSale,
    loadingPurchaseItem,
    nftTransactions
  } = useSelector((state: IRootState) => state.market);
  const { idNft } = useParams();
  const navigate = useNavigate();

  const [price, setPrice] = useState<string | null>(null);
  const [openSetOnSale, setOpenSetOnSale] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [purchasedOrOnSale, setPurchasedOrOnSale] = useState(false);

  const handleOpenSetOnSale = () => {
    setPrice('');
    setOpenSetOnSale(true);
  };
  const handleCloseSetOnSale = () => {
    setOpenSetOnSale(false);
    setPrice('');
  };

  const handleOpenImage = () => {
    setOpenImage(true);
  };
  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const handleClickSetOnSale = () => {
    if (price && activeNFT) {
      dispatch(setItemOnSale(activeNFT, price));
      handleCloseSetOnSale();
      setPurchasedOrOnSale(true);
    }
  };

  const handleClickOpenSetOnSale = () => {
    handleOpenSetOnSale();
  };

  const handleClickOpenImage = () => {
    handleOpenImage();
  };

  const handleClickPurchaseItem = (item: INFTItem) => {
    dispatch(purchaseMarketplaceItem(item));
    setPurchasedOrOnSale(true);
  };

  useEffect(() => {
    dispatch(getNFTItem(idNft));
  }, []);

  useEffect(() => {
    if (!loadingSetItemOnSale && !loadingPurchaseItem && purchasedOrOnSale) {
      navigate('/market');
    }
  }, [loadingSetItemOnSale, loadingPurchaseItem, purchasedOrOnSale]);

  useEffect(() => {
    dispatch(loadNFTTransactions(Number(idNft)));
  }, []);

  if (loadingActiveNFT) {
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

  if (!loadingActiveNFT && !activeNFT) {
    return (
      <Container maxWidth="xl">
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '90vh' }}
        >
          <Typography color={mainTheme.textColor} variant="h6">
            There is a problem. Invalid NFT ID.
          </Typography>
        </Grid>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ paddingTop: 10 }}>
        {activeNFT && (
          <>
            <Grid container>
              {/* Modal Set on sale */}
              <Modal open={openSetOnSale} onClose={handleCloseSetOnSale}>
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
                    sx={{ input: { color: 'white' }, marginTop: 4 }}
                    InputLabelProps={{
                      style: { color: mainTheme.textColor }
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

              {/* Modal Image */}
              <Modal open={openImage} onClose={handleCloseImage}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400
                  }}
                  component="img"
                  src={activeNFT.image}
                  alt={activeNFT.name}
                />
              </Modal>

              <Grid item xs={12} md={4} display="flex" justifyContent="center">
                <Card
                  sx={{ maxWidth: 400, ml: 2, mr: 2, mb: 4 }}
                  style={{
                    background: `linear-gradient(to right bottom, ${
                      activeNFT.latestPrice > 0
                        ? mainTheme.terciaryColor
                        : mainTheme.primaryColor
                    }, ${mainTheme.secondaryColor})`
                  }}
                >
                  <CardActionArea onClick={handleClickOpenImage}>
                    <CardMedia
                      component="img"
                      height="400"
                      width="400"
                      src={activeNFT.image}
                      alt={activeNFT.name}
                    />
                  </CardActionArea>
                </Card>
              </Grid>

              <Grid
                item
                xs={12}
                md={8}
                sx={{ borderRadius: 8, pt: 1, pb: 1, pl: 3, pr: 3 }}
                style={{
                  background: `linear-gradient(to right bottom, ${mainTheme.terciaryColor}, ${mainTheme.secondaryColor})`
                }}
              >
                <Grid
                  display="flex"
                  alignItems="center"
                  sx={{ justifyContent: { xs: 'center', md: 'normal' } }}
                >
                  <Typography
                    variant="h4"
                    color={mainTheme.textColor}
                    display="inline"
                    fontWeight="bold"
                  >
                    {activeNFT.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    display="inline"
                    color={mainTheme.textColor}
                    sx={{ marginLeft: 1 }}
                  >
                    {` #${String(activeNFT.tokenId)}`}
                  </Typography>
                </Grid>
                {activeNFT.team && (
                  <Grid
                    display="flex"
                    sx={{
                      justifyContent: { xs: 'center', md: 'normal' },
                      marginTop: 1
                    }}
                  >
                    <Typography
                      variant="h5"
                      color={mainTheme.textColor}
                      fontWeight="600"
                    >
                      {activeNFT.team}
                    </Typography>
                  </Grid>
                )}
                <Grid
                  display="flex"
                  sx={{
                    justifyContent: { xs: 'center', md: 'normal' },
                    marginTop: 1,
                    marginBottom: 2
                  }}
                >
                  <Typography
                    variant="h5"
                    color={mainTheme.textColor}
                    fontWeight="600"
                  >
                    {activeNFT.game}
                  </Typography>
                </Grid>
                {activeNFT.seller.toLowerCase() === account && (
                  <Grid display="flex" alignItems="center">
                    <Typography variant="h6" color={mainTheme.textColor}>
                      Bought
                    </Typography>
                    <img
                      src={EthereumIcon}
                      alt="logo"
                      width={10}
                      height={14}
                      style={{ marginLeft: 10, marginRight: 5 }}
                    />
                    <Typography
                      variant="h6"
                      color={mainTheme.textColor}
                      fontWeight="600"
                    >
                      {ethers.utils.formatEther(activeNFT.latestPrice)}
                    </Typography>
                  </Grid>
                )}
                {activeNFT.onSale && (
                  <>
                    <Typography variant="h6" color={mainTheme.textColor}>
                      {activeNFT.seller.toLowerCase() === account
                        ? 'ON SALE FOR'
                        : 'Price'}
                    </Typography>
                    <Grid display="flex" alignItems="center">
                      <img
                        src={EthereumIcon}
                        alt="logo"
                        width={12}
                        height={16}
                        style={{ marginRight: 5 }}
                      />
                      <Typography
                        variant="h6"
                        color={mainTheme.textColor}
                        fontWeight="600"
                      >
                        {activeNFT.seller.toLowerCase() === account
                          ? ethers.utils.formatEther(activeNFT.price)
                          : ethers.utils.formatEther(activeNFT.totalPrice)}
                      </Typography>
                    </Grid>
                  </>
                )}
                <Grid sx={{ marginTop: 2, marginRight: 1 }}>
                  <Typography variant="h6" color={mainTheme.textColor}>
                    {activeNFT.description}
                  </Typography>
                </Grid>
                {activeNFT.onSale &&
                  activeNFT.seller.toLowerCase() !== account && (
                    <Button
                      size="large"
                      color="primary"
                      variant="outlined"
                      component="label"
                      onClick={() => handleClickPurchaseItem(activeNFT)}
                      sx={{ marginTop: 4 }}
                    >
                      BUY NOW
                    </Button>
                  )}
                {!activeNFT.onSale &&
                  activeNFT.seller.toLowerCase() === account && (
                    <Button
                      size="large"
                      color="primary"
                      variant="outlined"
                      component="label"
                      onClick={() => handleClickOpenSetOnSale()}
                      sx={{ marginTop: 2 }}
                    >
                      SET ON SALE
                    </Button>
                  )}
              </Grid>
            </Grid>
          </>
        )}
      </Container>
      {nftTransactions && nftTransactions?.length > 0 && <NFTTransactions />}
    </>
  );
};
