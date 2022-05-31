import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Typography,
  Toolbar,
  IconButton,
  Button,
  Link,
  useTheme,
  useMediaQuery,
  Grid,
  Snackbar,
  Alert,
  Slide,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DrawerNav from './DrawerNav';
import { IRootState } from '../../redux/store/store';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { mainTheme } from '../../common/mainTheme';

interface Props {
  web3Handler: () => Promise<void>;
  account: any;
  isOwner: boolean;
}

const Navbar = ({ web3Handler, account, isOwner }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { transactionResult } = useSelector(
    (state: IRootState) => state.market
  );

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isSmOrLess = useMediaQuery(theme.breakpoints.down('md'));

  const getShortAccount = (account: string) => {
    if (account.length > 5) {
      return account.substring(0, 5) + '...' + account.substr(-4);
    }

    return '';
  };

  const handleCloseSnackBar = () => {
    dispatch({ type: 'hideSnackbarTransactionResult' });
  };

  function TransitionRight(props: any) {
    return <Slide {...props} direction="left" />;
  }

  useEffect(() => {
    dispatch({ type: 'setEnqueueSnackbar', payload: enqueueSnackbar });
  }, []);

  return (
    <AppBar position="static" sx={{ background: 'transparent' }}>
      <Toolbar>
        <Snackbar
          key="top center"
          TransitionComponent={TransitionRight}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={3000}
          open={transactionResult.show}
          onClose={handleCloseSnackBar}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity={transactionResult?.okStatus ? 'success' : 'error'}
            sx={{ width: '100%' }}
          >
            {transactionResult?.description}
          </Alert>
        </Snackbar>
        {isSmOrLess ? (
          <>
            <DrawerNav isOwner={isOwner} />
          </>
        ) : (
          <>
            <IconButton
              edge="start"
              color="default"
              onClick={() => navigate('home')}
            >
              <img
                src="../../assets/logo.png"
                alt="logo"
                width={24}
                height={24}
                style={{ marginRight: 7 }}
              />
              <Typography
                color="#d0f177"
                variant="button"
                sx={{ fontWeight: 'bold' }}
                style={{ letterSpacing: 2 }}
              >
                Gaming Kardz
              </Typography>
            </IconButton>
            <Grid
              container
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {isOwner && (
                <Link
                  className="home-nav-link"
                  href="#"
                  underline="none"
                  onClick={() => navigate('mint')}
                  color={mainTheme.textColor}
                  sx={{ marginRight: 3 }}
                >
                  {'MINT'}
                </Link>
              )}
              <Link
                className="home-nav-link"
                href="#"
                underline="none"
                onClick={() => navigate('home')}
                color={mainTheme.textColor}
                sx={{ marginRight: 3 }}
              >
                {'HOME'}
              </Link>
              <Link
                className="home-nav-link"
                href="#"
                underline="none"
                onClick={() => navigate('market')}
                color={mainTheme.textColor}
                sx={{ marginRight: 3 }}
              >
                {'MARKET'}
              </Link>
              <Link
                className="home-nav-link"
                href="#"
                underline="none"
                onClick={() => navigate('mynfts')}
                color={mainTheme.textColor}
                sx={{ marginRight: 3 }}
              >
                {'MY NFTS'}
              </Link>
              <Link
                className="home-nav-link"
                href="#"
                underline="none"
                onClick={() => navigate('about')}
                color={mainTheme.textColor}
                sx={{ marginRight: 3 }}
              >
                {'ABOUT'}
              </Link>
            </Grid>
          </>
        )}
        {account ? (
          <>
            <AccountBalanceWalletIcon sx={{ color: mainTheme.primaryColor }} />
            <Typography
              sx={{ marginLeft: '5px' }}
              color={mainTheme.primaryColor}
            >
              {getShortAccount(account)}
            </Typography>
          </>
        ) : (
          <Button onClick={web3Handler} variant="outlined" sx={{ width: 250 }}>
            Connect Wallet
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Navbar);
