const axios = require('axios');

function generarDatos() {
    const radiacion = Math.floor(Math.random() * 1000);

    let eficienciaBase;

    // 🔥 80% normal, 20% fallo
    if (Math.random() < 0.8) {
        eficienciaBase = 0.12 + Math.random() * 0.08; // normal
    } else {
        eficienciaBase = 0.05 + Math.random() * 0.05; // fallo
    }

    const potencia = radiacion * eficienciaBase;

    const voltaje = 20 + Math.random() * 10;
    const corriente = potencia / voltaje;

    return {
        radiacion: Number(radiacion.toFixed(2)),
        voltaje: Number(voltaje.toFixed(2)),
        corriente: Number(corriente.toFixed(2)),
        potencia: Number(potencia.toFixed(2))
    };
}

setInterval(async () => {
    const data = generarDatos();

    try {
        await axios.post('http://localhost:3000/api/data', data);
        console.log('Data sent:', data);
    } catch (error) {
        console.log('Error sending data');
    }
}, 3000);