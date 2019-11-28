import React from 'react';
import UserStatus from './user-status';
import {Box, NoSsr} from '@material-ui/core';
import {Link} from 'gatsby';
import {ReactComponent as Logo} from 'twemoji/2/svg/1f6f9.svg';
import {LogoTitleProps} from '@trevorblades/mui-theme';
import {useTitle} from '../utils';

export default function Header() {
  const title = useTitle();
  return (
    <Box
      height={64}
      px={3}
      display="flex"
      alignItems="center"
      bgcolor="white"
      position="sticky"
      top={0}
      zIndex="appBar"
    >
      <Box
        {...LogoTitleProps.root}
        component={Link}
        to="/"
        color="inherit"
        mr="auto"
        style={{textDecoration: 'none'}}
      >
        <Box {...LogoTitleProps.logo} component={Logo} />
        <Box {...LogoTitleProps.title}>{title}</Box>
      </Box>
      <NoSsr>
        <UserStatus />
      </NoSsr>
    </Box>
  );
}
