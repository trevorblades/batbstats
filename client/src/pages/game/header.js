import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import theme from '../../theme';
import {getRoundName} from '../../util/game';
import {getFullName} from '../../util/skater';
import {getTitle} from '../../selectors/game';

const Container = withProps({
  elevation: 0,
  color: 'inherit',
  position: 'sticky'
})(AppBar);

const InnerContainer = styled.div({
  padding: theme.spacing.unit * 2
});

const Names = styled.div({
  display: 'flex'
});

const Name = styled(Typography)({
  width: '50%',
  ':first-child': {
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
      <Container>
        <Helmet>
          <title>{this.props.title}</title>
        </Helmet>
        <InnerContainer>
          <Typography align="center" variant="subheading">
            {this.props.game.event.name} {getRoundName(this.props.game.round)}
          </Typography>
          <Names>
            {this.props.game.skaters.map(skater => (
              <Name key={skater.id}>
                <Link to={`/skaters/${skater.id}`}>{getFullName(skater)}</Link>
              </Name>
            ))}
          </Names>
        </InnerContainer>
        <Divider />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game.properties,
  title: getTitle(state)
});

export default connect(mapStateToProps)(Header);
