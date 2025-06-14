// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected section
        const sectionId = this.getAttribute('data-section') + '-section';
        document.getElementById(sectionId).classList.remove('hidden');
    });
});

// Scenario buttons
document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const scenario = this.getAttribute('data-scenario');
        updateScenario(scenario);
    });
});

function updateScenario(scenario) {
    // Update values based on scenario
    let revenue, ebitda, txnVolume;
    
    switch(scenario) {
        case 'optimista':
            revenue = '$12.0M';
            ebitda = '$4.2M';
            txnVolume = '1.5M';
            break;
        case 'pesimista':
            revenue = '$8.0M';
            ebitda = '$2.2M';
            txnVolume = '0.9M';
            break;
        default: // base
            revenue = '$10.0M';
            ebitda = '$3.2M';
            txnVolume = '1.2M';
    }
    
    document.getElementById('revenue-kpi').textContent = revenue;
    document.getElementById('ebitda-kpi').textContent = ebitda;
    document.getElementById('txn-kpi').textContent = txnVolume;
    
    // Update charts
    if (window.revenueChart) {
        updateCharts(scenario);
    }
}

// Transaction volume input
document.getElementById('transaction-volume').addEventListener('input', function() {
    const volume = parseFloat(this.value) || 0;
    updatePL(volume);
});

function updatePL(volume) {
    // Simple linear model for demo purposes
    const baseIncome = 10000000;
    const baseVolume = 1.2;
    const income = (volume / baseVolume) * baseIncome;
    const costs = income * 0.6;
    const expenses = income * 0.08;
    const ebitda = income - costs - expenses;
    
    document.getElementById('operating-income').textContent = formatCurrency(income);
    document.getElementById('direct-costs').textContent = formatCurrency(costs);
    document.getElementById('gross-margin').textContent = formatCurrency(income - costs);
    document.getElementById('operating-expenses').textContent = formatCurrency(expenses);
    document.getElementById('ebitda').textContent = formatCurrency(ebitda);
    
    // Update KPI
    const costPerTxn = (costs + expenses) / (volume * 1000000);
    document.getElementById('cost-per-txn').textContent = '$' + costPerTxn.toFixed(2);
    
    // Update charts
    if (window.plChart) {
        updatePLChart(income, costs, expenses);
    }
}

function formatCurrency(amount) {
    return '$' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Scenario options in simulator
document.getElementById('decision-scenario').addEventListener('change', function() {
    document.querySelectorAll('.scenario-options').forEach(opt => {
        opt.classList.add('hidden');
    });
    
    document.getElementById(this.value + '-options').classList.remove('hidden');
});

// Simulation buttons
document.getElementById('simulate-crypto').addEventListener('click', function() {
    const investment = parseInt(document.getElementById('crypto-investment').value) || 0;
    const adoption = parseInt(document.getElementById('crypto-adoption').value) || 0;
    
    // Simple simulation logic
    const roi = 15 + (adoption / 2) + (investment > 2000000 ? 10 : 0);
    const marketShare = Math.min(15, 3 + (adoption / 10));
    const ebitdaImpact = 5 + (adoption / 5);
    
    document.getElementById('crypto-roi').textContent = roi + '%';
    document.getElementById('crypto-market-share').textContent = marketShare + '%';
    document.getElementById('crypto-ebitda-impact').textContent = '+' + ebitdaImpact + '%';
    
    document.getElementById('crypto-results').style.display = 'block';
});

document.getElementById('simulate-fintech').addEventListener('click', function() {
    const type = document.getElementById('fintech-type').value;
    const investment = parseInt(document.getElementById('fintech-investment').value) || 0;
    
    // Simple simulation logic
    let txns, roi, nps;
    
    if (type === 'neobank') {
        txns = 250000 + (investment / 2000000) * 150000;
        roi = 30 + (investment > 1000000 ? 10 : 0);
        nps = 8;
    } else if (type === 'remesas') {
        txns = 180000 + (investment / 2000000) * 120000;
        roi = 35;
        nps = 5;
    } else { // pagos
        txns = 300000 + (investment / 2000000) * 200000;
        roi = 25;
        nps = 10;
    }
    
    document.getElementById('fintech-txns').textContent = formatNumber(txns);
    document.getElementById('fintech-roi').textContent = roi + '%';
    document.getElementById('fintech-nps-impact').textContent = '+' + nps + ' puntos';
    
    document.getElementById('fintech-results').style.display = 'block';
});

document.getElementById('simulate-product').addEventListener('click', function() {
    const type = document.getElementById('product-type').value;
    const investment = parseInt(document.getElementById('product-investment').value) || 0;
    const timeline = parseInt(document.getElementById('product-timeline').value) || 0;
    
    // Simple simulation logic
    let breakeven, marketShare, churnImpact;
    
    if (type === 'qr') {
        breakeven = Math.max(12, 15 - (investment / 500000));
        marketShare = 10 + (investment > 1000000 ? 5 : 0);
        churnImpact = -2;
    } else if (type === 'billetera') {
        breakeven = Math.max(18, 20 - (investment / 500000));
        marketShare = 15;
        churnImpact = -3;
    } else { // credito
        breakeven = Math.max(15, 18 - (investment / 500000));
        marketShare = 8;
        churnImpact = -1;
    }
    
    // Adjust for timeline
    breakeven = breakeven + (timeline - 9) / 3;
    
    document.getElementById('product-breakeven').textContent = Math.round(breakeven) + ' meses';
    document.getElementById('product-market-share').textContent = marketShare + '%';
    document.getElementById('product-churn-impact').textContent = churnImpact + '%';
    
    document.getElementById('product-results').style.display = 'block';
});

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenue-chart').getContext('2d');
    window.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Ingresos (millones)',
                data: [8, 8.5, 9.2, 9.8, 10.5, 11.2],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 7
                }
            }
        }
    });
    
    // P&L Chart
    const plCtx = document.getElementById('pl-chart').getContext('2d');
    window.plChart = new Chart(plCtx, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Costos', 'Gastos', 'EBITDA'],
            datasets: [{
                label: 'Millones USD',
                data: [10, 6, 0.8, 3.2],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(52, 152, 219, 0.7)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(52, 152, 219, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    function updatePLChart(income, costs, expenses) {
        const ebitda = income - costs - expenses;
        window.plChart.data.datasets[0].data = [
            income / 1000000,
            costs / 1000000,
            expenses / 1000000,
            ebitda / 1000000
        ];
        window.plChart.update();
    }
    
    // KPIs Chart
    const kpisCtx = document.getElementById('kpis-chart').getContext('2d');
    window.kpisChart = new Chart(kpisCtx, {
        type: 'radar',
        data: {
            labels: ['Margen Bruto', 'Eficiencia', 'Tasa Éxito', 'NPS', 'Uptime'],
            datasets: [{
                label: 'Actual',
                data: [80, 75, 98, 65, 99],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
            }, {
                label: 'Meta',
                data: [90, 85, 95, 70, 99.9],
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: 'rgba(46, 204, 113, 1)',
                pointBackgroundColor: 'rgba(46, 204, 113, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(46, 204, 113, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            }
        }
    });
    
    // BCG Matrix
    const bcgCtx = document.getElementById('bcg-matrix').getContext('2d');
    window.bcgChart = new Chart(bcgCtx, {
        type: 'bubble',
        data: {
            datasets: [
                {
                    label: 'Estrellas',
                    data: [{
                        x: 35,
                        y: 70,
                        r: 20
                    }],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)'
                },
                {
                    label: 'Vacas Lecheras',
                    data: [{
                        x: 25,
                        y: 5,
                        r: 15
                    }],
                    backgroundColor: 'rgba(46, 204, 113, 0.7)'
                },
                {
                    label: 'Interrogantes',
                    data: [{
                        x: 3,
                        y: 300,
                        r: 10
                    }],
                    backgroundColor: 'rgba(241, 196, 15, 0.7)'
                },
                {
                    label: 'Perros',
                    data: [{
                        x: 8,
                        y: -10,
                        r: 8
                    }],
                    backgroundColor: 'rgba(231, 76, 60, 0.7)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Participación de Mercado (%)'
                    },
                    min: 0,
                    max: 40
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tasa de Crecimiento (%)'
                    },
                    min: -20,
                    max: 350
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const labels = ['Transferencias', 'Tarjetas', 'Cripto', 'Cheques'];
                            return labels[context.datasetIndex];
                        }
                    }
                }
            }
        }
    });
    
    // Porter's 5 Forces Chart
    const porterCtx = document.getElementById('porter-chart').getContext('2d');
    window.porterChart = new Chart(porterCtx, {
        type: 'radar',
        data: {
            labels: ['Nuevos Entrantes', 'Poder Proveedores', 'Poder Clientes', 'Productos Sustitutos', 'Rivalidad Competitiva'],
            datasets: [{
                label: 'Intensidad',
                data: [8, 5, 7, 6, 8],
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderColor: 'rgba(231, 76, 60, 1)',
                pointBackgroundColor: 'rgba(231, 76, 60, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(231, 76, 60, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }
        }
    });
    
    // Initialize P&L with default values
    updatePL(1.2);
});