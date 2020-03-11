// import { NavigationActions } from "react-navigation";
import { StackActions } from '@react-navigation/native';
// TODO(liangqin) implements Navigations
const reset = (navigation, routeName, params) => {
  const action = StackActions.replace(routeName, params);
  navigation.dispatch(action);
};

const go = (navigation, routeName, params) => {
  const action = StackActions.push(routeName, params);
  navigation.dispatch(action);
};

const back = (routeName) => {
  // const backAction = NavigationActions.back({
  //   key: routeName
  // });
  // this.props.navigation.dispatch(backAction);
};

const pop = (navigation, count) => {
  if (!count) { count = 1; }
  const popAction = StackActions.pop(count);
  navigation.dispatch(popAction);
};

const popToTop = (navigation) => {
  const popAction = StackActions.popToTop();
  navigation.dispatch(popAction);
};

export default {
  reset,
  go,
  back,
  pop,
  popToTop,
};
