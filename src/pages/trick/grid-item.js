import Grid from '@material-ui/core/Grid';
import withProps from 'recompose/withProps';

const GridItem = withProps({
  item: true,
  xs: 4
})(Grid);

export default GridItem;
