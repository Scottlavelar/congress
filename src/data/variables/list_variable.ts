import { isDefined, flatten } from '../../helpers';
import { ListVariableOption, ListVariable, EVariableType, AtLeast } from '../../types';

export function listVariable(...config: AtLeast<ListVariable, 'options'>[]) {
  //factory function to create ListVariable from configuration

  var commonOptions = config[0].options
    .map(e => e.value)
    .filter(option => config.map(e => e.options).every(list => list.map(e => e.value).includes(option)));

  var options: ListVariableOption[] = commonOptions.map(val => {
    var name = config
      .map(e => e.options.find(o => o.value == val))
      .filter(isDefined)
      .map(e => e.name)
      .filter(isDefined);
    var icon = config
      .map(e => e.options.find(o => o.value == val))
      .filter(isDefined)
      .map(e => e.icon)
      .filter(isDefined);

    let item: ListVariableOption = {
      value: val,
      name: name.length ? name.reduce((_acc, val) => val) : undefined,
      icon: icon.length ? icon.reduce((_acc, val) => val) : undefined,
    };
    return item;
  });

  var name = config.map(e => e.name).filter(isDefined);

  var variable: ListVariable = {
    type: EVariableType.List,
    name: name.length ? name.reduce((_acc, val) => val) : undefined,
    options: options,
  };
  return variable;
}

export function listVariableDisplay(value: any, variable: ListVariable): string {
  var option = variable.options.find(e => e.value == value);
  return option ? option.name || option.value : '';
}
