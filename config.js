// Konfigurasi aplikasi kalkulator turunan numerik
const AppConfig = {
    // Pengaturan default
    defaults: {
        function: 'x^2 + 3*x + 2',
        xValue: 2,
        hValue: 0.001,
        method: 'central',
        precision: 8
    },

    // Contoh-contoh fungsi yang bisa digunakan
    sampleFunctions: [
        {
            name: 'Fungsi Kuadrat',
            expression: 'x^2 + 3*x + 2',
            description: 'Fungsi polinomial derajat 2',
            analyticalDerivative: '2*x + 3'
        },
        {
            name: 'Fungsi Kubik',
            expression: 'x^3 - 2*x^2 + x - 1',
            description: 'Fungsi polinomial derajat 3',
            analyticalDerivative: '3*x^2 - 4*x + 1'
        },
        {
            name: 'Fungsi Trigonometri',
            expression: 'sin(x) + cos(x)',
            description: 'Kombinasi sinus dan cosinus',
            analyticalDerivative: 'cos(x) - sin(x)'
        },
        {
            name: 'Fungsi Eksponensial',
            expression: 'exp(x) + x^2',
            description: 'Fungsi eksponensial dengan kuadrat',
            analyticalDerivative: 'exp(x) + 2*x'
        },
        {
            name: 'Fungsi Logaritma',
            expression: 'log(x) + x',
            description: 'Fungsi logaritma natural',
            analyticalDerivative: '1/x + 1'
        },
        {
            name: 'Fungsi Akar',
            expression: 'sqrt(x) + x',
            description: 'Fungsi akar kuadrat',
            analyticalDerivative: '1/(2*sqrt(x)) + 1'
        }
    ],

    // Pengaturan nilai h yang direkomendasikan
    recommendedH: [
        { value: 0.1, label: '0.1 (Kasar)', accuracy: 'Rendah' },
        { value: 0.01, label: '0.01 (Sedang)', accuracy: 'Sedang' },
        { value: 0.001, label: '0.001 (Halus)', accuracy: 'Tinggi' },
        { value: 0.0001, label: '0.0001 (Sangat Halus)', accuracy: 'Sangat Tinggi' },
        { value: 0.00001, label: '0.00001 (Ultra Halus)', accuracy: 'Ultra Tinggi' }
    ],

    // Pengaturan tema warna
    themes: {
        default: {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#28a745',
            info: '#007bff',
            warning: '#ffc107',
            danger: '#dc3545'
        },
        dark: {
            primary: '#4a5568',
            secondary: '#2d3748',
            success: '#38a169',
            info: '#3182ce',
            warning: '#d69e2e',
            danger: '#e53e3e'
        },
        ocean: {
            primary: '#0077be',
            secondary: '#005f8a',
            success: '#00a86b',
            info: '#0099cc',
            warning: '#ff8c00',
            danger: '#dc143c'
        }
    },

    // Pengaturan validasi
    validation: {
        minH: 1e-10,
        maxH: 1,
        maxPrecision: 15,
        minPrecision: 1,
        maxIterations: 1000
    },

    // Pesan error yang user-friendly
    errorMessages: {
        invalidFunction: 'Fungsi tidak valid. Periksa sintaks matematika Anda.',
        invalidX: 'Nilai x harus berupa angka.',
        invalidH: 'Nilai h harus berupa angka positif.',
        hTooSmall: 'Nilai h terlalu kecil. Gunakan nilai >= 1e-10.',
        hTooLarge: 'Nilai h terlalu besar. Gunakan nilai <= 1.',
        evaluationError: 'Gagal mengevaluasi fungsi. Periksa domain fungsi.',
        divisionByZero: 'Pembagian dengan nol terdeteksi.'
    },

    // Pengaturan format output
    outputFormat: {
        decimalPlaces: 8,
        scientificNotation: false,
        showSteps: true,
        showFormula: true,
        showComparison: true
    },

    // Fungsi utility untuk mengaplikasikan konfigurasi
    applyTheme: function(themeName) {
        const theme = this.themes[themeName] || this.themes.default;
        const root = document.documentElement;
        
        Object.keys(theme).forEach(key => {
            root.style.setProperty(`--color-${key}`, theme[key]);
        });
    },

    // Fungsi untuk mendapatkan contoh fungsi
    getSampleFunction: function(index) {
        if (index >= 0 && index < this.sampleFunctions.length) {
            return this.sampleFunctions[index];
        }
        return this.sampleFunctions[0];
    },

    // Fungsi untuk validasi input
    validateInput: function(func, x, h) {
        const errors = [];

        if (!func || func.trim() === '') {
            errors.push(this.errorMessages.invalidFunction);
        }

        if (isNaN(x) || !isFinite(x)) {
            errors.push(this.errorMessages.invalidX);
        }

        if (isNaN(h) || !isFinite(h) || h <= 0) {
            errors.push(this.errorMessages.invalidH);
        }

        if (h < this.validation.minH) {
            errors.push(this.errorMessages.hTooSmall);
        }

        if (h > this.validation.maxH) {
            errors.push(this.errorMessages.hTooLarge);
        }

        return errors;
    },

    // Fungsi untuk format angka
    formatNumber: function(number, precision = null) {
        const places = precision || this.outputFormat.decimalPlaces;
        
        if (this.outputFormat.scientificNotation && Math.abs(number) > 1e6) {
            return number.toExponential(places);
        }
        
        return number.toFixed(places);
    }
};

// Fungsi untuk menambahkan dropdown contoh fungsi
function addSampleFunctionDropdown() {
    const functionInput = document.getElementById('function-input');
    const container = functionInput.parentElement;
    
    const dropdown = document.createElement('select');
    dropdown.id = 'sample-functions';
    dropdown.innerHTML = '<option value="">Pilih contoh fungsi...</option>';
    
    AppConfig.sampleFunctions.forEach((func, index) => {
        const option = document.createElement('option');
        option.value = func.expression;
        option.textContent = `${func.name} - ${func.expression}`;
        dropdown.appendChild(option);
    });
    
    dropdown.addEventListener('change', function() {
        if (this.value) {
            functionInput.value = this.value;
            functionInput.dispatchEvent(new Event('input'));
        }
    });
    
    container.appendChild(dropdown);
}

// Fungsi untuk menambahkan dropdown nilai h
function addHValueDropdown() {
    const hInput = document.getElementById('h-value');
    const container = hInput.parentElement;
    
    const dropdown = document.createElement('select');
    dropdown.id = 'h-presets';
    dropdown.innerHTML = '<option value="">Pilih nilai h...</option>';
    
    AppConfig.recommendedH.forEach(h => {
        const option = document.createElement('option');
        option.value = h.value;
        option.textContent = `${h.label} (${h.accuracy})`;
        dropdown.appendChild(option);
    });
    
    dropdown.addEventListener('change', function() {
        if (this.value) {
            hInput.value = this.value;
        }
    });
    
    container.appendChild(dropdown);
}

// Inisialisasi konfigurasi tambahan
document.addEventListener('DOMContentLoaded', function() {
    // Terapkan tema default
    AppConfig.applyTheme('default');
    
    // Tambahkan dropdown jika diinginkan
    // addSampleFunctionDropdown();
    // addHValueDropdown();
    
    // Set nilai default
    const functionInput = document.getElementById('function-input');
    const xInput = document.getElementById('x-value');
    const hInput = document.getElementById('h-value');
    
    if (functionInput && !functionInput.value) {
        functionInput.value = AppConfig.defaults.function;
    }
    
    if (xInput && !xInput.value) {
        xInput.value = AppConfig.defaults.xValue;
    }
    
    if (hInput && !hInput.value) {
        hInput.value = AppConfig.defaults.hValue;
    }
});

// Export konfigurasi untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}