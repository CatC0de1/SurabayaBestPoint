const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

function getWIBDate() {
  return dayjs().tz('Asia/Jakarta').toDate();
}

module.exports = getWIBDate;