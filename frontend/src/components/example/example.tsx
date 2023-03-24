import React from 'react';
import { Card, Typography, Button, CardContent, CardActions } from '@mui/material';
import { Box } from '@mui/system';

const Example = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
      }}>
      <Card>
        <CardContent>
          <Typography variant="h3" align="left">
            Example Card
          </Typography>

          <Typography variant="body1" align="left">
            This is an example component
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Find Out More</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Example;
