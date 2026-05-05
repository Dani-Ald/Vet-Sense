import { InfluxDB } from 'https://cdn.jsdelivr.net/npm/@influxdata/influxdb-client-browser@2.10.1/dist/index.browser.js';

const token = '6SUkG-KSMvX4RIRkPUQBuaVbM9txhMaehtKUFqoA5h4bR-I2AA-ouDQLUS0013OcPIjANf3z1gZPb9ctM9waaQ==';
const org = 'vet';
const bucket = 'sensor_vet';

const client = new InfluxDB({ url: 'http://localhost:8086', token: token });

export const queryClient = client.getQueryApi(org);
export { bucket };
