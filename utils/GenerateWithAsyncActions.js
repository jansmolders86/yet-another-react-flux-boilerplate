export default function generateWithAsyncActions(alt, asyncActions, actions) {
  if (!alt){
    return null;
  }

  if (!actions){
    actions = [];
  }

  if (!asyncActions){
    asyncActions = [];
  }

  if (!!asyncActions){
    var asyncActionsArray = [];
    for (var i=0; i < asyncActions.length; i++) {
      var action = asyncActions[i];
      asyncActionsArray.push(action, `${action}Starting`, `${action}Success`, `${action}Failure`);
    }
  }

  return alt.generateActions.apply(alt, asyncActionsArray.concat(actions));
};
