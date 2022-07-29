import { useState } from 'react';
import { Drawer, IconButton, Typography, Grid, Link, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { mainTheme } from '../../common/mainTheme';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOwner: boolean;
}

const DrawerNav = ({ isOwner }: Props) => {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClickMint = () => {
    setOpenDrawer(false);
    navigate('mint');
  };
  const handleClickHome = () => {
    setOpenDrawer(false);
    navigate('/');
  };
  const handleClickMarketplace = () => {
    setOpenDrawer(false);
    navigate('market');
  };
  const handleClickMyNFTs = () => {
    setOpenDrawer(false);
    navigate('myNfts');
  };
  const handleClickClaim = () => {
    setOpenDrawer(false);
    navigate('claim');
  };
  const handleClickAbout = () => {
    setOpenDrawer(false);
    navigate('about');
  };

  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{ height: '50%' }}
        PaperProps={{ sx: { width: '100%' } }}
      >
        <Box
          sx={{ background: mainTheme.terciaryColor, height: '100%' }}
          style={{
            background: `linear-gradient(to right top, ${mainTheme.terciaryColor}, #d0f177)`
          }}
        >
          <Grid container sx={{ paddingLeft: 2, paddingTop: 3 }}>
            <Grid item xs={12}>
              <IconButton
                edge="start"
                color="default"
                onClick={() => setOpenDrawer(false)}
                sx={{ marginLeft: 2 }}
              >
                <Typography color={mainTheme.textColor} variant="h4">
                  X
                </Typography>
              </IconButton>
            </Grid>
            {isOwner && (
              <Grid container>
                <Grid>
                  <Link
                    className="home-nav-link"
                    underline="none"
                    onClick={handleClickMint}
                    color={mainTheme.textColor}
                    sx={{
                      marginLeft: 3,
                      marginRight: 3,
                      fontSize: 18,
                      cursor: 'pointer'
                    }}
                  >
                    {'MINT'}
                  </Link>
                </Grid>
              </Grid>
            )}
            <Grid container sx={{ marginTop: 2 }}>
              <Grid>
                <Link
                  className="home-nav-link"
                  underline="none"
                  onClick={handleClickHome}
                  color={mainTheme.textColor}
                  sx={{
                    marginLeft: 3,
                    marginRight: 3,
                    fontSize: 18,
                    cursor: 'pointer'
                  }}
                >
                  {'HOME'}
                </Link>
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: 2 }}>
              <Grid>
                <Link
                  className="home-nav-link"
                  underline="none"
                  onClick={handleClickMarketplace}
                  color={mainTheme.textColor}
                  sx={{
                    marginLeft: 3,
                    marginRight: 3,
                    fontSize: 18,
                    cursor: 'pointer'
                  }}
                >
                  {'MARKET'}
                </Link>
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: 2 }}>
              <Grid>
                <Link
                  className="home-nav-link"
                  underline="none"
                  onClick={handleClickMyNFTs}
                  color={mainTheme.textColor}
                  sx={{
                    marginLeft: 3,
                    marginRight: 3,
                    fontSize: 18,
                    cursor: 'pointer'
                  }}
                >
                  {'MY NFTS'}
                </Link>
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: 2 }}>
              <Grid>
                <Link
                  className="home-nav-link"
                  underline="none"
                  onClick={handleClickClaim}
                  color={mainTheme.textColor}
                  sx={{
                    marginLeft: 3,
                    marginRight: 3,
                    fontSize: 18,
                    cursor: 'pointer'
                  }}
                >
                  {'CLAIM'}
                </Link>
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: 2 }}>
              <Grid>
                <Link
                  className="home-nav-link"
                  underline="none"
                  onClick={handleClickAbout}
                  color={mainTheme.textColor}
                  sx={{
                    marginLeft: 3,
                    marginRight: 3,
                    fontSize: 18,
                    cursor: 'pointer'
                  }}
                >
                  {'ABOUT'}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
      <IconButton
        sx={{ color: 'white', marginRight: 'auto' }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default DrawerNav;
