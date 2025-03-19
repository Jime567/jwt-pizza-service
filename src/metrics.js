const os = require('os');

const config = require('./config');

const requests = {};

function track(endpoint) {
  return (req, res, next) => {
    requests[endpoint] = (requests[endpoint] || 0) + 1;
    next();
  };
}

function getCpuUsagePercentage() {
  const cpuUsage = os.loadavg()[0] / os.cpus().length;
  return cpuUsage.toFixed(2) * 100;
}

function getMemoryUsagePercentage() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsage = (usedMemory / totalMemory) * 100;
  return memoryUsage.toFixed(2);
}

function sendMetricToGrafana(metricName, metricValue, attributes) {
    attributes = { ...attributes, source: config.source };
  
    const metric = {
      resourceMetrics: [
        {
          scopeMetrics: [
            {
              metrics: [
                {
                  name: metricName,
                  unit: '1',
                  sum: {
                    dataPoints: [
                      {
                        asInt: metricValue,
                        timeUnixNano: Date.now() * 1000000,
                        attributes: [],
                      },
                    ],
                    aggregationTemporality: 'AGGREGATION_TEMPORALITY_CUMULATIVE',
                    isMonotonic: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  
    Object.keys(attributes).forEach((key) => {
      metric.resourceMetrics[0].scopeMetrics[0].metrics[0].sum.dataPoints[0].attributes.push({
        key: key,
        value: { stringValue: attributes[key] },
      });
    });
  
    fetch(`${config.url}`, {
      method: 'POST',
      body: JSON.stringify(metric),
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Failed to push metrics data to Grafana');
        } else {
          console.log(`Pushed ${metricName}`);
        }
      })
      .catch((error) => {
        console.error('Error pushing metrics:', error);
      });
  }

  function sendMetricsPeriodically(period) {
    setInterval(() => {
      try {
        const cpuUsage = getCpuUsagePercentage();
        const memoryUsage = getMemoryUsagePercentage();
  
        sendMetricToGrafana('cpu_usage', cpuUsage, { unit: '%' });
        sendMetricToGrafana('memory_usage', memoryUsage, { unit: '%' });
  
        // Track request counts per endpoint
        Object.keys(requests).forEach((endpoint) => {
          sendMetricToGrafana(`requests_${endpoint}`, requests[endpoint], {});
        });
  
        console.log('Metrics sent successfully');
      } catch (error) {
        console.error('Error sending metrics:', error);
      }
    }, period);
  }
  

  module.exports = { track, sendMetricsPeriodically };