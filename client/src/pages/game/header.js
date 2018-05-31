import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {getFullName} from '../../util/skater';
import {getTitle} from '../../selectors/game';

const Container = styled.div({
  display: 'flex'
});

const Name = styled(Typography)({
  flexGrow: 1,
  width: 0,
  ':last-child': {
    textAlign: 'right'
  }
});

class Header extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  };

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{this.props.title}</title>
        </Helmet>
        <Container>
          <Name>{getFullName(this.props.game.skaters[0])}</Name>
          <Typography variant="title">{this.props.game.event.name}</Typography>
          <Name>{getFullName(this.props.game.skaters[1])}</Name>
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game.properties,
  title: getTitle(state)
});

export default connect(mapStateToProps)(Header);
