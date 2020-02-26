// import { NavigationActions } from "react-navigation";
// TODO(liangqin) implements Navigations
const reset = (navigation, routeName) => {
  // const resetAction = NavigationActions.navigate({
  //   routeName,
  //   action: [NavigationActions.navigate({ routeName })]
  // });
  // navigation.dispatch(resetAction);
};

const go = (navigation, routeName, params) => {
  // const resetAction = NavigationActions.navigate({
  //   routeName,
  //   params,
  //   action: [NavigationActions.navigate({ routeName })]
  // });
  // navigation.dispatch(resetAction);
};

const back = (routeName) => {
  // const backAction = NavigationActions.back({
  //   key: routeName
  // });
  // this.props.navigation.dispatch(backAction);
};

export default {
  reset,
  go,
  back,
};
