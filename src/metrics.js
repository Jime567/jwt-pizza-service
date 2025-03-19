const fetch = require('node-fetch');
const os = require('os');
const config = require('./config');

const requests = {};

const requestTypes = { GET: 0, POST: 0, PUT: 0, DELETE: 0 };

function track() {
    console.log('Tracking metrics...');
    return (req, res, next) => {
        if (requestTypes[req.method] !== undefined) {
            requestTypes[req.method]++;
        }
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

const GRAFANA_URL = `${config.metrics.url}`;
const API_KEY = `${config.metrics.userId}:${config.metrics.apiKey}`;

async function sendMetricToGrafana(metricName, metricValue, attributes = {}) {
    try {
        attributes.source = "jwt-pizza-service";

        const metricPayload = {
            resourceMetrics: [
                {
                    scopeMetrics: [
                        {
                            metrics: [
                                {
                                    name: metricName,
                                    unit: '1',
                                    description: '',
                                    gauge: {
                                        dataPoints: [
                                            {
                                                asDouble: metricValue,
                                                timeUnixNano: Date.now() * 1000000,
                                                attributes: Object.keys(attributes).map(key => ({
                                                    key: key,
                                                    value: { stringValue: attributes[key] },
                                                })),
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        const response = await fetch(GRAFANA_URL, {
            method: 'POST',
            body: JSON.stringify(metricPayload),
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(`Metric Sent: ${metricName} = ${metricValue} (Status: ${response.status})`);
        if (!response.ok) {
            const errorResponse = await response.text();
            console.error('Failed to push metrics:', errorResponse);
        }
    } catch (error) {
        console.error('Error sending metric:', error);
    }
}

function sendMetricsPeriodically(period) {
    setInterval(() => {
        try {
            const cpuUsage = getCpuUsagePercentage();
            const memoryUsage = getMemoryUsagePercentage();

            sendMetricToGrafana('cpu_usage', cpuUsage, { unit: '%' });
            sendMetricToGrafana('memory_usage', memoryUsage, { unit: '%' });

            Object.keys(requestTypes).forEach((method) => {
                sendMetricToGrafana(`http_requests_${method}`, requestTypes[method], { method });
            });

            // clear request types
            Object.keys(requestTypes).forEach((method) => {
                requestTypes[method] = 0;
            });

            console.log('Metrics sent successfully');
        } catch (error) {
            console.error('Error sending metrics:', error);
        }
    }, period);
}

module.exports = { track, sendMetricsPeriodically };
