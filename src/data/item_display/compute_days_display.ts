import { HomeAssistant } from 'custom-card-helpers';
import { getLocale } from '../../helpers';
import { localize } from '../../localize/localize';
import { WeekdayType, EDayType } from '../../types';
import { formatWeekday } from '../date-time/format_weekday';
import { weekdayToList } from '../date-time/weekday_to_list';
import { weekdayType } from '../date-time/weekday_type';

export var computeDaysDisplay = (weekdays: WeekdayType, hass: HomeAssistant) => {
  function findSequence(list: number[]): number[] {
    var len: number[] = [];
    for (let i = 0; i < list.length - 1; i++) {
      let j = i + 1;
      while (list[j] - list[j - 1] == 1) j++;
      len.push(j - i);
    }
    return len;
  }

  if (!hass) return '';
  switch (weekdayType(weekdays)) {
    case EDayType.Daily:
      return localize('ui.components.date.day_types_long.daily', getLocale(hass));
    case EDayType.Workday:
      return localize('ui.components.date.day_types_long.workdays', getLocale(hass));
    case EDayType.Weekend:
      return localize('ui.components.date.day_types_long.weekend', getLocale(hass));
    case EDayType.Custom:
      var list = weekdayToList(weekdays);
      var seq = findSequence(list);
      var len = Math.max(...seq);
      if (list.length == 6) {
        var missing = [1, 2, 3, 4, 5, 6, 7].filter(e => !list.includes(e));
        return localize(
          'ui.components.date.repeated_days_except',
          getLocale(hass),
          '{excludedDays}',
          formatWeekday(missing.pop()!, getLocale(hass))
        );
      }
      var dayNames = list.map(e => formatWeekday(e, getLocale(hass)));
      if (list.length >= 3 && len >= 3) {
        var start = seq.reduce((obj, e, i) => (e == len ? i : obj), 0);
        dayNames.splice(
          start,
          len,
          localize(
            'ui.components.date.days_range',
            getLocale(hass),
            ['{startDay}', '{endDay}'],
            [dayNames[start], dayNames[start + len - 1]]
          )
        );
      }
      var daysString =
        dayNames.length > 1
          ? `${dayNames.slice(0, -1).join(', ')} ${hass.localize('ui.common.and')} ${dayNames.pop()}`
          : `${dayNames.pop()}`;
      return localize('ui.components.date.repeated_days', getLocale(hass), '{days}', daysString);
    default:
      return '';
  }
};
