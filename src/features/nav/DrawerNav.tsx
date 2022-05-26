import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Drawer,
  IconButton,
  Typography,
  Grid,
  Link,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
  isOwner: boolean
}

const DrawerNav = ({ isOwner }: Props) => {
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClickMint = () => {
    navigate('mint');
    setOpenDrawer(false);
  }
  const handleClickHome = () => {
    navigate('home');
    setOpenDrawer(false);
  }
  const handleClickMarketplace = () => {
    navigate('market');
    setOpenDrawer(false);
  }
  const handleClickMyNFTs = () => {
    navigate('mynfts');
    setOpenDrawer(false);
  }
  const handleClickAbout = () => {
    navigate('about');
    setOpenDrawer(false);
  }

  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} sx={{ height: '50%' }} 
        PaperProps={{ sx: { width: "100%" } }}
      >
        <Box 
          sx={{ background: '#5e7b37', height: '100%' }}
          style={{ background: 'linear-gradient(to right top, #5e7b37, #d0f177)' }}
        >
          <Grid container sx={{ paddingLeft: 2, paddingTop: 3 }}>
            <Grid item xs={12}>
                <IconButton
                    edge='start'
                    color='default'
                    onClick={() => setOpenDrawer(false) }
                    sx={{ marginLeft: 2 }}
                >
                    <Typography color='white' variant="h4">
                        X
                    </Typography>
                </IconButton>
            </Grid>
            {
              (isOwner) && (
                <Grid container>
                  <Grid>
                      <Link className='home-nav-link' href="#" underline="none" onClick={handleClickMint} color="white" sx={{ marginLeft: 3, marginRight: 3, fontSize: 18 }}>
                          {'MINT'}
                      </Link>
                  </Grid>
                </Grid>
              )
            }
            <Grid container sx={{ marginTop: 2 }}>
              <Grid>
                <Link className='home-nav-link' href="#" underline="none" onClick={handleClickHome} color="white" sx={{ marginLeft: 3, marginRight: 3, fontSize: 18 }}>
                    {'HOME'}
                </Link>
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: 2 }}>
              <Grid>
                <Link className='home-nav-link' href="#" underline="none" onClick={handleClickMarketplace} color="white" sx={{ marginLeft: 3, marginRight: 3, fontSize: 18 }}>
                    {'MARKET'}
                </Link>
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: 2 }}>
              <Grid>
                  <Link className='home-nav-link' href="#" underline="none" onClick={handleClickMyNFTs} color="white" sx={{ marginLeft: 3, marginRight: 3, fontSize: 18 }}>
                      {'MY NFTS'}
                  </Link>
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: 2 }}>
              <Grid>
                  <Link className='home-nav-link' href="#" underline="none" onClick={handleClickAbout} color="white" sx={{ marginLeft: 3, marginRight: 3, fontSize: 18 }}>
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
