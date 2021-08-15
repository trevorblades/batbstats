import Header from '../../components/Header';
import NoSSR from '@mpth/react-no-ssr';
import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  SimpleGrid
} from '@chakra-ui/react';
import {LIST_TRICKS} from '../../utils';
import {groupBy} from 'lodash';
import {useQuery} from '@apollo/client';

function ListTricks() {
  const {data, loading, error} = useQuery(LIST_TRICKS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const variations = groupBy(data.tricks, 'variation');

  return (
    <SimpleGrid columns={2} flexGrow="1" overflow="hidden">
      {Object.entries(variations).map(([variation, tricks]) => (
        <Box key={variation} overflow="auto" pos="relative">
          <Heading size="md" pos="sticky" top="0">
            {variation}
          </Heading>
          <List>
            {tricks.map(trick => (
              <ListItem key={trick.id}>
                <Button
                  isFullWidth
                  variant="ghost"
                  rounded="none"
                  fontWeight="normal"
                  justifyContent="flex-start"
                >
                  {trick.name}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </SimpleGrid>
  );
}

export default function EditTricks() {
  return (
    <Flex h="100vh" direction="column">
      <Header>All tricks</Header>
      <NoSSR>
        <ListTricks />
      </NoSSR>
    </Flex>
  );
}
