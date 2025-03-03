import { isEqual } from '../../helpers';
import { Action, EVariableType, LevelVariable, ListVariable } from '../../types';

export function compareActions(actionA: Action, actionB: Action, allowVars = false) {
  let isOptional = (variable: string, action: Action) => {
    return (
      Object.keys(action.variables || {}).includes(variable) &&
      action.variables![variable].type == EVariableType.Level &&
      (action.variables![variable] as LevelVariable).optional
    );
  };

  //actions should have the same service
  if (actionA.service !== actionB.service) return false;

  let serviceDataA = Object.keys(actionA.service_data || {});
  let variablesA = Object.keys(actionA.variables || {});

  let serviceDataB = Object.keys(actionB.service_data || {});
  let variablesB = Object.keys(actionB.variables || {});

  let argsA = [...new Set([...serviceDataA, ...variablesA])];
  let argsB = [...new Set([...serviceDataB, ...variablesB])];
  let allArgs = [...new Set([...argsA, ...argsB])];

  return allArgs.every(arg => {
    // both actions must have the parameter in common
    if (!argsA.includes(arg)) return isOptional(arg, actionB);
    if (!argsB.includes(arg)) return isOptional(arg, actionA);

    // if its a fixed parameter it must be equal
    if (
      serviceDataA.filter(e => !variablesA.includes(e)).includes(arg) &&
      serviceDataB.filter(e => !variablesB.includes(e)).includes(arg)
    )
      return isEqual(actionA.service_data![arg], actionB.service_data![arg]);

    // if both are variables they are assumed to be equal
    if (variablesA.includes(arg) && variablesB.includes(arg)) return true;

    if (!allowVars) return false;

    // compare a fixed value with variable
    let value = serviceDataA.includes(arg) ? actionA.service_data![arg] : actionB.service_data![arg];

    let variable = variablesA.includes(arg) ? actionA.variables![arg] : actionB.variables![arg];

    if (variable.type === EVariableType.List) {
      return (variable as ListVariable).options.some(e => e.value === value);
    } else if (variable.type === EVariableType.Level) return !isNaN(value);
    else if (variable.type == EVariableType.Text) return true;

    return false;
  });
}
