import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled, {css} from 'react-emotion';
import upperFirst from 'lodash/upperFirst';
import withProps from 'recompose/withProps';
import {connect} from 'react-redux';
import {size} from 'polished';
import theme from '../../theme';
import {getAge, getWins} from '../../selectors/skater';
import {getFullName} from '../../util/skater';

const flexAlignCenter = css({
  display: 'flex',
  alignItems: 'center'
});

const Container = styled.div(flexAlignCenter, {
  flexDirection: 'column',
  flexShrink: 0,
  padding: theme.spacing.unit * 3
});

const StyledAvatar = styled(Avatar)(size(64), {
  marginBottom: theme.spacing.unit * 2
});

const Details = styled.div(flexAlignCenter, {
  marginTop: theme.spacing.unit,
  color: theme.palette.grey[400]
});

const Detail = withProps({
  color: 'inherit',
  noWrap: true
})(
  styled(Typography)({
    ':not(:last-child)::after': {
      content: "'·'",
      margin: `0 ${theme.spacing.unit}px`
    }
  })
);

class Header extends Component {
  static propTypes = {
    age: PropTypes.number,
    games: PropTypes.array.isRequired,
    skater: PropTypes.object.isRequired,
    wins: PropTypes.array.isRequired
  };

  renderDetails() {
    const winCount = this.props.wins.length;
    const details = [
      `${winCount}-${this.props.games.length - winCount}`,
      this.props.skater.hometown,
      this.props.skater.stance && upperFirst(this.props.skater.stance),
      this.props.age && `${this.props.age} years old`
    ].filter(Boolean);

    return (
      <Details>
        {details.map((detail, index) => (
          <Detail key={index.toString()}>{detail}</Detail>
        ))}
      </Details>
    );
  }

  render() {
    return (
      <Container>
        <StyledAvatar src={this.props.skater.avatar}>
          {this.props.skater.first_name.charAt(0).toUpperCase()}
        </StyledAvatar>
        <Typography variant="title">
          {getFullName(this.props.skater)}
        </Typography>
        {this.renderDetails()}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const {games, ...skater} = state.skater.properties;
  return {
    games,
    skater,
    age: getAge(state),
    wins: getWins(state)
  };
};

export default connect(mapStateToProps)(Header);
