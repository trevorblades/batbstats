import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import upperFirst from 'lodash/upperFirst';
import {connect} from 'react-redux';
import theme from '../theme';

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
    skaters: PropTypes.array.isRequired
  };

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
          {this.props.skaters.map(skater => {
            const names = [skater.first_name, skater.last_name].filter(Boolean);
            const fullName = names.join(' ');
            return (
              <ListItem key={skater.id}>
                <Avatar alt={fullName} src={skater.avatar}>
                  {fullName.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={fullName}
                  secondary={upperFirst(skater.stance)}
                />
              </ListItem>
            );
          })}
        </List>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  skaters: state.skaters.items
});

export default connect(mapStateToProps)(Sidebar);
