import { HassEntity } from 'home-assistant-js-websocket';
import { isDefined } from '../helpers';

export let numericAttribute = (stateObj: HassEntity | undefined, attribute: string | number, fallback?: number) => {
  if (typeof attribute == 'number') return attribute;
  if (!isDefined(stateObj) || !isDefined(stateObj.attributes[attribute])) return fallback;

  let val = stateObj.attributes[attribute];
  if (typeof val == 'number') return val;
  return fallback;
};

export let listAttribute = (stateObj: HassEntity | undefined, attribute: string, initializer: string[] = []) => {
  if (!isDefined(stateObj) || !isDefined(stateObj.attributes[attribute])) return initializer;

  let val = stateObj.attributes[attribute];
  if (Array.isArray(val)) return val.map(e => String(e));
  return initializer;
};

export let stringAttribute = (stateObj: HassEntity | undefined, attribute: string, initializer = '') => {
  if (!isDefined(stateObj) || !isDefined(stateObj.attributes[attribute])) return initializer;

  let val = stateObj.attributes[attribute];
  if (typeof val == 'string') return val;
  return initializer;
};
