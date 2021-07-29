import React from 'react';
import {
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from '@chakra-ui/react';

export default function NumberOfRedos(props) {
  return (
    <HStack as="label" fontSize="sm">
      <span>Number of redos</span>
      <NumberInput size="sm" max={10} min={0} {...props}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </HStack>
  );
}
