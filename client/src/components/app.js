import Helmet from 'react-helmet';
import Paper from '@material-ui/core/Paper';
import React, {Component} from 'react';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import {hot} from 'react-hot-loader';
import theme from '../theme';
import Pages from '../pages';
import Header from './header';
import SkaterList from './skater-list';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});

const InnerContainer = styled.div({
  display: 'flex',
  flexGrow: 1
});

const Sidebar = styled.div({
  width: 360,
  overflow: 'auto',
  backgroundColor: theme.palette.grey[50]
});

const Content = withProps({square: true})(
  styled(Paper)({
    flexGrow: 1,
    overflow: 'auto'
  })
);

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
          <Sidebar>
            <SkaterList />
          </Sidebar>
          <Content>
            <Pages />
          </Content>
        </InnerContainer>
      </Container>
    );
  }
}

export default hot(module)(App);
