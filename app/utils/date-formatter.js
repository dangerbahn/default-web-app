import CONSTANT from './constants';

export default {
  fullDayOfWeek: function(dow) {
    if (dow instanceof Date) {
      return CONSTANT.DAYS[dow.getUTCDay()].full;
    }
    return CONSTANT.DAYS[Number(dow)].full;
  },
  shortDayOfWeek: function(dow) {
    if (dow instanceof Date) {
      return CONSTANT.DAYS[dow.getUTCDay()].abbr;
    }
    return CONSTANT.DAYS[Number(dow)].abbr;
  },
  fullMonth: function(month) {
    if (month instanceof Date) {
      return CONSTANT.MONTHS[month.getUTCMonth()].full;
    }
    return CONSTANT.MONTHS[Number(month)].full;
  },
  screenReaderDayOfMonth: function(day) {
    if (day instanceof Date) {
      return CONSTANT.NUMBERS[day.getUTCDate()].textOrdinal;
    }
    return CONSTANT.NUMBERS[Number(day)].textOrdinal;
  },
  ordinal: function(n) {
    var s=["th","st","nd","rd"];
    var v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
  },
  ymd: function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return [year, month, day].join('-');
  },
  now: function() {
    return new Date();
  },
  today: function() {
    var now = this.now();
    now.setUTCHours(0, 0, 0, 0);
    return now;
  },
  hoursFromNow: function(hours) {
    var now = this.now();
    hours = hours || 0;
    now.setUTCHours(now.getUTCHours() + hours);
    return now;
  },
};
