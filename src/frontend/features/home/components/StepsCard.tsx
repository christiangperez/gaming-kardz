import { ReactNode } from 'react';
import { Typography, Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import { mainTheme } from '../../../common/mainTheme';

interface IProps {
  imageIcon: ReactNode;
  description: string;
}

export const StepsCard = ({ imageIcon, description }: IProps) => {
  const theme = useTheme();
  const isSmOrLess = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid
      item
      xs={12}
      md={3}
      sx={{ paddingTop: { xs: 0, md: 4 }, paddingBottom: 4 }}
      display="flex"
      justifyContent="center"
    >
      <Box
        width={280}
        border={0.1}
        borderColor="#d0f177"
        sx={{ borderRadius: '24px', paddingTop: 2, paddingBottom: 2 }}
        style={{
          background: `linear-gradient(to right bottom, ${mainTheme.secondaryColor}, ${mainTheme.terciaryColor})`
        }}
      >
        <Grid item display="flex" justifyContent="center" alignItems="center">
          {imageIcon}
        </Grid>
        <Typography
          color={mainTheme.textColor}
          fontWeight="bold"
          align={isSmOrLess ? 'center' : 'inherit'}
          variant={isSmOrLess ? 'body1' : 'h6'}
          textAlign="center"
          sx={{ marginTop: 2 }}
        >
          {description}
        </Typography>
      </Box>
    </Grid>
  );
};
