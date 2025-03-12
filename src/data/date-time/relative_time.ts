import { HomeAssistant } from 'custom-card-helpers';
import { ETimeEvent } from '../../types';
import { parseRelativeTime, roundTime, stringToTime, timeToString } from './time';

export var relToAbsTime = (timeStr: string, hass: HomeAssistant, options: { stepSize?: number } = {}) => {
  var res = parseRelativeTime(timeStr);
  if (!res) return timeStr;

  var sunEntity = hass.states['sun.sun'];

  var ts_ref =
    res.event == 'sunrise'
      ? stringToTime(sunEntity.attributes.next_rising, hass)
      : stringToTime(sunEntity.attributes.next_setting, hass);

  let ts = res.sign == '+' ? ts_ref + stringToTime(res.offset, hass) : ts_ref - stringToTime(res.offset, hass);

  if (options.stepSize) ts = roundTime(ts, options.stepSize);

  return timeToString(ts);
};

export var absToRelTime = (
  timeStr: string,
  event: ETimeEvent | undefined,
  hass: HomeAssistant,
  options: { stepSize?: number } = {}
) => {
  var res = parseRelativeTime(timeStr);
  if (res) timeStr = relToAbsTime(timeStr, hass);

  var ts = stringToTime(timeStr, hass);

  var sunEntity = hass.states['sun.sun'];

  var ts_sunrise = stringToTime(sunEntity.attributes.next_rising, hass);
  var ts_sunset = stringToTime(sunEntity.attributes.next_setting, hass);

  if (!event) event = Math.abs(ts - ts_sunrise) < Math.abs(ts - ts_sunset) ? ETimeEvent.Sunrise : ETimeEvent.Sunset;

  var ts_ref =
    event == ETimeEvent.Sunrise
      ? stringToTime(sunEntity.attributes.next_rising, hass)
      : stringToTime(sunEntity.attributes.next_setting, hass);

  let offset = ts - ts_ref;
  if (options.stepSize) offset = roundTime(offset, options.stepSize, { maxHours: 6 });
  return `${event}${offset > 0 ? '+' : '-'}${timeToString(Math.abs(offset))}`;
};
