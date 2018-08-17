import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import map from 'lodash/map';
import styled from 'react-emotion';
import {size} from 'polished';

const Video = styled.div({
  paddingTop: `${9 / 16 * 100}%`,
  position: 'relative'
});

const StyledIframe = styled.iframe(size('100%'), {
  position: 'absolute',
  top: 0,
  left: 0
});

const GameCard = props => (
  <Fragment>
    <DialogTitle disableTypography>
      {props.children}
      <Typography variant="title">
        {map(props.game.skaters, 'full_name').join(' vs. ')}
      </Typography>
      <Typography variant="subheading">
        {props.game.event.short_name} {props.game.round_name}
      </Typography>
    </DialogTitle>
    {props.game.video_id && (
      <Video>
        <StyledIframe
          allowFullScreen
          src={`https://www.youtube.com/embed/${
            props.game.video_id
          }?rel=0&showinfo=0`}
          frameBorder={0}
          allow="autoplay; encrypted-media"
        />
      </Video>
    )}
    <div>
      {!props.game.video_id && <div />}
      <DialogContent>
        <DialogContentText>Game data here</DialogContentText>
      </DialogContent>
    </div>
  </Fragment>
);

GameCard.propTypes = {
  children: PropTypes.node,
  game: PropTypes.object.isRequired
};

export default GameCard;
