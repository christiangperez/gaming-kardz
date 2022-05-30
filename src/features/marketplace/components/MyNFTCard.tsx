import {
  CardActionArea,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
} from '@mui/material';
import { ethers } from 'ethers';
import { INFTItem } from '../../../interfaces/marketplaceInterfaces';

interface IProps {
  item: INFTItem;
  handleClickCard: (item: INFTItem) => void;
  handleClickOpenSetOnSale: (item: INFTItem) => void;
}

export const MyNFTCard = ({
  item,
  handleClickCard,
  handleClickOpenSetOnSale,
}: IProps) => {
  return (
    <Card
      sx={{ maxWidth: 300, ml: 2, mr: 2, mb: 4 }}
      style={{
        background: `linear-gradient(to right bottom, ${
          item.latestPrice > 0 ? '#5e7b37' : '#d0f177'
        }, #192112)`,
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
                  color="white"
                  fontWeight="bold"
                  fontSize={16}
                >
                  {item.name}{' '}
                  <Typography variant="caption" color="white">{` #${String(
                    item.itemId
                  )}`}</Typography>
                </Typography>
                <Typography
                  variant="caption"
                  color="white"
                  textAlign="center"
                  fontSize={14}
                  fontWeight="600"
                >
                  {item.team ? item.team : item.game}
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
                    color="white"
                    textAlign="center"
                    fontSize={14}
                    fontWeight="600"
                  >
                    {item.team ? item.team : item.game}
                  </Typography>
                </Grid>
                <Grid display="flex" alignItems="center">
                  <Typography variant="caption" color="white">
                    Bought
                  </Typography>
                  <img
                    src="../../assets/ether-gold.png"
                    alt="logo"
                    width={16}
                    height={16}
                    style={{ marginLeft: 2, marginRight: 2 }}
                  />
                  <Typography
                    variant="caption"
                    color="white"
                    textAlign="center"
                    fontSize={14}
                    fontWeight="600"
                  >
                    {ethers.utils.formatEther(item.latestPrice)}
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
                      color="white"
                      textAlign="center"
                      fontSize={14}
                      fontWeight="600"
                    >
                      {item.game}
                    </Typography>
                  </Grid>
                )}
              </>
            }
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
        {item.onSale ? (
          <Typography color="primary" fontWeight="bold">
            ON SALE FOR {ethers.utils.formatEther(item.price)} ETH
          </Typography>
        ) : (
          <Button
            size="small"
            color="primary"
            variant="outlined"
            component="label"
            onClick={() => handleClickOpenSetOnSale(item)}
          >
            Set ON SALE
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
