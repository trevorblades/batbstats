import Helmet from 'react-helmet';
import React, {Component} from 'react';
import styled from 'react-emotion';
import {hot} from 'react-hot-loader';
import theme from '../theme';
import Pages from '../pages';
import Header from './header';
import Sidebar from './sidebar';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});

const InnerContainer = styled.div({
  display: 'flex',
  flexGrow: 1
});

const Content = styled.div({
  flexGrow: 1,
  padding: theme.spacing.unit * 3,
  backgroundColor: theme.palette.grey[50]
});

class App extends Component {
  render() {
    return (
      <Container>
        <Helmet
          defaultTitle={process.env.TITLE}
          titleTemplate={`%s · ${process.env.TITLE}`}
        />
        <Header />
        <InnerContainer>
          <Sidebar />
          <Content>
            <Pages />
          </Content>
        </InnerContainer>
      </Container>
    );
  }
}

export default hot(module)(App);
