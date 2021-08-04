import Fuse from 'fuse.js';
import PropTypes from 'prop-types';
import React, {useMemo, useState} from 'react';
import {ArrowDownIcon, ArrowUpIcon} from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem
} from '@chakra-ui/react';
import {useCombobox} from 'downshift';

export default function TrickCombobox({tricks, abd, onChange}) {
  const items = useMemo(
    () => tricks.filter(trick => !abd.includes(trick.id)),
    [tricks, abd]
  );

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ['name'],
        threshold: 0.4
      }),
    [items]
  );

  const [inputItems, setInputItems] = useState(items);
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    items: inputItems,
    itemToString: item => item?.name || '',
    onInputValueChange: ({inputValue}) =>
      setInputItems(fuse.search(inputValue).map(result => result.item)),
    onSelectedItemChange: onChange,
    defaultHighlightedIndex: 0
  });

  return (
    <Box flexGrow={1}>
      <InputGroup {...getComboboxProps()}>
        <Input
          {...getInputProps()}
          roundedRight={0}
          placeholder="Start typing a trick"
        />
        <InputRightElement>
          <IconButton
            {...getToggleButtonProps()}
            size="xs"
            fontSize="md"
            aria-label={'toggle menu'}
          >
            {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </IconButton>
        </InputRightElement>
      </InputGroup>
      <List
        {...getMenuProps()}
        textAlign="left"
        bg="gray.700"
        mt={2}
        rounded="md"
        overflow="hidden"
      >
        {isOpen &&
          inputItems.map((item, index) => {
            const isHighlighted = highlightedIndex === index;
            return (
              <ListItem
                px={4}
                py={3}
                key={item.id}
                color={isHighlighted && 'gray.900'}
                bg={
                  isHighlighted
                    ? 'blue.200'
                    : index % 2
                    ? 'whiteAlpha.50'
                    : 'none'
                }
                transition="all 250ms"
                {...getItemProps({item, index})}
              >
                {item.name}
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
}

TrickCombobox.propTypes = {
  tricks: PropTypes.array.isRequired,
  abd: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
