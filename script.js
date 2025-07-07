// Kalkulator Turunan Numerik
class NumericalDerivativeCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.functionInput = document.getElementById('function-input');
        this.xValue = document.getElementById('x-value');
        this.hValue = document.getElementById('h-value');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resultsSection = document.getElementById('results-section');
        this.resultsContent = document.getElementById('results-content');
        this.explanationSection = document.getElementById('explanation-section');
        this.explanationContent = document.getElementById('explanation-content');
    }

    bindEvents() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        
        // Enter key untuk calculate
        [this.functionInput, this.xValue, this.hValue].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculate();
                }
            });
        });

        // Real-time validation
        this.functionInput.addEventListener('input', () => this.validateFunction());
    }

    validateFunction() {
        const func = this.functionInput.value.trim();
        if (!func) {
            this.functionInput.style.borderColor = '#dc3545';
            return false;
        }
        
        try {
            // Test dengan nilai dummy
            this.evaluateFunction(func, 1);
            this.functionInput.style.borderColor = '#28a745';
            return true;
        } catch (error) {
            this.functionInput.style.borderColor = '#dc3545';
            return false;
        }
    }

    evaluateFunction(expression, x) {
        // Ganti x dengan nilai aktual
        let func = expression.toLowerCase();
        
        // Ganti fungsi matematika
        func = func.replace(/sin\(/g, 'Math.sin(');
        func = func.replace(/cos\(/g, 'Math.cos(');
        func = func.replace(/tan\(/g, 'Math.tan(');
        func = func.replace(/log\(/g, 'Math.log(');
        func = func.replace(/sqrt\(/g, 'Math.sqrt(');
        func = func.replace(/exp\(/g, 'Math.exp(');
        func = func.replace(/\^/g, '**');
        
        // Ganti x dengan nilai
        func = func.replace(/x/g, `(${x})`);
        
        // Tambahkan operator perkalian implisit
        func = func.replace(/(\d+)\(/g, '$1*(');
        func = func.replace(/\)(\d+)/g, ')*$1');
        func = func.replace(/\)\(/g, ')*(');
        
        // Evaluasi ekspresi
        return Function('"use strict"; return (' + func + ')')();
    }

    backwardDifference(func, x, h) {
        const fx = this.evaluateFunction(func, x);
        const fxMinusH = this.evaluateFunction(func, x - h);
        const derivative = (fx - fxMinusH) / h;
        
        return {
            derivative: derivative,
            fx: fx,
            fxMinusH: fxMinusH,
            formula: `f'(x) = [f(${x}) - f(${x - h})] / ${h}`,
            calculation: `f'(x) = [${fx.toFixed(6)} - ${fxMinusH.toFixed(6)}] / ${h}`,
            result: `f'(x) = ${derivative.toFixed(6)}`
        };
    }

    centralDifference(func, x, h) {
        const fxPlusH = this.evaluateFunction(func, x + h);
        const fxMinusH = this.evaluateFunction(func, x - h);
        const derivative = (fxPlusH - fxMinusH) / (2 * h);
        
        return {
            derivative: derivative,
            fxPlusH: fxPlusH,
            fxMinusH: fxMinusH,
            formula: `f'(x) = [f(${x + h}) - f(${x - h})] / (2 × ${h})`,
            calculation: `f'(x) = [${fxPlusH.toFixed(6)} - ${fxMinusH.toFixed(6)}] / ${2 * h}`,
            result: `f'(x) = ${derivative.toFixed(6)}`
        };
    }

    getAnalyticalDerivative(func, x) {
        // Implementasi sederhana untuk beberapa fungsi umum
        const lowerFunc = func.toLowerCase();
        
        if (lowerFunc.includes('x^2') || lowerFunc.includes('x**2')) {
            return 2 * x;
        } else if (lowerFunc.includes('x^3') || lowerFunc.includes('x**3')) {
            return 3 * x * x;
        } else if (lowerFunc.includes('sin(x)')) {
            return Math.cos(x);
        } else if (lowerFunc.includes('cos(x)')) {
            return -Math.sin(x);
        }
        
        return null;
    }

    calculate() {
        try {
            const func = this.functionInput.value.trim();
            const x = parseFloat(this.xValue.value);
            const h = parseFloat(this.hValue.value);
            const method = document.querySelector('input[name="method"]:checked').value;

            if (!func || isNaN(x) || isNaN(h)) {
                alert('Mohon isi semua field dengan benar!');
                return;
            }

            if (h <= 0) {
                alert('Nilai h harus lebih besar dari 0!');
                return;
            }

            // Validasi fungsi
            if (!this.validateFunction()) {
                alert('Fungsi tidak valid! Periksa sintaks Anda.');
                return;
            }

            let results = '';
            let explanation = '';

            // Hitung berdasarkan metode yang dipilih
            if (method === 'backward' || method === 'both') {
                const backward = this.backwardDifference(func, x, h);
                results += this.formatResult('Metode Selisih Mundur', backward, '#28a745');
                
                if (method === 'backward') {
                    explanation = this.getBackwardExplanation();
                }
            }

            if (method === 'central' || method === 'both') {
                const central = this.centralDifference(func, x, h);
                results += this.formatResult('Metode Selisih Pusat', central, '#007bff');
                
                if (method === 'central') {
                    explanation = this.getCentralExplanation();
                }
            }

            if (method === 'both') {
                const backward = this.backwardDifference(func, x, h);
                const central = this.centralDifference(func, x, h);
                
                results += this.formatComparison(backward, central);
                explanation = this.getBothExplanation();
            }

            // Tampilkan hasil
            this.resultsContent.innerHTML = results;
            this.explanationContent.innerHTML = explanation;
            
            this.resultsSection.classList.add('show');
            this.explanationSection.classList.add('show');
            
            // Scroll ke hasil
            this.resultsSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan dalam perhitungan. Periksa input Anda.');
        }
    }

    formatResult(title, result, color) {
        return `
            <div class="result-item" style="border-left-color: ${color}">
                <h4>${title}</h4>
                <div class="result-value">${result.derivative.toFixed(8)}</div>
                <div class="result-formula">
                    <strong>Formula:</strong> ${result.formula}<br>
                    <strong>Perhitungan:</strong> ${result.calculation}<br>
                    <strong>Hasil:</strong> ${result.result}
                </div>
            </div>
        `;
    }

    formatComparison(backward, central) {
        const difference = Math.abs(backward.derivative - central.derivative);
        const percentDiff = (difference / Math.abs(central.derivative) * 100).toFixed(4);
        
        return `
            <div class="result-item" style="border-left-color: #6c757d">
                <h4>Perbandingan Metode</h4>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Metode</th>
                            <th>Hasil</th>
                            <th>Akurasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Selisih Mundur</td>
                            <td>${backward.derivative.toFixed(8)}</td>
                            <td>Kurang akurat</td>
                        </tr>
                        <tr>
                            <td>Selisih Pusat</td>
                            <td>${central.derivative.toFixed(8)}</td>
                            <td>Lebih akurat</td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <strong>Selisih:</strong> ${difference.toFixed(8)} (${percentDiff}%)
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    getBackwardExplanation() {
        return `
            <div class="explanation-content">
                <h4>Metode Selisih Mundur (Backward Difference)</h4>
                <p><strong>Formula:</strong> f'(x) ≈ [f(x) - f(x-h)] / h</p>
                
                <h5>Karakteristik:</h5>
                <ul>
                    <li>Menggunakan nilai fungsi pada titik x dan x-h</li>
                    <li>Lebih sederhana dalam implementasi</li>
                    <li>Akurasi lebih rendah dibanding metode selisih pusat</li>
                    <li>Kesalahan truncation order O(h)</li>
                </ul>
                
                <h5>Kelebihan:</h5>
                <ul>
                    <li>Mudah diimplementasikan</li>
                    <li>Hanya membutuhkan dua evaluasi fungsi</li>
                    <li>Cocok untuk fungsi yang hanya dapat dievaluasi pada satu arah</li>
                </ul>
                
                <h5>Kekurangan:</h5>
                <ul>
                    <li>Akurasi lebih rendah</li>
                    <li>Lebih sensitif terhadap nilai h</li>
                    <li>Dapat memberikan hasil yang bias</li>
                </ul>
            </div>
        `;
    }

    getCentralExplanation() {
        return `
            <div class="explanation-content">
                <h4>Metode Selisih Pusat (Central Difference)</h4>
                <p><strong>Formula:</strong> f'(x) ≈ [f(x+h) - f(x-h)] / (2h)</p>
                
                <h5>Karakteristik:</h5>
                <ul>
                    <li>Menggunakan nilai fungsi pada titik x+h dan x-h</li>
                    <li>Lebih akurat dibanding metode selisih mundur</li>
                    <li>Kesalahan truncation order O(h²)</li>
                    <li>Simetris terhadap titik x</li>
                </ul>
                
                <h5>Kelebihan:</h5>
                <ul>
                    <li>Akurasi lebih tinggi</li>
                    <li>Lebih stabil secara numerik</li>
                    <li>Hasil lebih mendekati nilai turunan analitik</li>
                    <li>Kesalahan lebih kecil untuk h yang sama</li>
                </ul>
                
                <h5>Kekurangan:</h5>
                <ul>
                    <li>Membutuhkan evaluasi fungsi di dua titik</li>
                    <li>Tidak dapat digunakan di batas domain</li>
                    <li>Lebih kompleks dalam implementasi</li>
                </ul>
            </div>
        `;
    }

    getBothExplanation() {
        return `
            <div class="explanation-content">
                <h4>Perbandingan Metode Selisih Mundur vs Selisih Pusat</h4>
                
                <h5>Perbedaan Utama:</h5>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Aspek</th>
                            <th>Selisih Mundur</th>
                            <th>Selisih Pusat</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Formula</td>
                            <td>[f(x) - f(x-h)] / h</td>
                            <td>[f(x+h) - f(x-h)] / (2h)</td>
                        </tr>
                        <tr>
                            <td>Order Akurasi</td>
                            <td>O(h)</td>
                            <td>O(h²)</td>
                        </tr>
                        <tr>
                            <td>Jumlah Evaluasi</td>
                            <td>2</td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td>Akurasi</td>
                            <td>Rendah</td>
                            <td>Tinggi</td>
                        </tr>
                        <tr>
                            <td>Stabilitas</td>
                            <td>Kurang stabil</td>
                            <td>Lebih stabil</td>
                        </tr>
                    </tbody>
                </table>
                
                <h5>Rekomendasi:</h5>
                <ul>
                    <li><strong>Gunakan Selisih Pusat</strong> untuk akurasi yang lebih tinggi</li>
                    <li><strong>Nilai h optimal:</strong> Biasanya antara 0.001 - 0.0001</li>
                    <li><strong>Pertimbangan:</strong> Selisih pusat hampir selalu lebih akurat</li>
                    <li><strong>Aplikasi:</strong> Selisih mundur hanya untuk kasus khusus</li>
                </ul>
            </div>
        `;
    }
}

// Inisialisasi aplikasi ketika DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
    new NumericalDerivativeCalculator();
});

// Fungsi utility tambahan
function formatNumber(num, decimals = 6) {
    return parseFloat(num.toFixed(decimals));
}

// Fungsi untuk menangani kesalahan input
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// Fungsi untuk menangani success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 2000);
}

// CSS untuk animasi notifikasi
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .error-message, .success-message {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        letter-spacing: 0.5px;
    }
`;
document.head.appendChild(style);