import React from 'react';
import { Box, keyframes } from '@chakra-ui/react';

interface LineProps {
  delay: number;
  position: 'left' | 'center' | 'right';
}

const dropAnimation = keyframes`
  0% {
    top: -50%;
  }
  100% {
    top: 110%;
  }
`;

const Line = ({ delay, position }: LineProps) => {
  const marginLeft = position === 'left' ? '-25%' : position === 'right' ? '25%' : '0';

  return (
    <Box
      position="absolute"
      width="1px"
      height="100%"
      top="0"
      left="50%"
      background="rgba(255, 255, 255, 0.1)"
      marginLeft={marginLeft}
      overflow="hidden"
    >
      <Box
        content="''"
        display="block"
        position="absolute"
        height="15vh"
        width="100%"
        top="-50%"
        left="0"
        background="linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #ffffff 75%, #ffffff 100%)"
        animation={`${dropAnimation} 7s ${delay}s infinite`}
      // animationFillMode="left"
      // animationTimingFunction="cubic-bezier(0.4, 0.26, 0, 0.97)"
      />
    </Box>
  );
};

export default Line;