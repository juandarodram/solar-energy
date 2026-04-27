const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🧠 Almacenamiento en memoria
let solarData = [];

// 📥 Recibir datos
app.post('/api/data', (req, res) => {
    const data = req.body;

    // ⏱️ intervalo de 3 segundos en horas
    const tiempoHoras = 3 / 3600;

    // ⚡ energía generada
    const energia = data.potencia * tiempoHoras;

    // ⚡ eficiencia (sin redondear)
    const eficiencia = data.potencia / (data.radiacion || 1);

    const newData = {
        ...data,
        energia: Number(energia.toFixed(4)),
        eficiencia: eficiencia,
        timestamp: new Date()
    };

    solarData.push(newData);

    // 🔥 limitar tamaño (simulación real)
    if (solarData.length > 1000) {
        solarData.shift();
    }

    console.log("Data received:", newData);

    res.json({ message: "OK" });
});

// 📊 Obtener todos los datos
app.get('/api/metrics', (req, res) => {
    console.log("Datos guardados:", solarData.length);
    res.json(solarData);
});

// 📈 Resumen inteligente
app.get('/api/summary', (req, res) => {

    if (solarData.length === 0) {
        return res.json({ message: "No hay datos aún" });
    }

    let energiaTotal = 0;
    let potenciaTotal = 0;
    let potenciaMax = -Infinity;
    let potenciaMin = Infinity;

    let fallas = 0;

    const ventana = solarData.slice(-20); // últimos 20 datos

    ventana.forEach(d => {

        energiaTotal += d.energia || 0;
        potenciaTotal += d.potencia;

        if (d.potencia > potenciaMax) potenciaMax = d.potencia;
        if (d.potencia < potenciaMin) potenciaMin = d.potencia;

        // 🔥 detección de falla por eficiencia
        if (d.eficiencia < 0.10 && d.radiacion > 200) {
            fallas++;
        }
    });

    // 🔥 porcentaje de fallas
    const porcentajeFallas = fallas / ventana.length;

    let alertas = [];

    // alerta solo si el sistema realmente está fallando
    if (porcentajeFallas > 0.15) {
        alertas.push("Baja eficiencia energética");
    }

    const promedio = potenciaTotal / solarData.length;

    res.json({
        energia_total: Number(energiaTotal.toFixed(2)),
        potencia_promedio: Number(promedio.toFixed(2)),
        potencia_max: Number(potenciaMax.toFixed(2)),
        potencia_min: Number(potenciaMin.toFixed(2)),
        total_muestras: solarData.length,
        porcentaje_fallas: Number((porcentajeFallas * 100).toFixed(2)),
        alertas: alertas
    });
});

// 🟢 Health check
app.get('/', (req, res) => {
    res.send('API Solar funcionando 🚀');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});