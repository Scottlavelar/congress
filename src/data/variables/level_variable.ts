import { isDefined, unique } from '../../helpers';
import { LevelVariable, EVariableType } from '../../types';

export function levelVariable(...config: Partial<LevelVariable>[]) {
  //factory function to create LevelVariable from configuration

  var min = config.map(e => e.min).filter(isDefined);
  var max = config.map(e => e.max).filter(isDefined);
  var step = config.map(e => e.step).filter(isDefined);
  var scale_factor = unique(config.map(e => e.scale_factor).filter(isDefined));
  var optional = config.map(e => e.optional).filter(isDefined);
  var unit = config.map(e => e.unit).filter(isDefined);
  var name = config.map(e => e.name).filter(isDefined);

  var stepSize = step.length ? Math.max(...step) : 1;
  var round = (val: number) => {
    val = Math.round(val / stepSize) * stepSize;
    return parseFloat(val.toPrecision(12));
  };

  var variable: LevelVariable = {
    type: EVariableType.Level,
    min: round(min.length ? Math.min(...min) : 0),
    max: round(max.length ? Math.max(...max) : 255),
    step: stepSize,
    scale_factor: scale_factor.length == 1 ? scale_factor[0] : 1,
    optional: (optional.length && optional.every(e => e)) || false,
    unit: unit.length ? unit.reduce((_acc, val) => val) : '',
    name: name.length ? name.reduce((_acc, val) => val) : undefined,
  };
  return variable;
}

export function levelVariableDisplay(value: any, variable: LevelVariable): string {
  let val = Number(value);
  if (isNaN(val)) return '';

  if (variable.scale_factor != 1) {
    val = val / variable.scale_factor;
    val = Math.round(val / variable.step) * variable.step;
    val = parseFloat(val.toPrecision(12));
    if (val > variable.max) val = variable.max;
    else if (val < variable.min) val = variable.min;
  }
  return `${val}${variable.unit}`;
}
