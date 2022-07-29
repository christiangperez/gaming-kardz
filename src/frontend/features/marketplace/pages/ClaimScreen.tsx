import { Button, Container, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { mainTheme } from '../../../common/mainTheme';
import {
  claimEarns,
  getBalanceToClaim
} from '../../../redux/actions/marketActions';
import { IRootState } from '../../../redux/store/store';

const ClaimScreen = () => {
  const dispatch = useDispatch();
  const { balanceToClaim } = useSelector((state: IRootState) => state.market);

  const handleClickClaim = () => {
    dispatch(claimEarns());
  };

  useEffect(() => {
    dispatch(getBalanceToClaim());
  }, []);

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ paddingTop: 2 }}
        style={{
          background: `linear-gradient(to right bottom, ${mainTheme.fourthColor}, ${mainTheme.secondaryColor})`
        }}
      >
        <Grid display="flex" justifyContent="center">
          <Grid>
            <Typography
              color={mainTheme.primaryColor}
              variant="subtitle1"
              textAlign="center"
            >
              Claim
            </Typography>
            <Typography color={mainTheme.textColor} variant="h2">
              EARNS
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          display="flex"
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: 10 }}
        >
          {balanceToClaim ? (
            <>
              <Typography
                color={mainTheme.primaryColor}
                variant="h4"
                textAlign="center"
                sx={{ marginBottom: 2 }}
              >
                You have {ethers.utils.formatEther(balanceToClaim)} ETH
              </Typography>
              <Typography color={mainTheme.textColor} variant="subtitle1">
                If you want to claim your earns, press CLAIM EARNS
              </Typography>
              <Button
                variant="outlined"
                component="label"
                onClick={handleClickClaim}
                sx={{ marginTop: 5, marginBottom: 5 }}
              >
                CLAIM EARNS
              </Button>
            </>
          ) : (
            <Typography color={mainTheme.textColor} variant="h5">
              There is not any balance to claim
            </Typography>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default ClaimScreen;
