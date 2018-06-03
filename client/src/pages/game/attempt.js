import RefreshIcon from '@material-ui/icons/Refresh';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled, {css} from 'react-emotion';
import {size} from 'polished';
import theme from '../../theme';

const Container = styled.div(props => ({
  display: 'flex',
  alignItems: 'center',
  width: '50%',
  marginLeft: props.right ? '50%' : 0,
  justifyContent: props.right ? 'flex-start' : 'flex-end'
}));

const iconClassName = css(size(theme.spacing.unit * 2));

class Attempt extends Component {
  static propTypes = {
    attempt: PropTypes.object.isRequired,
    right: PropTypes.bool.isRequired
  };

  renderRedos() {
    const redos = [];
    for (let i = 0; i < this.props.attempt.redos; i++) {
      redos.push(
        <RefreshIcon
          key={i.toString()}
          color="inherit"
          className={iconClassName}
        />
      );
    }
    return redos;
  }

  render() {
    return (
      <Container right={this.props.right}>
        <Typography>{this.props.attempt.trick.name}</Typography>
        {this.props.attempt.successful && (
          <CheckCircleIcon className={iconClassName} />
        )}
        {this.renderRedos()}
      </Container>
    );
  }
}

export default Attempt;
