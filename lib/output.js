const { Signale } = require('signale');
 
const options = {
  disabled: false,
  interactive: false,
  logLevel: 'info',
  scope: 'goodcity',
  secrets: [],
  stream: process.stdout
};
 
const task = async (msg, job) => {
  const signale = new Signale({
    ...options,
    interactive: true
  });

  try {
    signale.await(msg);
    const result = await job();
    signale.success(msg);
    return result;
  } catch (e) {
    signale.error(msg);
    throw e;
  } finally {
    console.log()
  }
}

module.exports = {
  task,
  logger: new Signale(options)
}
