import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';
import PaidIcon from '@mui/icons-material/Paid';
import { StepsCard } from '../components/StepsCard';
import { Footer } from '../components/Footer';
import { mainTheme } from '../../../common/mainTheme';
import VitalityHome from '../../../assets/home/vitality-home.png';
import SellHome from '../../../assets/home/sell-home.png';
import './Home.css';

export const HomeScreen = () => {
  const navigate = useNavigate();

  const refSellImage = useRef<HTMLHeadingElement>(null);
  const refSellDescription = useRef<HTMLHeadingElement>(null);

  const refRoyaltiesTitle = useRef<HTMLHeadingElement>(null);
  const refRoyaltiesSubtitle = useRef<HTMLHeadingElement>(null);
  const refRoyaltiesCards = useRef<HTMLHeadingElement>(null);

  const [height, setHeight] = useState(window.innerHeight);
  const theme = useTheme();
  const isSmOrLess = useMediaQuery(theme.breakpoints.down('md'));

  // Resize Effect Listener
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Scroll Effect Listener
  useEffect(() => {
    const scrollListener = () => {
      const screenSize = window.innerHeight;

      if (refSellImage.current) {
        if (refSellImage.current.getBoundingClientRect().top < screenSize) {
          refSellImage.current.classList.add('visible');
        } else {
          refSellImage.current.classList.remove('visible');
        }
      }

      if (refSellDescription.current) {
        if (
          refSellDescription.current.getBoundingClientRect().top < screenSize
        ) {
          refSellDescription.current.classList.add('visible');
        } else {
          refSellDescription.current.classList.remove('visible');
        }
      }

      if (refRoyaltiesTitle.current) {
        if (
          refRoyaltiesTitle.current.getBoundingClientRect().top < screenSize
        ) {
          refRoyaltiesTitle.current.classList.add('visible');
        } else {
          refRoyaltiesTitle.current.classList.remove('visible');
        }
      }

      if (refRoyaltiesSubtitle.current) {
        if (
          refRoyaltiesSubtitle.current.getBoundingClientRect().top < screenSize
        ) {
          refRoyaltiesSubtitle.current.classList.add('visible');
        } else {
          refRoyaltiesSubtitle.current.classList.remove('visible');
        }
      }

      if (refRoyaltiesCards.current) {
        if (
          refRoyaltiesCards.current.getBoundingClientRect().top < screenSize
        ) {
          refRoyaltiesCards.current.classList.add('visible');
        } else {
          refRoyaltiesCards.current.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);

  return (
    <>
      <Container
        maxWidth="xl"
        style={{
          background: `linear-gradient(to right bottom, ${mainTheme.fourthColor}, ${mainTheme.secondaryColor})`
        }}
      >
        {/* Explore Section */}
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
          columnSpacing={8}
          sx={{ height: height - 50 }}
        >
          <Grid
            item
            xs={12}
            md={5}
            sx={{ marginLeft: { xs: 1, md: 0 }, marginRight: { xs: 1, md: 0 } }}
          >
            <Typography
              color={mainTheme.textColor}
              align={isSmOrLess ? 'center' : 'inherit'}
              style={{ letterSpacing: 4 }}
              variant={isSmOrLess ? 'h4' : 'h2'}
              sx={{ fontWeight: '600', mt: { xs: 4, md: 0 } }}
            >
              Buy NFTs of your favorites players.
            </Typography>
            <Typography
              color={mainTheme.textColor}
              align={isSmOrLess ? 'center' : 'inherit'}
              variant={isSmOrLess ? 'body1' : 'h6'}
              sx={{ marginTop: 3 }}
            >
              Find all players in the world and buy the player that you want.
            </Typography>
            <Typography
              color={mainTheme.textColor}
              align={isSmOrLess ? 'center' : 'inherit'}
              variant={isSmOrLess ? 'body1' : 'h6'}
              sx={{ marginTop: 3 }}
            >
              New NFTs appear every month, check the marketplace to know what
              they are.
            </Typography>
            <Grid
              item
              display="flex"
              justifyContent={isSmOrLess ? 'center' : 'none'}
            >
              <Button
                variant="outlined"
                sx={{
                  fontWeight: 'bold',
                  marginTop: { xs: 5, md: 6 },
                  pt: { xs: 1, md: 2 },
                  pb: { xs: 1, md: 2 },
                  pl: { xs: 3, md: 6 },
                  pr: { xs: 3, md: 6 }
                }}
                onClick={() => navigate('/market')}
              >
                Explore
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="center">
            <Box
              component="img"
              sx={{
                maxHeight: { xs: 250, md: 500 },
                maxWidth: { xs: 350, md: 500 }
              }}
              alt="The house from the offer."
              src={VitalityHome}
            />
          </Grid>
        </Grid>

        {/* Sell Section */}
        <Grid container sx={{ marginTop: 6, marginBottom: 12 }}>
          <Grid
            container
            display="flex"
            justifyContent="center"
            columnSpacing={8}
          >
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
              order={{ xs: 2, md: 1 }}
            >
              <Box
                ref={refSellImage}
                className="fadeLeft"
                component="img"
                sx={{
                  maxHeight: { xs: 250, md: 350 },
                  maxWidth: { xs: 350, md: 350 },
                  marginTop: { xs: 5, md: 0 }
                }}
                alt="Sell"
                src={SellHome}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              order={{ xs: 1, md: 2 }}
              ref={refSellDescription}
              className="fadeRight"
              sx={{
                marginLeft: { xs: 1, md: 0 },
                marginRight: { xs: 1, md: 0 }
              }}
            >
              <Typography
                color={mainTheme.textColor}
                align={isSmOrLess ? 'center' : 'inherit'}
                style={{ letterSpacing: 4 }}
                variant={isSmOrLess ? 'h4' : 'h3'}
                sx={{ fontWeight: '500', mt: { xs: 4, md: 0 } }}
              >
                Sell your NFTs and make huge profits.
              </Typography>
              <Typography
                color={mainTheme.textColor}
                align={isSmOrLess ? 'center' : 'inherit'}
                variant={isSmOrLess ? 'body1' : 'h6'}
                sx={{ marginTop: 3 }}
              >
                Speculate and sell your NFT when your player is in a big moment.
              </Typography>
              <Typography
                color={mainTheme.textColor}
                align={isSmOrLess ? 'center' : 'inherit'}
                variant={isSmOrLess ? 'body1' : 'h6'}
                sx={{ marginTop: 3 }}
              >
                Specity any price that you want.
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Royalties Section */}
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              paddingBottom: 20,
              marginTop: 10,
              marginLeft: { xs: 1, md: 0 },
              marginRight: { xs: 1, md: 0 }
            }}
          >
            <Typography
              ref={refRoyaltiesTitle}
              className="fadeLeft"
              color={mainTheme.textColor}
              align={isSmOrLess ? 'center' : 'inherit'}
              style={{ letterSpacing: 4 }}
              variant={isSmOrLess ? 'h4' : 'h3'}
              textAlign="center"
            >
              Earn royalites from NFT sales.
            </Typography>
            <Typography
              ref={refRoyaltiesSubtitle}
              className="fadeRight"
              color={mainTheme.textColor}
              align={isSmOrLess ? 'center' : 'inherit'}
              variant={isSmOrLess ? 'body1' : 'h6'}
              sx={{ marginTop: 2 }}
              textAlign="center"
            >
              Be the first to buy a NFT minted to earn royalties for life.
            </Typography>
            <Grid
              container
              display="flex"
              justifyContent="space-evenly"
              ref={refRoyaltiesCards}
              className="fadeTop"
              sx={{ marginTop: 10 }}
            >
              {/* Buy Newone NFT */}
              <StepsCard
                imageIcon={
                  <ShoppingCartIcon
                    sx={{ color: mainTheme.primaryColor, fontSize: 96 }}
                  />
                }
                description="BUY NEWONE NFT"
              />

              {/* Sell NFT */}
              <StepsCard
                imageIcon={
                  <SellIcon
                    sx={{ color: mainTheme.primaryColor, fontSize: 96 }}
                  />
                }
                description="SELL NFT"
              />

              {/* Earn Royalties */}
              <StepsCard
                imageIcon={
                  <PaidIcon
                    sx={{ color: mainTheme.primaryColor, fontSize: 96 }}
                  />
                }
                description="EARN ROYALTIES"
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Footer Section */}
      <Footer />
    </>
  );
};
