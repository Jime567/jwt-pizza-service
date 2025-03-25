const config = require('./config.json');

class Logger {
  // Http Requests
  // method, path, status code
  httpLogger = (req, res, next) => {
    let send = res.send;
    res.send = (resBody) => {
      const logData = {
        authorized: !!req.headers.authorization,
        path: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        reqBody: JSON.stringify(req.body),
        resBody: JSON.stringify(resBody),
      };
      const level = this.statusToLogLevel(res.statusCode);
      this.log(level, 'http', logData);
      res.send = send;
      return res.send(resBody);
    };
    next();
  };



  statusToLogLevel(statusCode) {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warn';
    return 'info';
  }



  sanitize(logData) {
    logData = JSON.stringify(logData);
    return logData.replace(/\\"password\\":\s*\\"[^"]*\\"/g, '\\"password\\": \\"*****\\"');
  }

  // Databases Requests 
  // sql queries
  databaseLogger = (sql, params) => {
    // convert params to string
    params = JSON.stringify(params);
    const logData = { sql: sql, params: params };
    this.log('info', 'database', logData);
  };

  // Factory service requests
  factoryLogger = (url, method, body) => {
    const logData = { url: url, method: method, body: JSON.stringify(body) };
    this.log('info', 'factory', logData);
  }

  // Unhandled exceptions

  nowString() {
    return (Math.floor(Date.now()) * 1000000).toString();
  }

  log(level, type, logData) {
    const labels = { component: config.logs.source, level: level, type: type };
    const values = [this.nowString(), this.sanitize(logData)];
    const logEvent = { streams: [{ stream: labels, values: [values] }] };

    this.sendLogToGrafana(logEvent);
  }

  sendLogToGrafana(event) {
    const body = JSON.stringify(event);
    fetch(`${config.logs.url}`, {
      method: 'post',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.logs.userId}:${config.logs.apiKey}`,
      },
    }).then((res) => {
      if (!res.ok) console.log('Failed to send log to Grafana');
    });
  }
}

module.exports = new Logger();