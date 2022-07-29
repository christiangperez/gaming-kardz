import {
  Container,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../redux/store/store';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { mainTheme } from '../../../common/mainTheme';
import EthereumIcon from '../../../assets/blockchains/ethereum-icon.png';

export const NFTTransactions = () => {
  const { nftTransactions } = useSelector((state: IRootState) => state.market);

  return (
    <>
      <Grid
        sx={{ background: mainTheme.primaryColor, marginTop: 5, pt: 2, pb: 2 }}
      >
        <Container>
          <Typography variant="h6">Token Transactions</Typography>
        </Container>
      </Grid>
      <Container sx={{ marginTop: 2 }}>
        <TableContainer
          component={Paper}
          style={{
            background: `linear-gradient(to right bottom, ${mainTheme.terciaryColor}, ${mainTheme.secondaryColor})`
          }}
        >
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Event
                </TableCell>
                <TableCell
                  sx={{ color: 'white', fontWeight: 'bold' }}
                  align="right"
                >
                  Price
                </TableCell>
                <TableCell
                  sx={{ color: 'white', fontWeight: 'bold' }}
                  align="left"
                >
                  From
                </TableCell>
                <TableCell
                  sx={{ color: 'white', fontWeight: 'bold' }}
                  align="left"
                >
                  To
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nftTransactions?.map((item, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: 'white'
                    }}
                  >
                    <CompareArrowsIcon
                      sx={{
                        fontSize: 14,
                        marginRight: 1
                      }}
                    />
                    Transfer
                  </TableCell>
                  <TableCell sx={{ color: 'white' }} align="right">
                    <img
                      src={EthereumIcon}
                      alt="logo"
                      width={10}
                      height={14}
                      style={{ marginRight: 4 }}
                    />
                    {ethers.utils.formatEther(item.totalPrice)}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }} align="left">
                    {item.seller}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }} align="left">
                    {item.buyer}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};
