import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {Box, Divider, Typography} from '@material-ui/core';
import {CardActionArea} from 'gatsby-theme-material-ui';
import {getEmojiFlag} from 'countries-list';

export default function BracketSegment(props) {
  const {bye, id, skaters, letters, round, children} = props.game;
  return (
    <Box
      display="flex"
      flexDirection="row-reverse"
      alignItems="center"
      justifyContent="flex-end"
    >
      <Box my={2} pr={round === 6 ? 4 : 0} borderRadius="borderRadius">
        <CardActionArea
          disabled={Boolean(bye)}
          to={`/games/${id}`}
          style={{
            borderRadius: 'inherit',
            userSelect: 'none'
          }}
        >
          <Box
            flexShrink={0}
            width={200}
            bgcolor="background.paper"
            border={1}
            borderColor="divider"
            borderRadius="inherit"
          >
            {skaters.map((skater, index) => {
              const isBye = bye === skater.id;
              return (
                <Fragment key={skater.id}>
                  <Box my={1 / 2} mx={1}>
                    <Typography
                      noWrap
                      title={skater.fullName}
                      color={
                        isBye || letters[skater.id] === 5
                          ? 'textSecondary'
                          : 'inherit'
                      }
                    >
                      {isBye ? (
                        'Bye'
                      ) : (
                        <>
                          <span
                            style={{
                              textDecoration: skater.replaced
                                ? 'line-through'
                                : 'none'
                            }}
                          >
                            {getEmojiFlag(skater.country)} {skater.fullName}
                          </span>
                        </>
                      )}
                    </Typography>
                  </Box>
                  {!index && <Divider />}
                </Fragment>
              );
            })}
          </Box>
        </CardActionArea>
      </Box>
      {round > 1 && (
        <Box display="flex" alignSelf="stretch" alignItems="center">
          <Box
            width={16}
            height="calc(50% + 1px)"
            border={1}
            borderColor="divider"
            borderLeft={0}
          />
          <Box width={16} height="1px" bgcolor="divider" />
        </Box>
      )}
      {children && (
        <div>
          {children.map(child => (
            <BracketSegment key={child.id} game={child} />
          ))}
        </div>
      )}
    </Box>
  );
}

BracketSegment.propTypes = {
  game: PropTypes.object.isRequired
};
