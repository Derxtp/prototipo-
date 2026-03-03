/**

 * @param {string} label
 * @param {string} unitId 
 * @param {string} converterType 
 * @param {string} themeColor 
 * @returns {string} 
 */
function createResultCard(label, unitId, converterType, themeColor) {
    return `
        <div id="card-${converterType}-${unitId}" class="result-card bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 transition-all duration-200">
            <p class="text-sm font-medium text-${themeColor}-600">${label}</p>
            <p id="output-${converterType}-${unitId}" class="text-xl font-bold text-gray-900 mt-1 break-words">0.00</p>
        </div>
    `;
}

// Datos y funciones para el conversor de Longitud
const lengthData = {
    factors: { 'm': 1, 'km': 1000, 'cm': 0.01, 'mm': 0.001, 'μm': 1e-6, 'nm': 1e-9, 'mi': 1609.34, 'yd': 0.9144, 'ft': 0.3048, 'in': 0.0254 },
    labels: { 'm': 'Metro (m)', 'km': 'Kilómetro (km)', 'cm': 'Centímetro (cm)', 'mm': 'Milímetro (mm)', 'μm': 'Micrómetro (μm)', 'nm': 'Nanómetro (nm)', 'mi': 'Milla (mi)', 'yd': 'Yarda (yd)', 'ft': 'Pie (ft)', 'in': 'Pulgada (in)' }
};

function initializeLengthConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-longitud');
    const resultsGrid = document.getElementById('resultsGrid-longitud');
    const precisionSelect = document.getElementById('precision-longitud');
    for (const unit in lengthData.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = lengthData.labels[unit];
        sourceUnitSelect.appendChild(option);
        
        resultsGrid.innerHTML += createResultCard(lengthData.labels[unit], unit, 'longitud', 'indigo');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'm';
    convertLength();
}

function convertLength() {
    const value = parseFloat(document.getElementById('inputValue-longitud').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-longitud').value;
    const precision = parseInt(document.getElementById('precision-longitud').value, 10);
    const valueInMeters = value * lengthData.factors[sourceUnit];

    for (const targetUnit in lengthData.factors) {
        const result = valueInMeters / lengthData.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-longitud-${targetUnit}`).textContent = formattedResult;

        // Actualizar estilo de la tarjeta de origen
        const card = document.getElementById(`card-longitud-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-indigo-50', isSource);
        card.classList.toggle('border-indigo-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// Datos y funciones para el conversor de Presión
const pressureData = {
    factors: { 'Pa': 1, 'kPa': 1000, 'MPa': 1e6, 'atm': 101325, 'bar': 100000, 'Torr': 133.322, 'mmHg': 133.322, 'psi': 6894.76, 'mH2O': 9806.65 },
    labels: { 'Pa': 'Pascal (Pa)', 'kPa': 'Kilopascal (kPa)', 'MPa': 'Megapascal (MPa)', 'atm': 'Atmósfera (atm)', 'bar': 'Bar (bar)', 'Torr': 'Torr (Torr)', 'mmHg': 'Milímetro de Mercurio (mmHg)', 'psi': 'Libra/Pulgada² (psi)', 'mH2O': 'Columna de Agua (mH₂O)' }
};

function initializePressureConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-presion');
    const resultsGrid = document.getElementById('resultsGrid-presion');
    const precisionSelect = document.getElementById('precision-presion');
    for (const unit in pressureData.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = pressureData.labels[unit];
        sourceUnitSelect.appendChild(option);

        resultsGrid.innerHTML += createResultCard(pressureData.labels[unit], unit, 'presion', 'red');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'Pa';
    convertPressure();
}

function convertPressure() {
    const value = parseFloat(document.getElementById('inputValue-presion').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-presion').value;
    const precision = parseInt(document.getElementById('precision-presion').value, 10);
    const valueInPascals = value * pressureData.factors[sourceUnit];

    for (const targetUnit in pressureData.factors) {
        const result = valueInPascals / pressureData.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-presion-${targetUnit}`).textContent = formattedResult;

        const card = document.getElementById(`card-presion-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-red-50', isSource);
        card.classList.toggle('border-red-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// Datos y funciones para el conversor de Temperatura
const temperatureData = {
    units: ['K', 'C', 'F', 'R'],
    labels: {
        'K': 'Kelvin (K)',
        'C': 'Grados Celsius (°C)',
        'F': 'Grados Fahrenheit (°F)',
        'R': 'Rankine (°R)',
    },
    toKelvin: {
        'K': (t) => t,
        'C': (t) => t + 273.15,
        'F': (t) => (t - 32) * (5 / 9) + 273.15,
        'R': (t) => t * (5 / 9),
    },
    fromKelvin: {
        'K': (t) => t,
        'C': (t) => t - 273.15,
        'F': (t) => (t - 273.15) * (9 / 5) + 32,
        'R': (t) => t * (9 / 5),
    }
};

function initializeTemperatureConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-temperatura');
    const resultsGrid = document.getElementById('resultsGrid-temperatura');
    const precisionSelect = document.getElementById('precision-temperatura');
    temperatureData.units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = temperatureData.labels[unit];
        sourceUnitSelect.appendChild(option);

        resultsGrid.innerHTML += createResultCard(temperatureData.labels[unit], unit, 'temperatura', 'amber');
    });
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'C';
    convertTemperature();
}

function convertTemperature() {
    const value = parseFloat(document.getElementById('inputValue-temperatura').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-temperatura').value;
    const precision = parseInt(document.getElementById('precision-temperatura').value, 10);
    const valueInKelvin = temperatureData.toKelvin[sourceUnit](value);
    temperatureData.units.forEach(targetUnit => {
        const result = temperatureData.fromKelvin[targetUnit](valueInKelvin);
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toFixed(precision);
        document.getElementById(`output-temperatura-${targetUnit}`).textContent = formattedResult;

        const card = document.getElementById(`card-temperatura-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-amber-50', isSource);
        card.classList.toggle('border-amber-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    });
}

// Datos y funciones para el conversor de Tiempo
const timeData = {
    factors: {
        's': 1, 'ms': 0.001, 'us': 1e-6, 'ns': 1e-9,
        'min': 60, 'h': 3600, 'd': 86400, 'wk': 604800,
        'mo': 2629800, // Mes promedio
        'a': 31557600, // Año promedio
        'lustro': 157788000,
        'decada': 315576000,
        'siglo': 3155760000
    },
    labels: {
        's': 'Segundo (s)', 'ms': 'Milisegundo (ms)', 'us': 'Microsegundo (µs)', 'ns': 'Nanosegundo (ns)',
        'min': 'Minuto (min)', 'h': 'Hora (h)', 'd': 'Día (d)', 'wk': 'Semana',
        'mo': 'Mes (Promedio)', 'a': 'Año (Promedio)', 'lustro': 'Lustro', 'decada': 'Década', 'siglo': 'Siglo'
    }
};

function initializeTimeConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-tiempo');
    const resultsGrid = document.getElementById('resultsGrid-tiempo');
    const precisionSelect = document.getElementById('precision-tiempo');
    for (const unit in timeData.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = timeData.labels[unit];
        sourceUnitSelect.appendChild(option);

        resultsGrid.innerHTML += createResultCard(timeData.labels[unit], unit, 'tiempo', 'orange');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 's';
    convertTime();
}

function convertTime() {
    const value = parseFloat(document.getElementById('inputValue-tiempo').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-tiempo').value;
    const precision = parseInt(document.getElementById('precision-tiempo').value, 10);
    const valueInSeconds = value * timeData.factors[sourceUnit];

    for (const targetUnit in timeData.factors) {
        const result = valueInSeconds / timeData.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-tiempo-${targetUnit}`).textContent = formattedResult;

        const card = document.getElementById(`card-tiempo-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-orange-50', isSource);
        card.classList.toggle('border-orange-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// Datos y funciones para el conversor de Masa
const massData = {
    factors: {
        'kg': 1, 'g': 0.001, 'mg': 1e-6, 'ug': 1e-9, 't': 1000,
        'lb': 0.45359237, 'oz': 0.0283495231, 'ton_short': 907.18474, 'st': 6.35029318
    },
    labels: {
        'kg': 'Kilogramo (kg)', 'g': 'Gramo (g)', 'mg': 'Miligramo (mg)', 'ug': 'Microgramo (µg)',
        't': 'Tonelada Métrica (t)', 'lb': 'Libra (lb)', 'oz': 'Onza (oz)',
        'ton_short': 'Tonelada Corta (ton US)', 'st': 'Stone (st)'
    }
};

function initializeMassConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-masa');
    const resultsGrid = document.getElementById('resultsGrid-masa');
    const precisionSelect = document.getElementById('precision-masa');
    for (const unit in massData.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = massData.labels[unit];
        sourceUnitSelect.appendChild(option);

        resultsGrid.innerHTML += createResultCard(massData.labels[unit], unit, 'masa', 'green');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'kg';
    convertMass();
}

function convertMass() {
    const value = parseFloat(document.getElementById('inputValue-masa').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-masa').value;
    const precision = parseInt(document.getElementById('precision-masa').value, 10);
    const valueInKilograms = value * massData.factors[sourceUnit];

    for (const targetUnit in massData.factors) {
        const result = valueInKilograms / massData.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-masa-${targetUnit}`).textContent = formattedResult;

        const card = document.getElementById(`card-masa-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-green-50', isSource);
        card.classList.toggle('border-green-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// Datos y funciones para el conversor de Volumen
const volumeData = {
    factors: { // Factores de conversión a Litros (L)
        'm3': 1000,
        'cm3': 0.001,
        'L': 1,
        'mL': 0.001,
        'ft3_us': 28.316846592,
        'yd3_us': 764.554857984,
        'gal_us': 3.785411784,
        'qt_us': 0.946352946,
        'pt_us': 0.473176473,
        'cup_us': 0.2365882365,
        'floz_us': 0.0295735295625,
        'tbsp_us': 0.01478676478125,
        'tsp_us': 0.00492892159375,
        'in3_us': 0.016387064,
        'gal_uk': 4.54609,
        'qt_uk': 1.1365225,
        'pt_uk': 0.56826125,
        'floz_uk': 0.0284130625,
        'tbsp_uk': 0.0177581640625,
        'tsp_uk': 0.00591938802083,
    },
    labels: {
        'm3': 'Metro Cúbico (m³)', 'cm3': 'Centímetro Cúbico (cm³)', 'L': 'Litro (L)', 'mL': 'Mililitro (mL)',
        'ft3_us': 'Pie Cúbico (US)', 'yd3_us': 'Yarda Cúbica (US)', 'gal_us': 'Galón (US)', 'qt_us': 'Cuarto (US)',
        'pt_us': 'Pinta (US)', 'cup_us': 'Taza (US)', 'floz_us': 'Onza Líquida (US)', 'tbsp_us': 'Cucharada (US)',
        'tsp_us': 'Cucharadita (US)', 'in3_us': 'Pulgada Cúbica (US)', 'gal_uk': 'Galón (Imperial)',
        'qt_uk': 'Cuarto (Imperial)', 'pt_uk': 'Pinta (Imperial)', 'floz_uk': 'Onza Líquida (Imperial)',
        'tbsp_uk': 'Cucharada (Imperial)', 'tsp_uk': 'Cucharadita (Imperial)'
    }
};

function initializeVolumeConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-volumen');
    const resultsGrid = document.getElementById('resultsGrid-volumen');
    const precisionSelect = document.getElementById('precision-volumen');
    for (const unit in volumeData.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = volumeData.labels[unit];
        sourceUnitSelect.appendChild(option);

        resultsGrid.innerHTML += createResultCard(volumeData.labels[unit], unit, 'volumen', 'teal');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'L';
    convertVolume();
}

function convertVolume() {
    const value = parseFloat(document.getElementById('inputValue-volumen').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-volumen').value;
    const precision = parseInt(document.getElementById('precision-volumen').value, 10);
    const valueInLiters = value * volumeData.factors[sourceUnit];

    for (const targetUnit in volumeData.factors) {
        const result = valueInLiters / volumeData.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-volumen-${targetUnit}`).textContent = formattedResult;

        const card = document.getElementById(`card-volumen-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-teal-50', isSource);
        card.classList.toggle('border-teal-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// Datos y funciones para el conversor de Ángulo Plano
const angleData = {
    factors: { // Factores de conversión a Radianes
        'degree': Math.PI / 180,
        'arcmin': Math.PI / (180 * 60),
        'arcsec': Math.PI / (180 * 3600),
        'radian': 1,
        'revolution': 2 * Math.PI,
        'gon': Math.PI / 200,
        'milliradian': 0.001
    },
    labels: {
        'degree': 'Grado Sexagesimal (°)',
        'arcmin': "Minuto de Arco (')",
        'arcsec': 'Segundo de Arco (")',
        'radian': 'Radián (rad)',
        'revolution': 'Revolución (rev)',
        'gon': 'Grado Centesimal (gon)',
        'milliradian': 'Milirradián (mrad)'
    },
    symbols: {
        'degree': '°',
        'arcmin': "'",
        'arcsec': '"',
        'radian': 'rad',
        'revolution': 'rev',
        'gon': 'gon',
        'milliradian': 'mrad'
    }
};

function initializeAngleConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-anguloplano');
    const resultsGrid = document.getElementById('resultsGrid-anguloplano');
    const precisionSelect = document.getElementById('precision-anguloplano');
    for (const unit in angleData.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = angleData.labels[unit];
        sourceUnitSelect.appendChild(option);

        resultsGrid.innerHTML += createResultCard(angleData.labels[unit], unit, 'anguloplano', 'indigo');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'degree';
    convertAngle();
}

function convertAngle() {
    const value = parseFloat(document.getElementById('inputValue-anguloplano').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-anguloplano').value;
    const precision = parseInt(document.getElementById('precision-anguloplano').value, 10);
    const valueInRadians = value * angleData.factors[sourceUnit];

    for (const targetUnit in angleData.factors) {
        const result = valueInRadians / angleData.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-anguloplano-${targetUnit}`).textContent = formattedResult;

        const card = document.getElementById(`card-anguloplano-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-indigo-50', isSource);
        card.classList.toggle('border-indigo-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// Datos y funciones para el conversor de Área
const areaData = {
    factors: { // Factores de conversión a Metros Cuadrados (m²)
        'm2': 1, 'cm2': 0.0001, 'mm2': 0.000001, 'km2': 1000000,
        'mi2': 2589988.110336, 'yd2': 0.83612736, 'ft2': 0.09290304,
        'in2': 0.00064516, 'ha': 10000, 'ac': 4046.8564224
    },
    labels: {
        'm2': 'Metro Cuadrado (m²)', 'cm2': 'Centímetro Cuadrado (cm²)',
        'mm2': 'Milímetro Cuadrado (mm²)', 'km2': 'Kilómetro Cuadrado (km²)',
        'mi2': 'Milla Cuadrada (mi²)', 'yd2': 'Yarda Cuadrada (yd²)',
        'ft2': 'Pie Cuadrado (ft²)', 'in2': 'Pulgada Cuadrada (in²)',
        'ha': 'Hectárea (ha)', 'ac': 'Acre (ac)'
    }
};

function initializeAreaConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-area');
    const resultsGrid = document.getElementById('resultsGrid-area');
    const precisionSelect = document.getElementById('precision-area');
    for (const unit in areaData.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = areaData.labels[unit];
        sourceUnitSelect.appendChild(option);

        resultsGrid.innerHTML += createResultCard(areaData.labels[unit], unit, 'area', 'cyan');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'm2';
    convertArea();
}

function convertArea() {
    const value = parseFloat(document.getElementById('inputValue-area').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-area').value;
    const precision = parseInt(document.getElementById('precision-area').value, 10);
    const valueInMeters2 = value * areaData.factors[sourceUnit];

    for (const targetUnit in areaData.factors) {
        const result = valueInMeters2 / areaData.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-area-${targetUnit}`).textContent = formattedResult;

        const card = document.getElementById(`card-area-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-cyan-50', isSource);
        card.classList.toggle('border-cyan-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// Datos y funciones para el conversor de Energía
const energyData = {
    factors: { // Factores de conversión a Joules (J)
        'J': 1.0,
        'kJ': 1000.0,
        'cal_th': 4.184,
        'kcal': 4184.0,
        'eV': 1.602176634e-19,
        'Wh': 3600.0,
        'kWh': 3600000.0,
        'Ws': 1.0,
        'Cal_nut': 4184.0,
        'BTU': 1055.056,
        'thm': 105505600.0,
        'ft_lbf': 1.35581794833
    },
    labels: {
        'J': 'Joule (J)', 'kJ': 'Kilojoule (kJ)', 'cal_th': 'Caloría (Térmica)', 'kcal': 'Kilocaloría (kcal)',
        'eV': 'Electronvoltio (eV)', 'Wh': 'Vatio-hora (Wh)', 'kWh': 'Kilovatio-hora (kWh)', 'Ws': 'Vatio-segundo (Ws)',
        'Cal_nut': 'Caloría (Nutricional)', 'BTU': 'Unidad Térmica Británica (BTU)', 'thm': 'Termia (US)',
        'ft_lbf': 'Pie-libra fuerza (ft-lbf)'
    }
};

function initializeEnergyConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-energia');
    const resultsGrid = document.getElementById('resultsGrid-energia');
    const precisionSelect = document.getElementById('precision-energia');
    for (const unit in energyData.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = energyData.labels[unit];
        sourceUnitSelect.appendChild(option);

        resultsGrid.innerHTML += createResultCard(energyData.labels[unit], unit, 'energia', 'yellow');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'J';
    convertEnergy();
}

function convertEnergy() {
    const value = parseFloat(document.getElementById('inputValue-energia').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-energia').value;
    const precision = parseInt(document.getElementById('precision-energia').value, 10);
    const valueInJoules = value * energyData.factors[sourceUnit];

    for (const targetUnit in energyData.factors) {
        const result = valueInJoules / energyData.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-energia-${targetUnit}`).textContent = formattedResult;

        const card = document.getElementById(`card-energia-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-yellow-50', isSource);
        card.classList.toggle('border-yellow-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// Datos y funciones para el conversor de Almacenamiento de Datos
const dataStorageData = {
    K_BIN: 1024,
    k_METRIC: 1000,
    UNITS: [
        { id: 'bit', label: 'Bit', abbr: 'b', factor: 1, type: 'Base' },
        { id: 'nibble', label: 'Nibble', abbr: 'Nib', factor: 4, type: 'Base' },
        { id: 'kb', label: 'Kilobit', abbr: 'kb', factor: 1000, type: 'Métrica' },
        { id: 'Mb', label: 'Megabit', abbr: 'Mb', factor: 1000 ** 2, type: 'Métrica' },
        { id: 'Gb', label: 'Gigabit', abbr: 'Gb', factor: 1000 ** 3, type: 'Métrica' },
        { id: 'Tb', label: 'Terabit', abbr: 'Tb', factor: 1000 ** 4, type: 'Métrica' },
        { id: 'Pb', label: 'Petabit', abbr: 'Pb', factor: 1000 ** 5, type: 'Métrica' },
        { id: 'Eb', label: 'Exabit', abbr: 'Eb', factor: 1000 ** 6, type: 'Métrica' },
        { id: 'Kib', label: 'Kibibit', abbr: 'Kib', factor: 1024, type: 'Binaria' },
        { id: 'Mib', label: 'Mebibit', abbr: 'Mib', factor: 1024 ** 2, type: 'Binaria' },
        { id: 'Gib', label: 'Gibibit', abbr: 'Gib', factor: 1024 ** 3, type: 'Binaria' },
        { id: 'Tib', label: 'Tebibit', abbr: 'Tib', factor: 1024 ** 4, type: 'Binaria' },
        { id: 'Pib', label: 'Pebibit', abbr: 'Pib', factor: 1024 ** 5, type: 'Binaria' },
        { id: 'byte', label: 'Byte', abbr: 'B', factor: 8, type: 'Base' },
        { id: 'KB', label: 'Kilobyte', abbr: 'KB', factor: 8 * 1000, type: 'Métrica' },
        { id: 'MB', label: 'Megabyte', abbr: 'MB', factor: 8 * 1000 ** 2, type: 'Métrica' },
        { id: 'GB', label: 'Gigabyte', abbr: 'GB', factor: 8 * 1000 ** 3, type: 'Métrica' },
        { id: 'TB', label: 'Terabyte', abbr: 'TB', factor: 8 * 1000 ** 4, type: 'Métrica' },
        { id: 'PB', label: 'Petabyte', abbr: 'PB', factor: 8 * 1000 ** 5, type: 'Métrica' },
        { id: 'EB', label: 'Exabyte', abbr: 'EB', factor: 8 * 1000 ** 6, type: 'Métrica' },
        { id: 'KiB', label: 'Kibibyte', abbr: 'KiB', factor: 8 * 1024, type: 'Binaria' },
        { id: 'MiB', label: 'Mebibyte', abbr: 'MiB', factor: 8 * 1024 ** 2, type: 'Binaria' },
        { id: 'GiB', label: 'Gibibyte', abbr: 'GiB', factor: 8 * 1024 ** 3, type: 'Binaria' },
        { id: 'TiB', label: 'Tebibyte', abbr: 'TiB', factor: 8 * 1024 ** 4, type: 'Binaria' },
        { id: 'PiB', label: 'Pebibyte', abbr: 'PiB', factor: 8 * 1024 ** 5, type: 'Binaria' },
    ]
};

function initializeDataStorageConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-almacenamiento');
    const outputGrid = document.getElementById('resultsGrid-almacenamiento');
    const precisionSelect = document.getElementById('precision-almacenamiento');
    
    let optionsHtml = '';
    dataStorageData.UNITS.forEach(unit => {
        optionsHtml += `<option value="${unit.id}" ${unit.id === 'byte' ? 'selected' : ''}>${unit.label} (${unit.abbr})</option>`;
    });
    sourceUnitSelect.innerHTML = optionsHtml;

    let outputHtml = '';
    dataStorageData.UNITS.forEach(unit => { // Usamos la función unificada
        outputHtml += createResultCard(`${unit.label} (${unit.abbr})`, unit.id, 'almacenamiento', 'blue');
    });

    outputGrid.innerHTML = outputHtml;

    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;

    convertDataStorage();
}

function convertDataStorage() {
    const valueStr = document.getElementById('inputValue-almacenamiento').value;
    const sourceId = document.getElementById('sourceUnit-almacenamiento').value;
    const precision = parseInt(document.getElementById('precision-almacenamiento').value, 10);
    const sourceValue = parseFloat(valueStr);

    if (isNaN(sourceValue) || sourceValue < 0) {
        dataStorageData.UNITS.forEach(unit => {
            document.getElementById(`output-almacenamiento-${unit.id}`).textContent = '0';
            const cardElement = document.getElementById(`card-almacenamiento-${unit.id}`);
            cardElement.classList.remove('border-blue-700', 'bg-blue-50');
            cardElement.classList.add('border-gray-400', 'bg-gray-100');
        });
        return;
    }
    
    const sourceUnit = dataStorageData.UNITS.find(unit => unit.id === sourceId);
    if (!sourceUnit) return;

    const bits = sourceValue * sourceUnit.factor;

    dataStorageData.UNITS.forEach(targetUnit => {
        const targetValue = bits / targetUnit.factor;
        let formattedValue = (targetUnit.id === sourceId) ? sourceValue.toString() : targetValue.toFixed(precision);
        if (precision > 0 && bits !== 0) {
            formattedValue = formattedValue.replace(/\.?0+$/, '');
        }
        document.getElementById(`output-almacenamiento-${targetUnit.id}`).textContent = formattedValue;

        const cardElement = document.getElementById(`card-almacenamiento-${targetUnit.id}`);
        const isSource = targetUnit.id === sourceId;
        cardElement.classList.toggle('border-blue-400', isSource);
        cardElement.classList.toggle('bg-blue-50', targetUnit.id === sourceId);
        cardElement.classList.toggle('border-gray-200', !isSource);
        cardElement.classList.toggle('bg-gray-50', !isSource);
    });
}

// --- Datos y funciones para el conversor de Velocidad ---
const speedData = {
    UNITS: [
        { id: 'ms', name: 'Metro por segundo', symbol: 'm/s', factor: 1.0 },
        { id: 'kmh', name: 'Kilómetro por hora', symbol: 'km/h', factor: 1 / 3.6 },
        { id: 'mmin', name: 'Metro por minuto', symbol: 'm/min', factor: 1 / 60.0 },
        { id: 'kn', name: 'Nudo', symbol: 'kn (Milla Náutica/h)', factor: 1852 / 3600.0 },
        { id: 'mph', name: 'Milla por hora', symbol: 'mph', factor: 1609.344 / 3600.0 },
        { id: 'fts', name: 'Pie por segundo', symbol: 'ft/s', factor: 0.3048 },
    ]
};

function convertSpeed() {
    const inputValue = parseFloat(document.getElementById('inputValue-velocidad').value);
    const sourceUnitId = document.getElementById('sourceUnit-velocidad').value;
    const precision = parseInt(document.getElementById('precision-velocidad').value, 10);

    const sourceUnit = speedData.UNITS.find(u => u.id === sourceUnitId);
    
    if (isNaN(inputValue) || inputValue < 0) {
        speedData.UNITS.forEach(unit => {
            document.getElementById(`output-velocidad-${unit.id}`).textContent = 'Inválido';
        });
        return;
    }

    const valueInMetersPerSecond = inputValue * sourceUnit.factor;

    speedData.UNITS.forEach(targetUnit => {
        const convertedValue = valueInMetersPerSecond / targetUnit.factor;
        const formattedResult = (targetUnit.id === sourceUnitId) ? inputValue.toString() : convertedValue.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-velocidad-${targetUnit.id}`).textContent = formattedResult;

        const card = document.getElementById(`card-velocidad-${targetUnit.id}`);
        const isSource = targetUnit.id === sourceUnitId;
        card.classList.toggle('bg-indigo-50', isSource);
        card.classList.toggle('border-indigo-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    });
}

function initializeSpeedConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-velocidad');
    const resultsGrid = document.getElementById('resultsGrid-velocidad');
    const precisionSelect = document.getElementById('precision-velocidad');
    
    speedData.UNITS.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.id;
        option.textContent = `${unit.name} (${unit.symbol})`;
        sourceUnitSelect.appendChild(option);
    });

    resultsGrid.innerHTML = speedData.UNITS.map(unit => createResultCard(`${unit.name} (${unit.symbol})`, unit.id, 'velocidad', 'indigo')).join('');

    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;

    sourceUnitSelect.value = 'ms';
    convertSpeed();
}

// --- Datos y funciones para el conversor de Eficiencia de Combustible ---
const fuelEfficiencyData = {
    MILE_TO_KM: 1.609344,
    US_GALLON_TO_LITER: 3.785411784,
    IMPERIAL_GALLON_TO_LITER: 4.54609,
    UNITS: {
        'km_per_l': { name: 'Kilómetro/Litro', symbol: 'km/L', factorToKMPL: 1, isInverse: false },
        'mpg_us': { name: 'Millas/Galón (US)', symbol: 'mpg (US)', factorToKMPL: (1.609344 / 3.785411784), isInverse: false },
        'mpg_imp': { name: 'Millas/Galón (Imperial)', symbol: 'mpg (Imp.)', factorToKMPL: (1.609344 / 4.54609), isInverse: false },
        'l_per_100km': { name: 'Litros/100 Kilómetros', symbol: 'L/100 km', factorToKMPL: 100, isInverse: true },
        'gal_per_100mi': { name: 'Galones (US)/100 Millas', symbol: 'gal/100 mi', factorToKMPL: (100 / (1.609344 / 3.785411784)), isInverse: true },
    }
};

// La función createResultCard reemplaza a createFuelEfficiencyResultCard
// function createFuelEfficiencyResultCard(...) { ... }

function convertFuelEfficiency() {
    const inputEl = document.getElementById('inputValue-eficiencia');
    const selectEl = document.getElementById('selectUnit-eficiencia');
    const resultsEl = document.getElementById('resultsGrid-eficiencia');
    const precision = parseInt(document.getElementById('precision-eficiencia').value, 10);

    const inputValue = parseFloat(inputEl.value);
    const sourceKey = selectEl.value;
    const sourceUnit = fuelEfficiencyData.UNITS[sourceKey];

    if (isNaN(inputValue) || inputValue <= 0) {
        Object.keys(fuelEfficiencyData.UNITS).forEach(key => {
            const outputEl = document.getElementById(`output-eficiencia-${key}`);
            if (outputEl) outputEl.textContent = 'Inválido';
        });
        return;
    }

    let baseKMPLValue = sourceUnit.isInverse ? sourceUnit.factorToKMPL / inputValue : inputValue * sourceUnit.factorToKMPL;
    
    // Re-ejecutar la conversión para llenar los valores y aplicar estilos
    Object.entries(fuelEfficiencyData.UNITS).forEach(([targetKey, targetUnit]) => {
        const result = targetUnit.isInverse ? targetUnit.factorToKMPL / baseKMPLValue : baseKMPLValue / targetUnit.factorToKMPL;
        const formattedResult = (targetKey === sourceKey) ? inputValue.toString() : result.toFixed(precision);
        document.getElementById(`output-eficiencia-${targetKey}`).textContent = formattedResult;
        const card = document.getElementById(`card-eficiencia-${targetKey}`);
        const isSource = targetKey === sourceKey;
        card.classList.toggle('bg-teal-50', isSource);
        card.classList.toggle('border-teal-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    });
}

function initializeFuelEfficiencyConverter() {
    const selectEl = document.getElementById('selectUnit-eficiencia');
    const resultsGrid = document.getElementById('resultsGrid-eficiencia');
    const precisionSelect = document.getElementById('precision-eficiencia');

    const fragment = document.createDocumentFragment();
    Object.entries(fuelEfficiencyData.UNITS).forEach(([key, unit]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = unit.name + ` (${unit.symbol})`;
        fragment.appendChild(option);
    });
    selectEl.appendChild(fragment);

    resultsGrid.innerHTML = Object.entries(fuelEfficiencyData.UNITS).map(([key, unit]) => createResultCard(`${unit.name} (${unit.symbol})`, key, 'eficiencia', 'teal')).join('');

    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;

    selectEl.value = 'l_per_100km';
    convertFuelEfficiency();
}

// --- INICIALIZACIÓN GENERAL ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del menú lateral (Sidebar) ---
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('sidebar-toggle');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // --- Lógica para resaltar el enlace activo ---
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('bg-indigo-700', 'text-white');
        } else {
            link.classList.remove('bg-indigo-700', 'text-white');
        }
    });

    // --- Inicialización del conversor adecuado ---
    // Revisa si estamos en la página de longitud
    if (document.getElementById('resultsGrid-longitud')) {
        initializeLengthConverter();
        // Asigna los eventos a los elementos del conversor de longitud
        document.getElementById('inputValue-longitud').addEventListener('input', convertLength);
        document.getElementById('precision-longitud').addEventListener('change', convertLength);
        document.getElementById('sourceUnit-longitud').addEventListener('change', convertLength);
    }

    // Revisa si estamos en la página de presión
    if (document.getElementById('resultsGrid-presion')) {
        initializePressureConverter();
        // Asigna los eventos a los elementos del conversor de presión
        document.getElementById('inputValue-presion').addEventListener('input', convertPressure);
        document.getElementById('precision-presion').addEventListener('change', convertPressure);
        document.getElementById('sourceUnit-presion').addEventListener('change', convertPressure);
    }

    // Revisa si estamos en la página de temperatura
    if (document.getElementById('resultsGrid-temperatura')) {
        initializeTemperatureConverter();
        // Asigna los eventos a los elementos del conversor de temperatura
        document.getElementById('inputValue-temperatura').addEventListener('input', convertTemperature);
        document.getElementById('precision-temperatura').addEventListener('change', convertTemperature);
        document.getElementById('sourceUnit-temperatura').addEventListener('change', convertTemperature);
    }

    // Revisa si estamos en la página de tiempo
    if (document.getElementById('resultsGrid-tiempo')) {
        initializeTimeConverter();
        // Asigna los eventos a los elementos del conversor de tiempo
        document.getElementById('inputValue-tiempo').addEventListener('input', convertTime);
        document.getElementById('precision-tiempo').addEventListener('change', convertTime);
        document.getElementById('sourceUnit-tiempo').addEventListener('change', convertTime);
    }

    // Revisa si estamos en la página de masa
    if (document.getElementById('resultsGrid-masa')) {
        initializeMassConverter();
        // Asigna los eventos a los elementos del conversor de masa
        document.getElementById('inputValue-masa').addEventListener('input', convertMass);
        document.getElementById('precision-masa').addEventListener('change', convertMass);
        document.getElementById('sourceUnit-masa').addEventListener('change', convertMass);
    }

    // Revisa si estamos en la página de volumen
    if (document.getElementById('resultsGrid-volumen')) {
        initializeVolumeConverter();
        // Asigna los eventos a los elementos del conversor de volumen
        document.getElementById('inputValue-volumen').addEventListener('input', convertVolume);
        document.getElementById('precision-volumen').addEventListener('change', convertVolume);
        document.getElementById('sourceUnit-volumen').addEventListener('change', convertVolume);
    }

    // Revisa si estamos en la página de ángulo plano
    if (document.getElementById('resultsGrid-anguloplano')) {
        initializeAngleConverter();
        // Asigna los eventos a los elementos del conversor de ángulo plano
        document.getElementById('inputValue-anguloplano').addEventListener('input', convertAngle);
        document.getElementById('precision-anguloplano').addEventListener('change', convertAngle);
        document.getElementById('sourceUnit-anguloplano').addEventListener('change', convertAngle);
    }

    // Revisa si estamos en la página de área
    if (document.getElementById('resultsGrid-area')) {
        initializeAreaConverter();
        // Asigna los eventos a los elementos del conversor de área
        document.getElementById('inputValue-area').addEventListener('input', convertArea);
        document.getElementById('precision-area').addEventListener('change', convertArea);
        document.getElementById('sourceUnit-area').addEventListener('change', convertArea);
    }

    // Revisa si estamos en la página de energía
    if (document.getElementById('resultsGrid-energia')) {
        initializeEnergyConverter();
        // Asigna los eventos a los elementos del conversor de energía
        document.getElementById('inputValue-energia').addEventListener('input', convertEnergy);
        document.getElementById('precision-energia').addEventListener('change', convertEnergy);
        document.getElementById('sourceUnit-energia').addEventListener('change', convertEnergy);
    }

    // Revisa si estamos en la página de almacenamiento de datos
    if (document.getElementById('resultsGrid-almacenamiento')) {
        initializeDataStorageConverter();
        // Asigna los eventos a los elementos del conversor de almacenamiento
        document.getElementById('inputValue-almacenamiento').addEventListener('input', convertDataStorage);
        document.getElementById('precision-almacenamiento').addEventListener('change', convertDataStorage);
        document.getElementById('sourceUnit-almacenamiento').addEventListener('change', convertDataStorage);
    }

    // Revisa si estamos en la página de velocidad
    if (document.getElementById('resultsGrid-velocidad')) {
        initializeSpeedConverter();
        // Asigna los eventos a los elementos del conversor de velocidad
        document.getElementById('inputValue-velocidad').addEventListener('input', convertSpeed);
        document.getElementById('precision-velocidad').addEventListener('change', convertSpeed);
        document.getElementById('sourceUnit-velocidad').addEventListener('change', convertSpeed);
    }
    
    // Revisa si estamos en la página de eficiencia de combustible
    if (document.getElementById('resultsGrid-eficiencia')) {
        initializeFuelEfficiencyConverter();
        // Asigna los eventos a los elementos del conversor de eficiencia de combustible
        document.getElementById('inputValue-eficiencia').addEventListener('input', convertFuelEfficiency);
        document.getElementById('precision-eficiencia').addEventListener('change', convertFuelEfficiency);
        document.getElementById('selectUnit-eficiencia').addEventListener('change', convertFuelEfficiency);
    }

});
