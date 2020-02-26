export const formatDateString = timestamp => {
  if (timestamp === undefined) {
    return '';
  }
  const date = new Date(parseInt(timestamp) * 1000);
  const year = date.getFullYear();
  const month = parseInt(date.getMonth()) + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

export const formatStringWithHtml = originString => {
  if (originString === undefined) {
    return '';
  }
  const newString = originString
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  return newString;
};
export const formatDate = timestamp => {
  if (timestamp === undefined) {
    return 0;
  } else {
    return new Date(timestamp).getTime();
  }
};
export const formatDateSplice = timestamp => {
  if (timestamp === undefined) {
    return '';
  } else {
    return timestamp.substring(5, 16);
  }
};
export const formatDateSpliceDay = (timestamp, locale = 'en') => {
  if (timestamp === undefined) {
    return '';
  } else {
    let month = '';
    let day = '';
    let m = timestamp.substring(5, 10);
    if (m.substring(0, 1) == 0) {
      month = m.substring(1, 2);
    } else {
      month = m.substring(0, 2);
    }
    if (m.substring(3, 4) == 0) {
      day = m.substring(4, 5);
    } else {
      day = m.substring(3, 5);
    }
    if (locale === 'zh') {
      return month + '月' + day + '日';
    } else {
      return (
        ' ' +
        [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ][month - 1] + day
      );
    }
  }
};
export const formatDateLineDay = timestamp => {
  if (timestamp === undefined) {
    return '';
  } else {
    let month = '';
    let day = '';
    let m = timestamp.substring(5, 10);
    month = m.substring(0, 2);
    day = m.substring(3, 5);
    return month + '/' + day;
  }
};
export const formatDateJoinTime = timestamp => {
  if (timestamp === undefined) {
    return '';
  } else {
    let m = timestamp[0].substring(5, 7);
    let d = timestamp[0].substring(8, 10);
    let t = timestamp[0].substring(11, 16);
    let m2 = timestamp[1].substring(5, 7);
    let d2 = timestamp[1].substring(8, 10);
    let t2 = timestamp[1].substring(11, 16);
    if (m.substring(0, 1) == 0) {
      m = timestamp[0].substring(6, 7);
    } else {
      m = timestamp[0].substring(5, 7);
    }
    if (d.substring(0, 1) == 0) {
      d = timestamp[0].substring(9, 10);
    } else {
      d = timestamp[0].substring(8, 10);
    }
    if (m2.substring(0, 1) == 0) {
      m2 = timestamp[1].substring(6, 7);
    } else {
      m2 = timestamp[1].substring(5, 7);
    }
    if (d2.substring(0, 1) == 0) {
      d2 = timestamp[1].substring(9, 10);
    } else {
      d2 = timestamp[1].substring(8, 10);
    }
    let date = '';
    if (m == m2 && d == d2) {
      date = m + '.' + d + ' ' + t + '-' + t2;
    } else {
      date = m + '.' + d + ' ' + t + '~' + m2 + '.' + d2 + ' ' + t2;
    }
    return date;
  }
};
