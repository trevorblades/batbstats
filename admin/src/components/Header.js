import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex, useColorModeValue} from '@chakra-ui/react';
import {ReactComponent as Logo} from '../assets/logo.svg';

export const HEADER_HEIGHT = 12;

export default function Header({children}) {
  const bg = useColorModeValue('gray.300', 'gray.700');
  return (
    <Flex
      bg={bg}
      as="header"
      pos="sticky"
      top="0"
      align="center"
      px={4}
      zIndex="1"
      h={HEADER_HEIGHT}
    >
      <Box as={Logo} flexShrink={0} mr="3" boxSize={6} fill="current" />
      {children}
    </Flex>
  );
}

Header.propTypes = {
  children: PropTypes.node
};
