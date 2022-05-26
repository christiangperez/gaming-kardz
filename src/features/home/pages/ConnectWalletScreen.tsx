import { Container, Typography, Grid } from '@mui/material';

export const ConnectWalletScreen = () => {
  return (
    <Container maxWidth="xl" sx={{ background: '#0c1410' }}>
      <Grid container sx={{ height: '90vh' }}>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            color="white"
            sx={{ marginRight: 5 }}
            variant="h2"
            textAlign="center"
          >
            Connect your wallet to enter this section
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
