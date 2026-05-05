/**
 * monitoreo-chart.js
 * Carga el historial de frecuencia cardíaca de las últimas 24 h
 * desde InfluxDB y lo renderiza con Chart.js.
 */

import { queryClient, bucket } from './influx-config.js';

// ── Instancia del gráfico (singleton) ───────────────────────────────────────
let chartInstance = null;

/**
 * Ejecuta la query Flux y devuelve un arreglo de { tiempo, valor }.
 * @returns {Promise<Array<{tiempo: string, valor: number}>>}
 */
async function obtenerDatos() {
    const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "nodo_vet")
  |> filter(fn: (r) => r["_field"] == "frecuencia_cardiacia")
`;

    const resultados = [];

    return new Promise((resolve, reject) => {
        queryClient.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const obj = tableMeta.toObject(row);
                resultados.push({
                    tiempo: obj._time,
                    valor: obj._value,
                });
            },
            error(err) {
                console.error('[VetSense] Error al consultar InfluxDB:', err);
                reject(err);
            },
            complete() {
                resolve(resultados);
            },
        });
    });
}

/**
 * Carga el histórico de frecuencia cardíaca y renderiza la gráfica.
 * Si la gráfica ya existe la destruye antes de recrearla.
 */
export async function cargarHistorico() {
    const canvas = document.getElementById('graficaHistorico');
    if (!canvas) {
        console.warn('[VetSense] No se encontró <canvas id="graficaHistorico">');
        return;
    }

    // Mostrar estado de carga
    const contenedor = canvas.closest('.chart-container');
    if (contenedor) contenedor.setAttribute('data-loading', 'true');

    try {
        const datos = await obtenerDatos();

        // Limpiar instancia previa
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }

        const labels = datos.map(d =>
            new Date(d.tiempo).toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
            })
        );
        const valores = datos.map(d => d.valor);

        const ctx = canvas.getContext('2d');

        // Gradiente de relleno
        const gradiente = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight || 300);
        gradiente.addColorStop(0, 'rgba(0, 161, 155, 0.35)');
        gradiente.addColorStop(1, 'rgba(0, 161, 155, 0.02)');

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Frecuencia Cardíaca (BPM)',
                        data: valores,
                        borderColor: '#00a19b',
                        backgroundColor: gradiente,
                        borderWidth: 2.5,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#00a19b',
                        pointBorderColor: '#0d1117',
                        pointBorderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuart',
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.75)',
                            font: { family: 'DM Sans, sans-serif', size: 13 },
                            usePointStyle: true,
                            pointStyleWidth: 8,
                        },
                    },
                    tooltip: {
                        backgroundColor: 'rgba(13, 17, 23, 0.92)',
                        titleColor: '#00a19b',
                        bodyColor: 'rgba(255,255,255,0.85)',
                        borderColor: 'rgba(0, 161, 155, 0.4)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: ctx => ` ${ctx.parsed.y} BPM`,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.45)',
                            font: { family: 'Space Mono, monospace', size: 11 },
                            maxTicksLimit: 10,
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        border: { color: 'rgba(255, 255, 255, 0.08)' },
                    },
                    y: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.45)',
                            font: { family: 'Space Mono, monospace', size: 11 },
                            callback: val => `${val} bpm`,
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        border: { color: 'rgba(255, 255, 255, 0.08)' },
                        beginAtZero: false,
                        suggestedMin: 40,
                        suggestedMax: 160,
                    },
                },
            },
        });

        console.log(`[VetSense] Gráfica cargada con ${datos.length} registros.`);
    } catch (err) {
        console.error('[VetSense] cargarHistorico falló:', err);
    } finally {
        if (contenedor) contenedor.removeAttribute('data-loading');
    }
}
