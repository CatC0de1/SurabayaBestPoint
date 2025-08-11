const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

function getWIBDate() {
  return dayjs().tz('Asia/Jakarta').toDate();
}

function getPlaceStatus(createdAt) {
  if (!createdAt) return false;

  const now = dayjs().tz('Asia/Jakarta');
  const created = dayjs(createdAt).tz('Asia/Jakarta');

  return now.diff(created, 'day') <= 7;
}

module.exports = {
  getWIBDate,
  getPlaceStatus
};