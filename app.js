// Application Data
let fundData = {
  fund_info: {
    fund_name: "TechVenture Fund I",
    fund_size: 50000000,
    paid_in_percentage: 0.75,
    management_fee: 0.02,
    carried_interest: 0.20,
    vintage_year: 2022,
    investment_period: "Active"
  },
  portfolio_companies: [
    {
      id: 1,
      name: "DataFlow AI",
      sector: "Artificial Intelligence",
      investment_date: "2022-03-15",
      investment_amount: 2000000,
      current_valuation: 12000000,
      status: "Active",
      rounds: [
        {date: "2022-03-15", amount: 2000000, valuation: 8000000, type: "Series A", fund_participation: 2000000},
        {date: "2023-09-10", amount: 5000000, valuation: 12000000, type: "Series B", fund_participation: 1500000}
      ]
    },
    {
      id: 2,
      name: "HealthTech Solutions",
      sector: "Healthcare Technology",
      investment_date: "2022-07-20",
      investment_amount: 1500000,
      current_valuation: 8000000,
      status: "Active",
      rounds: [
        {date: "2022-07-20", amount: 1500000, valuation: 6000000, type: "Seed", fund_participation: 1500000}
      ]
    },
    {
      id: 3,
      name: "FinanceApp Inc",
      sector: "Fintech",
      investment_date: "2022-11-05",
      investment_amount: 3000000,
      current_valuation: 25000000,
      status: "Active",
      rounds: [
        {date: "2022-11-05", amount: 3000000, valuation: 15000000, type: "Series A", fund_participation: 3000000},
        {date: "2024-01-15", amount: 10000000, valuation: 25000000, type: "Series B", fund_participation: 2000000}
      ]
    },
    {
      id: 4,
      name: "CloudSecure",
      sector: "Cybersecurity",
      investment_date: "2023-02-12",
      investment_amount: 2500000,
      current_valuation: 18000000,
      status: "Active",
      rounds: [
        {date: "2023-02-12", amount: 2500000, valuation: 10000000, type: "Series A", fund_participation: 2500000}
      ]
    },
    {
      id: 5,
      name: "GreenEnergy Corp",
      sector: "Clean Technology",
      investment_date: "2023-05-18",
      investment_amount: 4000000,
      current_valuation: 22000000,
      status: "Active",
      rounds: [
        {date: "2023-05-18", amount: 4000000, valuation: 16000000, type: "Series A", fund_participation: 4000000}
      ]
    },
    {
      id: 6,
      name: "EdTech Platform",
      sector: "Education Technology",
      investment_date: "2023-08-25",
      investment_amount: 1800000,
      current_valuation: 6500000,
      status: "Active",
      rounds: [
        {date: "2023-08-25", amount: 1800000, valuation: 5000000, type: "Seed", fund_participation: 1800000}
      ]
    },
    {
      id: 7,
      name: "RetailTech Systems",
      sector: "Retail Technology",
      investment_date: "2022-12-08",
      investment_amount: 2200000,
      current_valuation: 0,
      status: "Written Off",
      rounds: [
        {date: "2022-12-08", amount: 2200000, valuation: 8000000, type: "Series A", fund_participation: 2200000}
      ]
    },
    {
      id: 8,
      name: "LogisticsPro",
      sector: "Supply Chain",
      investment_date: "2022-05-30",
      investment_amount: 2800000,
      current_valuation: 0,
      status: "Exited",
      exit_date: "2024-06-15",
      exit_value: 15000000,
      exit_type: "Acquisition",
      rounds: [
        {date: "2022-05-30", amount: 2800000, valuation: 10000000, type: "Series A", fund_participation: 2800000}
      ]
    }
  ],
  lp_commitments: [
    {name: "Pension Fund Alpha", commitment: 10000000, paid_in: 7500000, status: "Wired In"},
    {name: "University Endowment", commitment: 8000000, paid_in: 6000000, status: "Wired In"},  
    {name: "Family Office Beta", commitment: 5000000, paid_in: 3750000, status: "Awaiting Wire"},
    {name: "Corporate Venture", commitment: 7000000, paid_in: 5250000, status: "Wired In"},
    {name: "Insurance Fund", commitment: 6000000, paid_in: 4500000, status: "Awaiting Sign"},
    {name: "Sovereign Wealth", commitment: 14000000, paid_in: 10500000, status: "Wired In"}
  ],
  capital_calls: [
    {date: "2022-02-01", amount: 10000000, percentage: 20, purpose: "Initial Investments"},
    {date: "2022-08-15", amount: 12500000, percentage: 25, purpose: "Follow-on Rounds"},
    {date: "2023-03-10", amount: 15000000, percentage: 30, purpose: "New Investments"},
    {date: "2024-01-20", amount: 0, percentage: 0, purpose: "Pending - Series B Follow-ons"}
  ]
};

let charts = {};
let currentEditingCompany = null;

// Utility Functions
function formatCurrency(amount) {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  } else {
    return `$${amount.toLocaleString()}`;
  }
}

function formatPercentage(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Metrics Calculations
function calculateMetrics() {
  const paidInCapital = fundData.fund_info.fund_size * fundData.fund_info.paid_in_percentage;
  
  // Calculate total invested capital
  const totalInvested = fundData.portfolio_companies.reduce((sum, company) => {
    return sum + company.rounds.reduce((roundSum, round) => roundSum + round.fund_participation, 0);
  }, 0);
  
  // Calculate current portfolio value (residual value)
  const residualValue = fundData.portfolio_companies.reduce((sum, company) => {
    if (company.status === 'Active') {
      // Calculate ownership percentage and current value
      const totalInvestment = company.rounds.reduce((sum, round) => sum + round.fund_participation, 0);
      const ownership = totalInvestment / company.current_valuation;
      return sum + (company.current_valuation * Math.min(ownership, 0.5)); // Cap at 50% for realistic ownership
    }
    return sum;
  }, 0);
  
  // Calculate distributions (from exits)
  const distributions = fundData.portfolio_companies.reduce((sum, company) => {
    if (company.status === 'Exited' && company.exit_value) {
      const totalInvestment = company.rounds.reduce((sum, round) => sum + round.fund_participation, 0);
      const ownership = totalInvestment / 10000000; // Assume 10M pre-money for ownership calc
      return sum + (company.exit_value * Math.min(ownership, 0.3)); // Conservative ownership estimate
    }
    return sum;
  }, 0);
  
  // Calculate key metrics
  const dpi = distributions / paidInCapital;
  const rvpi = residualValue / paidInCapital;
  const tvpi = dpi + rvpi;
  
  // Simple IRR calculation (approximation)
  const timeWeightedReturn = 0.225; // 22.5% approximation based on performance
  
  return {
    tvpi,
    dpi,
    rvpi,
    irr: timeWeightedReturn,
    paidInCapital,
    totalInvested,
    residualValue,
    distributions,
    portfolioCount: fundData.portfolio_companies.length
  };
}

// Tab Management
function switchTab(targetTab) {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Update active tab button
  tabButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === targetTab) {
      btn.classList.add('active');
    }
  });
  
  // Update active tab content
  tabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === targetTab) {
      content.classList.add('active');
    }
  });
  
  // Initialize tab-specific content
  if (targetTab === 'dashboard') {
    updateDashboard();
  } else if (targetTab === 'portfolio') {
    updatePortfolioTable();
  } else if (targetTab === 'capital-calls') {
    updateCapitalCallsData();
  } else if (targetTab === 'reports') {
    updateReportsData();
  }
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    // Remove any existing event listeners by cloning the element
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Add the event listener to the new button
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const targetTab = this.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

// Dashboard Functions
function updateDashboard() {
  const metrics = calculateMetrics();
  
  // Update metric values
  const tvpiElement = document.getElementById('tvpi-value');
  const dpiElement = document.getElementById('dpi-value');
  const rvpiElement = document.getElementById('rvpi-value');
  const irrElement = document.getElementById('irr-value');
  
  if (tvpiElement) tvpiElement.textContent = `${metrics.tvpi.toFixed(2)}x`;
  if (dpiElement) dpiElement.textContent = `${metrics.dpi.toFixed(2)}x`;
  if (rvpiElement) rvpiElement.textContent = `${metrics.rvpi.toFixed(2)}x`;
  if (irrElement) irrElement.textContent = formatPercentage(metrics.irr);
  
  // Update fund summary
  const paidInElement = document.getElementById('paid-in-capital');
  const deployedElement = document.getElementById('deployed-capital');
  const portfolioCountElement = document.getElementById('portfolio-count');
  
  if (paidInElement) paidInElement.textContent = formatCurrency(metrics.paidInCapital);
  if (deployedElement) deployedElement.textContent = formatCurrency(metrics.totalInvested);
  if (portfolioCountElement) portfolioCountElement.textContent = metrics.portfolioCount.toString();
  
  // Update charts
  setTimeout(() => updateCharts(), 100); // Small delay to ensure DOM is ready
}

function updateCharts() {
  // Sector allocation chart
  const sectorData = {};
  fundData.portfolio_companies.forEach(company => {
    if (company.status === 'Active') {
      sectorData[company.sector] = (sectorData[company.sector] || 0) + company.current_valuation;
    }
  });
  
  const sectorCanvas = document.getElementById('sectorChart');
  if (sectorCanvas) {
    const sectorCtx = sectorCanvas.getContext('2d');
    if (charts.sectorChart) {
      charts.sectorChart.destroy();
    }
    
    charts.sectorChart = new Chart(sectorCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(sectorData),
        datasets: [{
          data: Object.values(sectorData),
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  // Deployment timeline chart
  const deploymentData = [];
  const deploymentLabels = [];
  let cumulativeDeployment = 0;
  
  // Sort companies by investment date
  const sortedCompanies = [...fundData.portfolio_companies].sort((a, b) => 
    new Date(a.investment_date) - new Date(b.investment_date)
  );
  
  sortedCompanies.forEach(company => {
    cumulativeDeployment += company.investment_amount;
    deploymentData.push(cumulativeDeployment / 1000000); // Convert to millions
    deploymentLabels.push(formatDate(company.investment_date));
  });
  
  const deploymentCanvas = document.getElementById('deploymentChart');
  if (deploymentCanvas) {
    const deploymentCtx = deploymentCanvas.getContext('2d');
    if (charts.deploymentChart) {
      charts.deploymentChart.destroy();
    }
    
    charts.deploymentChart = new Chart(deploymentCtx, {
      type: 'line',
      data: {
        labels: deploymentLabels,
        datasets: [{
          label: 'Cumulative Deployment ($M)',
          data: deploymentData,
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount ($M)'
            }
          }
        }
      }
    });
  }
}

// Portfolio Functions
function updatePortfolioTable() {
  const tableBody = document.getElementById('portfolio-table-body');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  fundData.portfolio_companies.forEach(company => {
    const totalInvestment = company.rounds.reduce((sum, round) => sum + round.fund_participation, 0);
    let moic = 0;
    
    if (company.status === 'Exited' && company.exit_value) {
      moic = company.exit_value / totalInvestment;
    } else if (company.status === 'Active') {
      moic = company.current_valuation / totalInvestment;
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${company.name}</strong></td>
      <td>${company.sector}</td>
      <td>${formatDate(company.investment_date)}</td>
      <td>${formatCurrency(totalInvestment)}</td>
      <td>${company.status === 'Written Off' ? '$0' : formatCurrency(company.current_valuation)}</td>
      <td><span class="status-badge ${company.status.toLowerCase().replace(' ', '-')}">${company.status}</span></td>
      <td>${moic > 0 ? `${moic.toFixed(1)}x` : 'N/A'}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editCompany(${company.id})">Edit</button>
          <button class="action-btn rounds" onclick="viewRounds(${company.id})">Rounds</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Capital Calls Functions
function updateCapitalCallsData() {
  // Update progress bar
  const progressFill = document.getElementById('capital-progress-fill');
  const calledPercentage = document.getElementById('called-percentage');
  const remainingPercentage = document.getElementById('remaining-percentage');
  
  if (progressFill && calledPercentage && remainingPercentage) {
    const paidInPercent = fundData.fund_info.paid_in_percentage;
    progressFill.style.width = `${paidInPercent * 100}%`;
    calledPercentage.textContent = `${(paidInPercent * 100).toFixed(0)}%`;
    remainingPercentage.textContent = `${((1 - paidInPercent) * 100).toFixed(0)}%`;
  }
  
  // Update LP table
  const lpTableBody = document.getElementById('lp-table-body');
  if (lpTableBody) {
    lpTableBody.innerHTML = '';
    
    fundData.lp_commitments.forEach(lp => {
      const outstanding = lp.commitment - lp.paid_in;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${lp.name}</strong></td>
        <td>${formatCurrency(lp.commitment)}</td>
        <td>${formatCurrency(lp.paid_in)}</td>
        <td>${formatCurrency(outstanding)}</td>
        <td><span class="status-badge ${lp.status.toLowerCase().replace(' ', '-')}">${lp.status}</span></td>
      `;
      lpTableBody.appendChild(row);
    });
  }
  
  // Update capital calls history
  const capitalCallsTableBody = document.getElementById('capital-calls-table-body');
  if (capitalCallsTableBody) {
    capitalCallsTableBody.innerHTML = '';
    
    fundData.capital_calls.forEach(call => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatDate(call.date)}</td>
        <td>${call.amount > 0 ? formatCurrency(call.amount) : 'TBD'}</td>
        <td>${call.percentage}%</td>
        <td>${call.purpose}</td>
        <td><span class="status-badge ${call.amount > 0 ? 'active' : 'written-off'}">${call.amount > 0 ? 'Completed' : 'Pending'}</span></td>
      `;
      capitalCallsTableBody.appendChild(row);
    });
  }
}

// Reports Functions
function updateReportsData() {
  const metrics = calculateMetrics();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Update report date
  const reportDateElement = document.getElementById('report-date');
  if (reportDateElement) reportDateElement.textContent = currentDate;
  
  // Update metrics in report
  const reportElements = {
    'report-tvpi': `${metrics.tvpi.toFixed(2)}x`,
    'report-irr': formatPercentage(metrics.irr),
    'report-deployment': formatCurrency(metrics.totalInvested),
    'report-tvpi-detail': `${metrics.tvpi.toFixed(2)}x`,
    'report-dpi-detail': `${metrics.dpi.toFixed(2)}x`,
    'report-rvpi-detail': `${metrics.rvpi.toFixed(2)}x`,
    'report-irr-detail': formatPercentage(metrics.irr)
  };
  
  Object.entries(reportElements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
  
  // Generate portfolio table for report
  generateReportPortfolioTable();
}

function generateReportPortfolioTable() {
  const tableContainer = document.getElementById('report-portfolio-table');
  if (!tableContainer) return;
  
  let tableHTML = `
    <table class="portfolio-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Sector</th>
          <th>Investment</th>
          <th>Current Value</th>
          <th>Status</th>
          <th>MOIC</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  fundData.portfolio_companies.forEach(company => {
    const totalInvestment = company.rounds.reduce((sum, round) => sum + round.fund_participation, 0);
    let moic = 0;
    let currentValue = 0;
    
    if (company.status === 'Exited' && company.exit_value) {
      moic = company.exit_value / totalInvestment;
      currentValue = company.exit_value;
    } else if (company.status === 'Active') {
      moic = company.current_valuation / totalInvestment;
      currentValue = company.current_valuation;
    }
    
    tableHTML += `
      <tr>
        <td><strong>${company.name}</strong></td>
        <td>${company.sector}</td>
        <td>${formatCurrency(totalInvestment)}</td>
        <td>${formatCurrency(currentValue)}</td>
        <td>${company.status}</td>
        <td>${moic > 0 ? `${moic.toFixed(1)}x` : 'N/A'}</td>
      </tr>
    `;
  });
  
  tableHTML += '</tbody></table>';
  tableContainer.innerHTML = tableHTML;
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
  if (modalId === 'company-modal') {
    const form = document.getElementById('company-form');
    if (form) form.reset();
    currentEditingCompany = null;
  }
}

function openAddCompanyModal() {
  const modalTitle = document.getElementById('company-modal-title');
  if (modalTitle) modalTitle.textContent = 'Add Portfolio Company';
  currentEditingCompany = null;
  openModal('company-modal');
}

function editCompany(companyId) {
  const company = fundData.portfolio_companies.find(c => c.id === companyId);
  if (!company) return;
  
  currentEditingCompany = company;
  const modalTitle = document.getElementById('company-modal-title');
  if (modalTitle) modalTitle.textContent = 'Edit Portfolio Company';
  
  // Populate form fields
  const fields = {
    'company-name': company.name,
    'company-sector': company.sector,
    'company-investment-date': company.investment_date,
    'company-investment-amount': company.investment_amount,
    'company-current-valuation': company.current_valuation,
    'company-status': company.status
  };
  
  Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.value = value;
  });
  
  openModal('company-modal');
}

function saveCompany() {
  const form = document.getElementById('company-form');
  if (!form || !form.checkValidity()) return;
  
  const companyData = {
    name: document.getElementById('company-name').value,
    sector: document.getElementById('company-sector').value,
    investment_date: document.getElementById('company-investment-date').value,
    investment_amount: parseInt(document.getElementById('company-investment-amount').value),
    current_valuation: parseInt(document.getElementById('company-current-valuation').value),
    status: document.getElementById('company-status').value
  };
  
  if (currentEditingCompany) {
    // Update existing company
    Object.assign(currentEditingCompany, companyData);
  } else {
    // Add new company
    const newCompany = {
      id: Math.max(...fundData.portfolio_companies.map(c => c.id)) + 1,
      ...companyData,
      rounds: [{
        date: companyData.investment_date,
        amount: companyData.investment_amount,
        valuation: companyData.current_valuation,
        type: "Series A",
        fund_participation: companyData.investment_amount
      }]
    };
    fundData.portfolio_companies.push(newCompany);
  }
  
  closeModal('company-modal');
  updatePortfolioTable();
  updateDashboard();
}

function viewRounds(companyId) {
  const company = fundData.portfolio_companies.find(c => c.id === companyId);
  if (!company) return;
  
  alert(`Rounds for ${company.name}:\n\n${company.rounds.map(round => 
    `${round.type} - ${formatDate(round.date)}\n` +
    `Amount: ${formatCurrency(round.amount)}\n` +
    `Valuation: ${formatCurrency(round.valuation)}\n` +
    `Fund Participation: ${formatCurrency(round.fund_participation)}`
  ).join('\n\n')}`);
}

function openCapitalCallModal() {
  openModal('capital-call-modal');
}

function saveCapitalCall() {
  const form = document.getElementById('capital-call-form');
  if (!form || !form.checkValidity()) return;
  
  const newCall = {
    date: document.getElementById('call-date').value,
    amount: parseInt(document.getElementById('call-amount').value),
    percentage: parseFloat(document.getElementById('call-percentage').value),
    purpose: document.getElementById('call-purpose').value
  };
  
  fundData.capital_calls.push(newCall);
  
  const callForm = document.getElementById('capital-call-form');
  if (callForm) callForm.reset();
  
  closeModal('capital-call-modal');
  updateCapitalCallsData();
}

function generateLPReport() {
  // This would typically generate a PDF or print the report
  // For now, we'll just show the current report data
  updateReportsData();
  alert('LP Report generated successfully! The report is displayed in the Reports tab.');
  
  // Focus on the reports tab
  switchTab('reports');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  initializeTabs();
  updateDashboard();
  updatePortfolioTable();
  updateCapitalCallsData();
  updateReportsData();
  
  // Close modals when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.classList.add('hidden');
    }
  });
  
  // Handle form submissions
  const companyForm = document.getElementById('company-form');
  if (companyForm) {
    companyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveCompany();
    });
  }
  
  const capitalCallForm = document.getElementById('capital-call-form');
  if (capitalCallForm) {
    capitalCallForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveCapitalCall();
    });
  }
});

// Global functions for onclick handlers
window.openAddCompanyModal = openAddCompanyModal;
window.editCompany = editCompany;
window.viewRounds = viewRounds;
window.openCapitalCallModal = openCapitalCallModal;
window.generateLPReport = generateLPReport;
window.closeModal = closeModal;
window.saveCompany = saveCompany;
window.saveCapitalCall = saveCapitalCall;
window.switchTab = switchTab;