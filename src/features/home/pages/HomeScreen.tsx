import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  Link,
  IconButton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';
import PaidIcon from '@mui/icons-material/Paid';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { StepsCard } from '../components/StepsCard';
import { Footer } from '../components/Footer';

export const HomeScreen = () => {
  const navigate = useNavigate();
  const [height, setHeight] = useState(window.innerHeight);
  const theme = useTheme();
  const isSmOrLess = useMediaQuery(theme.breakpoints.down('md'));
  const isMdOrLess = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Container
        maxWidth="xl"
        style={{
          background: 'linear-gradient(to right bottom, #0c1410, #192112)',
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
              color="white"
              align={isSmOrLess ? 'center' : 'inherit'}
              style={{ letterSpacing: 4 }}
              variant={isSmOrLess ? 'h4' : 'h2'}
              sx={{ fontWeight: '600', mt: { xs: 4, md: 0 } }}
            >
              Buy NFTs of your favorites players.
            </Typography>
            <Typography
              color="white"
              align={isSmOrLess ? 'center' : 'inherit'}
              variant={isSmOrLess ? 'body1' : 'h6'}
              sx={{ marginTop: 3 }}
            >
              Find all players in the world and buy the player that you want.
            </Typography>
            <Typography
              color="white"
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
                  pr: { xs: 3, md: 6 },
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
                maxWidth: { xs: 350, md: 500 },
              }}
              alt="The house from the offer."
              src="../../assets/vitality-home.png"
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
                component="img"
                sx={{
                  maxHeight: { xs: 250, md: 350 },
                  maxWidth: { xs: 350, md: 350 },
                  marginTop: { xs: 5, md: 0 },
                }}
                alt="Sell"
                src="../../assets/sell-home.png"
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              order={{ xs: 1, md: 2 }}
              sx={{
                marginLeft: { xs: 1, md: 0 },
                marginRight: { xs: 1, md: 0 },
              }}
            >
              <Typography
                color="white"
                align={isSmOrLess ? 'center' : 'inherit'}
                style={{ letterSpacing: 4 }}
                variant={isSmOrLess ? 'h4' : 'h3'}
                sx={{ fontWeight: '500', mt: { xs: 4, md: 0 } }}
              >
                Sell your NFTs and make huge profits.
              </Typography>
              <Typography
                color="white"
                align={isSmOrLess ? 'center' : 'inherit'}
                variant={isSmOrLess ? 'body1' : 'h6'}
                sx={{ marginTop: 3 }}
              >
                Speculate and sell your NFT when your player is in a big moment.
              </Typography>
              <Typography
                color="white"
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
              marginRight: { xs: 1, md: 0 },
            }}
          >
            <Typography
              color="white"
              align={isSmOrLess ? 'center' : 'inherit'}
              style={{ letterSpacing: 4 }}
              variant={isSmOrLess ? 'h4' : 'h3'}
              textAlign="center"
            >
              Earn royalites from NFT sales.
            </Typography>
            <Typography
              color="white"
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
              sx={{ marginTop: 10 }}
            >
              {/* Buy Newone NFT */}
              <StepsCard
                imageIcon={
                  <ShoppingCartIcon sx={{ color: '#d0f177', fontSize: 96 }} />
                }
                description="BUY NEWONE NFT"
              />

              {/* Sell NFT */}
              <StepsCard
                imageIcon={<SellIcon sx={{ color: '#d0f177', fontSize: 96 }} />}
                description="SELL NFT"
              />

              {/* Earn Royalties */}
              <StepsCard
                imageIcon={<PaidIcon sx={{ color: '#d0f177', fontSize: 96 }} />}
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
