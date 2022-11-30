const moment = require('moment');

const timeStamp = text => {
  const date = moment().format('MMMM Do YYYY HH:mm:ss');
  console.log('[' + date + '] ' + text);
};

module.exports = timeStamp;
