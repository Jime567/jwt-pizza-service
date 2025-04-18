const express = require('express');
const metrics = require('./metrics');
const { sendMetricsPeriodically, sendMetricToGrafana } = require('./metrics');

const { authRouter, setAuthUser } = require('./routes/authRouter.js');
const orderRouter = require('./routes/orderRouter.js');
const franchiseRouter = require('./routes/franchiseRouter.js');
const version = require('./version.json');
const config = require('./config.js');

const logger = require('./logger.js');

const app = express();
app.use(express.json());
app.use(logger.httpLogger);
app.use(setAuthUser);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

const apiRouter = express.Router();
app.use(metrics.track()); 
//print out hte request to the console
app.use((req, res, next) => {
  console.log();
  console.log(`Request received: ${req.method} ${req.originalUrl}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  console.log();
  next();
});

// Track request latency
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const latency = Date.now() - start;
    // console.log(`Request latency for ${req.method} ${req.originalUrl}: ${latency}ms`);
    metrics.sendSumToGrafana('request_latency', latency, { method: req.method, path: req.originalUrl });
  });

  next();
});

app.use('/api', apiRouter);
apiRouter.use('/auth',  authRouter);
apiRouter.use('/order',  orderRouter);
apiRouter.use('/franchise',  franchiseRouter);

apiRouter.use('/docs',  (req, res) => {
  res.json({
    version: version.version,
    endpoints: [...authRouter.endpoints, ...orderRouter.endpoints, ...franchiseRouter.endpoints],
    config: { factory: config.factory.url, db: config.db.connection.host },
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'welcome to JWT Pizza',
    version: version.version,
  });
});

app.use('*',(req, res) => {
  res.status(404).json({
    message: 'unknown endpoint',
  });
});

// Default error handler for all exceptions and errors.
app.use((err, req, res, next) => {
  logger.exceptionLogger(err);
  res.status(err.statusCode ?? 500).json({ message: err.message, stack: err.stack });
  next();
});

// track the metrics
sendMetricsPeriodically(5000); 

module.exports = app;
