import { INFTItem } from '../../../interfaces/marketplaceInterfaces';
import {
  CardActionArea,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid
} from '@mui/material';
import { ethers } from 'ethers';
import { mainTheme } from '../../../common/mainTheme';
import EthereumIcon from '../../../assets/blockchains/ethereum-icon.png';

interface IProps {
  item: INFTItem;
  handleClickCard: (item: INFTItem) => void;
  handleClickPurchaseItem: (item: INFTItem) => void;
}

export const NFTMarketplaceCard = ({
  item,
  handleClickCard,
  handleClickPurchaseItem
}: IProps) => {
  return (
    <Card
      sx={{ maxWidth: 300, ml: 2, mr: 2, mb: 4 }}
      style={{
        background: `linear-gradient(to right bottom, ${
          item.latestPrice > 0
            ? mainTheme.terciaryColor
            : mainTheme.primaryColor
        }, ${mainTheme.secondaryColor})`
      }}
    >
      <CardActionArea onClick={() => handleClickCard(item)}>
        <CardMedia
          component="img"
          height="300"
          src={item.image}
          alt={item.name}
        />
        <CardContent>
          {/* Name */}
          <Grid
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            {
              <>
                <Typography
                  variant="caption"
                  color={mainTheme.textColor}
                  fontWeight="bold"
                  fontSize={16}
                >
                  {item.name}{' '}
                  <Typography
                    variant="caption"
                    color={mainTheme.textColor}
                  >{` #${String(item.tokenId)}`}</Typography>
                </Typography>
                <Typography
                  variant="caption"
                  color={mainTheme.textColor}
                  fontSize={16}
                >
                  Price
                </Typography>
              </>
            }
          </Grid>

          {/* Team and price */}
          <Grid
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {
              <>
                <Grid display="flex" alignItems="center">
                  <Typography
                    variant="caption"
                    color={mainTheme.textColor}
                    textAlign="center"
                    fontSize={14}
                    fontWeight="600"
                  >
                    {item.team ? item.team : item.game}
                  </Typography>
                </Grid>
                <Grid display="flex" alignItems="center">
                  <img
                    src={EthereumIcon}
                    alt="logo"
                    width={10}
                    height={14}
                    style={{ marginRight: 4 }}
                  />
                  <Typography
                    variant="caption"
                    color={mainTheme.textColor}
                    textAlign="center"
                    fontSize={14}
                    fontWeight="600"
                  >
                    {ethers.utils.formatEther(item.totalPrice)}
                  </Typography>
                </Grid>
              </>
            }
          </Grid>

          {/* Game and latest price */}
          <Grid
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {
              <>
                {item.team && (
                  <Grid display="flex" alignItems="center">
                    <Typography
                      variant="caption"
                      color={mainTheme.textColor}
                      textAlign="center"
                      fontSize={14}
                      fontWeight="600"
                    >
                      {item.game}
                    </Typography>
                  </Grid>
                )}
                <Grid
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  {item.latestPrice > 0 ? (
                    <>
                      <Typography variant="caption" color={mainTheme.textColor}>
                        Last
                      </Typography>
                      <img
                        src={EthereumIcon}
                        alt="logo"
                        width={10}
                        height={14}
                        style={{ marginLeft: 4, marginRight: 4 }}
                      />
                      <Typography
                        variant="caption"
                        color={mainTheme.textColor}
                        fontWeight="bold"
                      >
                        {ethers.utils.formatEther(item.latestPrice)}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="caption"
                      color={mainTheme.textColor}
                      fontWeight="bold"
                      letterSpacing={2}
                    >
                      NEW
                    </Typography>
                  )}
                </Grid>
              </>
            }
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          size="small"
          color="primary"
          variant="outlined"
          component="label"
          onClick={() => handleClickPurchaseItem(item)}
        >
          Buy now
        </Button>
      </CardActions>
    </Card>
  );
};
