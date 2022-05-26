import { ReactNode } from 'react';
import { Typography, Grid, Box, useTheme, useMediaQuery } from '@mui/material';

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
          background: 'linear-gradient(to right bottom, #192112, #5e7b37)',
        }}
      >
        <Grid item display="flex" justifyContent="center" alignItems="center">
          {imageIcon}
        </Grid>
        <Typography
          color="white"
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
