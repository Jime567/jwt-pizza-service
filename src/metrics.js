const fetch = require('node-fetch');
const os = require('os');
const config = require('./config');

const requests = {};

const requestTypes = { GET: 0, POST: 0, PUT: 0, DELETE: 0, auth_success: 0, auth_failure: 0 };

const userActivity = {}; 

//track users
function trackActiveUser(userId) {
    const now = Date.now();
    userActivity[userId] = now;
    console.log(`User ${userId} activity updated: ${now}`);
}

function track() {
    console.log('Tracking metrics...');
    return (req, res, next) => {
        if (requestTypes[req.method] !== undefined) {
            requestTypes[req.method]++;
        }
        next();
    };
}

function trackRevenue(price) {
    if (typeof price === 'number' && price > 0) {
        sendSumToGrafana('order_revenue_total_btc', price, { currency: 'BTC' });
    }
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

async function sendGaugeToGrafana(metricName, metricValue, attributes = {}) {
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

        // console.log(`Metric Sent: ${metricName} = ${metricValue} (Status: ${response.status})`);
        if (!response.ok) {
            const errorResponse = await response.text();
            console.error('Failed to push metrics:', errorResponse);
        }
    } catch (error) {
        console.error('Error sending metric:', error);
    }
}

async function sendSumToGrafana(metricName, metricValue, attributes = {}) {
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
                                    sum: {
                                        aggregationTemporality: 2, 
                                        isMonotonic: true,
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

        // console.log(`Metric Sent: ${metricName} = ${metricValue} (Status: ${response.status})`);
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

            sendGaugeToGrafana('cpu_usage', cpuUsage, { unit: '%' });
            sendGaugeToGrafana('memory_usage', memoryUsage, { unit: '%' });

            // Track the request types
            Object.keys(requestTypes).forEach((method) => {
                sendGaugeToGrafana(`http_requests_${method}`, requestTypes[method], { method });
            });


            sendGaugeToGrafana('active_users', Object.keys(userActivity).length, { event: 'active' });

            // Clear all counters after sending metrics
            Object.keys(requestTypes).forEach((method) => {
                requestTypes[method] = 0;
            });

            // clear active users older than 4 minutes
            const fourMinutesAgo = Date.now() - 4 * 60 * 1000;
            for (const userId in userActivity) {
                if (userActivity[userId] < fourMinutesAgo) {
                    console.log(`User ${userId} is inactive, removing from active users.`);
                    delete userActivity[userId];
                } 
            }
            // console.log('Active users:', Object.keys(userActivity).length);

        } catch (error) {
            console.error('Error sending metrics:', error);
        }
    }, period);
}

module.exports = { track, trackRevenue, sendSumToGrafana, sendGaugeToGrafana, sendMetricsPeriodically, requestTypes, trackActiveUser };
