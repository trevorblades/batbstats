import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex, useColorModeValue} from '@chakra-ui/react';
import {ReactComponent as Logo} from '../assets/logo.svg';

export default function Header({title = 'BATB Stats', children}) {
  const bg = useColorModeValue('gray.50', 'gray.700');
  return (
    <Flex
      bg={bg}
      as="header"
      pos="sticky"
      top="0"
      align="center"
      px={4}
      zIndex="1"
      h={12}
    >
      <Box as={Logo} mr="3" boxSize={6} fill="current" />
      {title}
      {children}
    </Flex>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};
