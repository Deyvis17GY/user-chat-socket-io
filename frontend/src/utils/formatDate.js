export const formatDate = (date, locale, options) => {
  return new Intl.DateTimeFormat(locale, options).format(date || new Date());
};
