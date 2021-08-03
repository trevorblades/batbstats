import Layout from './src/components/Layout';
import React from 'react';

export function wrapPageElement({element, props}) {
  return <Layout {...props}>{element}</Layout>;
}
