import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import {connect} from 'react-redux';
import theme from '../../theme';
import {load as loadSkaters} from '../../actions/skaters';
import SkaterListItem from './skater-list-item';

const Container = styled.div({
  width: 360,
  overflow: 'auto',
  backgroundColor: theme.palette.common.white
});

const inheritBackgroundColor = css({
  backgroundColor: 'inherit'
});

class Sidebar extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    skaters: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.dispatch(loadSkaters());
  }

  render() {
    return (
      <Container>
        <List
          className={inheritBackgroundColor}
          subheader={
            <ListSubheader className={inheritBackgroundColor}>
              All skaters
            </ListSubheader>
          }
        >
          {this.props.skaters.map(skater => (
            <SkaterListItem key={skater.id} skater={skater} />
          ))}
        </List>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  skaters: state.skaters.items
});

export default connect(mapStateToProps)(Sidebar);
