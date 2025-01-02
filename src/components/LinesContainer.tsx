import React from 'react';
import { Box } from '@chakra-ui/react';
import Line from './Line';

const LinesContainer = () => {
  return (
    <Box position="absolute" top="0" left="0" right="0" height="100%" margin="auto" width="90vw">
      <Line delay={0} position="left" />
      <Line delay={2} position="center" />
      <Line delay={2.5} position="right" />
    </Box>
  );
};

export default LinesContainer;