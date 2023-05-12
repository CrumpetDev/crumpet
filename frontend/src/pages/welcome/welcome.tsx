import React from 'react';
import { Container, Divider, Typography } from '@mui/material';
import { Example } from 'components';

const Welcome = () => {
  return (
    <Container>
      <Typography variant="h1">Welcome</Typography>
      <Divider />
      <Example />
    </Container>
  );
};

export default Welcome;
