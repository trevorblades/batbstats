import RefreshIcon from '@material-ui/icons/Refresh';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled, {css} from 'react-emotion';
import {size} from 'polished';
import theme from '../../theme';

const Container = styled.div(props => ({
  width: '50%',
  marginLeft: props.right ? '50%' : 0,
  textAlign: props.right ? 'left' : 'right'
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
        {this.props.attempt.trick.name}
        <div>
          {this.props.attempt.successful && (
            <CheckCircleIcon color="secondary" className={iconClassName} />
          )}
          {this.renderRedos()}
        </div>
      </Container>
    );
  }
}

export default Attempt;
