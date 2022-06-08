import { Container, Typography, Grid, Paper } from '@mui/material';
import { mainTheme } from '../../../common/mainTheme';
import MuiIcon from '../../../assets/technologies/mui.png';
import ReactIcon from '../../../assets/technologies/react.png';
import ReduxIcon from '../../../assets/technologies/redux.png';
import SolidityIcon from '../../../assets/technologies/solidity.png';
import TruffleIcon from '../../../assets/technologies/truffle.png';
import TypescriptIcon from '../../../assets/technologies/typescript.png';

export const DevelopmentScreen = () => {
  return (
    <Container maxWidth="xl" sx={{ paddingTop: 2 }}>
      <Grid display="flex" justifyContent="center">
        <Grid>
          <Typography
            color={mainTheme.primaryColor}
            variant="subtitle1"
            textAlign="center"
          >
            Development
          </Typography>
          <Typography
            color={mainTheme.textColor}
            variant="h4"
            sx={{ letterSpacing: -0.2 }}
          >
            HOW GAMING KARDZ IS BUILT
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
        sx={{ paddingLeft: 2, paddingRight: 2, marginTop: 5 }}
      >
        <Paper sx={{ padding: 2, backgroundColor: mainTheme.primaryColor }}>
          <Typography variant="subtitle1" fontWeight="bold">
            This App was created with tecnologies above
          </Typography>
          <Grid container alignItems="center" sx={{ mt: 1 }}>
            <img
              src={ReactIcon}
              alt="react"
              width={24}
              height={24}
              style={{ marginRight: 5 }}
            />
            React
          </Grid>
          <Grid container alignItems="center" sx={{ mt: 1 }}>
            <img
              src={TypescriptIcon}
              alt="typescript"
              width={24}
              height={24}
              style={{ marginRight: 5 }}
            />
            Typescript
          </Grid>
          <Grid container alignItems="center" sx={{ mt: 1 }}>
            <img
              src={ReduxIcon}
              alt="redux"
              width={24}
              height={24}
              style={{ marginRight: 5 }}
            />
            Redux
          </Grid>
          <Grid container alignItems="center" sx={{ mt: 1 }}>
            <img
              src={MuiIcon}
              alt="mui"
              width={24}
              height={24}
              style={{ marginRight: 5 }}
            />
            Material UI
          </Grid>
          {/* <Grid container alignItems="center" sx={{ mt: 1 }}>
            <img
              src={ReactTestingLibraryIcon}
              alt="react-testing-library"
              width={24}
              height={24}
              style={{ marginRight: 5 }}
            />
            React Testing Library
          </Grid> */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
            Smart Contract technology
          </Typography>
          <Grid container alignItems="center" sx={{ mt: 1 }}>
            <img
              src={SolidityIcon}
              alt="solidity"
              width={24}
              height={24}
              style={{ marginRight: 5 }}
            />
            Solidity
          </Grid>
          <Grid container alignItems="center" sx={{ mt: 1 }}>
            <img
              src={TruffleIcon}
              alt="truffle"
              width={24}
              height={24}
              style={{ marginRight: 5 }}
            />
            Truffle
          </Grid>
        </Paper>
      </Grid>
    </Container>
  );
};
