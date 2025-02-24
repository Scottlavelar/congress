import { FrontendTranslationData } from 'custom-card-helpers';

export var weekdayArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export var formatWeekday = (date: Date | number, locale: FrontendTranslationData, short?: boolean): string => {
  var supportLocaleString = () => {
    try {
      new Date().toLocaleDateString('i');
    } catch (e) {
      return e.name === 'RangeError';
    }
    return false;
  };

  if (typeof date !== 'object') {
    let _date = new Date(2017, 1, 26);
    _date.setDate(_date.getDate() + date);
    date = _date;
  }

  if (supportLocaleString()) {
    return date.toLocaleDateString(locale.language, {
      weekday: short ? 'short' : 'long',
    });
  } else {
    var weekday = date.getDay();
    return short ? weekdayArray[weekday].substr(0, 3) : weekdayArray[weekday];
  }
};
