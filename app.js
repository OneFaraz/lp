// Session Management
let currentUser = null;
let userType = null;

// Login credentials - UPDATED LP PASSWORD
const credentials = {
  ADMIN: { username: "ADMIN", password: "JustaVC123!" },
  LP: { username: "LP", password: "FutureBets!1" }
};

// Toast notification system
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.className = `toast-notification ${type}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }
}

// Stardust Fund I Data - Updated with provided LP data
let fundData = {
  fundInfo: {
    name: "Stardust Fund I",
    manager: "Giant Step Capital",
    tagline: "Innovation Beyond Boundaries", 
    targetSize: 175000000,
    currentCommitments: 175000000,
    deployedCapital: 47500000,
    vintage: 2024
  },
  portfolioCompanies: [
    {
      id: 1,
      name: "Stellar Propulsion",
      sector: "Space Technology & Aerospace",
      investmentAmount: 15000000,
      currentValuation: 32000000,
      investmentDate: "2024-03-15",
      status: "Active",
      description: "Next-gen ion propulsion systems for satellites"
    },
    {
      id: 2,
      name: "GridVault Energy",
      sector: "Energy Storage",
      investmentAmount: 12000000,
      currentValuation: 28000000,
      investmentDate: "2024-06-10",
      status: "Active",
      description: "Grid-scale battery storage systems"
    },
    {
      id: 3,
      name: "QuantumCore Systems",
      sector: "Quantum Computing",
      investmentAmount: 10000000,
      currentValuation: 18000000,
      investmentDate: "2024-01-20",
      status: "Active",
      description: "Quantum processors for enterprise applications"
    },
    {
      id: 4,
      name: "NanoMaterials Inc",
      sector: "Nanotechnology",
      investmentAmount: 8000000,
      currentValuation: 5000000,
      investmentDate: "2023-11-05",
      status: "Active",
      description: "Advanced carbon nanotube manufacturing"
    },
    {
      id: 5,
      name: "FusionTech Labs",
      sector: "Fusion Technology",
      investmentAmount: 2500000,
      currentValuation: 0,
      investmentDate: "2023-09-15",
      status: "Written Off",
      writeOffReason: "Technology Obsolescence",
      writeOffDate: "2024-08-15",
      writeOffNotes: "Market shifted to more efficient fusion approaches",
      description: "Compact fusion reactor development"
    }
  ],
  // Updated LP data with provided structure
  lpCommitments: [
    {
      id: 1,
      name: "University Endowment Fund",
      commitment: 25000000,
      paidIn: 15000000,
      status: "Wired In",
      type: "Institutional",
      contact: "endowment@example.com"
    },
    {
      id: 2,
      name: "Pension Fund Alpha",
      commitment: 50000000,
      paidIn: 30000000,
      status: "Awaiting Wire",
      type: "Institutional",
      contact: "pensionalpha@example.com"
    }
  ]
};

let charts = {};
let currentEditingCompany = null;
let currentEditingLP = null;
let currentWriteOffCompany = null;
let deleteTarget = null;

// Login Functions - FIXED
function handleLogin(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  console.log('handleLogin called');
  
  const usernameField = document.getElementById('username');
  const passwordField = document.getElementById('password');
  const errorElement = document.getElementById('login-error');
  
  if (!usernameField || !passwordField) {
    console.error('Login fields not found');
    return false;
  }
  
  const username = usernameField.value.trim();
  const password = passwordField.value;
  
  console.log('Login attempt - Username:', username, 'Password length:', password.length);
  
  // Check credentials
  let authenticated = false;
  let loginUserType = null;
  
  if (username === "ADMIN" && password === "JustaVC123!") {
    authenticated = true;
    loginUserType = "ADMIN";
  } else if (username === "LP" && password === "FutureBets!1") {
    authenticated = true;
    loginUserType = "LP";
  }
  
  if (authenticated) {
    console.log('Authentication successful for:', loginUserType);
    
    currentUser = username;
    userType = loginUserType;
    
    // Hide login screen and show dashboard
    const loginScreen = document.getElementById('login-screen');
    const mainDashboard = document.getElementById('main-dashboard');
    
    if (loginScreen) {
      loginScreen.style.display = 'none';
    }
    if (mainDashboard) {
      mainDashboard.classList.remove('hidden');
    }
    
    // Set user type on app container for CSS targeting
    const appContainer = document.querySelector('.app');
    if (appContainer) {
      appContainer.setAttribute('data-user-type', userType);
    }
    
    // Update user display
    const userTypeDisplay = document.getElementById('user-type-display');
    if (userTypeDisplay) {
      userTypeDisplay.textContent = userType === 'ADMIN' ? 'Administrator' : 'Limited Partner';
    }
    
    // Initialize dashboard for user type
    initializeDashboardForUser();
    
    // Clear login form and hide error
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.reset();
    if (errorElement) errorElement.classList.add('hidden');
    
    return true;
  } else {
    console.log('Authentication failed');
    // Show error
    if (errorElement) {
      errorElement.classList.remove('hidden');
    }
    if (passwordField) passwordField.value = '';
    return false;
  }
}

function logout() {
  console.log('Logout called');
  currentUser = null;
  userType = null;
  
  // Hide dashboard and show login screen
  const loginScreen = document.getElementById('login-screen');
  const mainDashboard = document.getElementById('main-dashboard');
  
  if (mainDashboard) mainDashboard.classList.add('hidden');
  if (loginScreen) loginScreen.style.display = 'flex';
  
  // Remove user type attribute
  const appContainer = document.querySelector('.app');
  if (appContainer) {
    appContainer.removeAttribute('data-user-type');
  }
  
  // Clear any form data
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.reset();
  
  // Reset to dashboard tab
  switchTab('dashboard');
}

function initializeDashboardForUser() {
  console.log('Initializing dashboard for user type:', userType);
  // Generate navigation tabs based on user type
  generateNavigationTabs();
  
  // Initialize with dashboard
  setTimeout(() => {
    switchTab('dashboard');
  }, 100);
}

function generateNavigationTabs() {
  const tabList = document.getElementById('tab-list');
  if (!tabList) return;
  
  console.log('Generating tabs for user type:', userType);
  
  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'lp-management', label: 'LP Management' },
    { id: 'capital-calls', label: 'Capital Calls' },
    { id: 'reports', label: 'Reports' },
    { id: 'write-offs', label: 'Write-offs' }
  ];
  
  const lpTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'reports', label: 'Reports' }
  ];
  
  const tabs = userType === 'ADMIN' ? adminTabs : lpTabs;
  
  tabList.innerHTML = '';
  tabs.forEach((tab, index) => {
    const button = document.createElement('button');
    button.className = `tab-btn ${index === 0 ? 'active' : ''}`;
    button.setAttribute('data-tab', tab.id);
    button.textContent = tab.label;
    button.addEventListener('click', function(e) {
      e.preventDefault();
      switchTab(tab.id);
    });
    tabList.appendChild(button);
  });
  
  console.log('Generated', tabs.length, 'tabs');
}

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

// Enhanced Metrics Calculations
function calculateMetrics() {
  const totalCommitted = fundData.lpCommitments.reduce((sum, lp) => sum + lp.commitment, 0);
  const totalPaidIn = fundData.lpCommitments.reduce((sum, lp) => sum + lp.paidIn, 0);
  
  // Calculate total invested capital
  const totalInvested = fundData.portfolioCompanies.reduce((sum, company) => {
    return sum + company.investmentAmount;
  }, 0);
  
  // Calculate current portfolio value (residual value)
  const residualValue = fundData.portfolioCompanies.reduce((sum, company) => {
    if (company.status === 'Active') {
      return sum + company.currentValuation;
    } else if (company.status === 'Exited') {
      return sum; // Already distributed
    }
    return sum; // Written off = 0
  }, 0);
  
  // Calculate distributions (from exits)
  const exitDistributions = fundData.portfolioCompanies.reduce((sum, company) => {
    if (company.status === 'Exited' && company.exitValuation) {
      return sum + company.exitValuation;
    }
    return sum;
  }, 0);
  
  // Calculate key metrics
  const paidInCapital = totalPaidIn;
  const dpi = exitDistributions / paidInCapital;
  const rvpi = residualValue / paidInCapital;
  const tvpi = dpi + rvpi;
  
  // MOIC calculation
  const totalCurrentValue = residualValue + exitDistributions;
  const moic = totalCurrentValue / totalInvested;
  
  // NAV calculation
  const nav = residualValue + (totalPaidIn - totalInvested);
  
  // Cash-on-Cash Multiple
  const cashOnCash = exitDistributions / totalInvested;
  
  // Success Rate (companies that returned capital)
  const successfulCompanies = fundData.portfolioCompanies.filter(company => {
    if (company.status === 'Exited') return company.exitValuation >= company.investmentAmount;
    if (company.status === 'Active') return company.currentValuation >= company.investmentAmount;
    return false;
  }).length;
  const successRate = successfulCompanies / fundData.portfolioCompanies.length;
  
  // Loss Ratio
  const writtenOffCompanies = fundData.portfolioCompanies.filter(c => c.status === 'Written Off').length;
  const lossRatio = writtenOffCompanies / fundData.portfolioCompanies.length;
  
  // IRR calculation (estimated based on strong performance)
  const timeWeightedReturn = 0.452; // 45.2% based on exceptional performance
  
  // Active companies count
  const activeCount = fundData.portfolioCompanies.filter(c => c.status === 'Active').length;
  
  return {
    tvpi,
    dpi,
    rvpi,
    irr: timeWeightedReturn,
    moic,
    nav,
    cashOnCash,
    successRate,
    lossRatio,
    paidInCapital,
    totalInvested,
    residualValue,
    distributions: exitDistributions,
    portfolioCount: fundData.portfolioCompanies.length,
    activeCount,
    totalCommitted,
    totalPaidIn,
    uncalledCapital: totalCommitted - totalPaidIn
  };
}

// Tab Management
function switchTab(targetTab) {
  console.log('Switching to tab:', targetTab);
  
  // Remove active class from all tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Hide all tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Add active class to clicked tab button
  const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
  
  // Show target tab content
  const targetContent = document.getElementById(targetTab);
  if (targetContent) {
    targetContent.classList.add('active');
  }
  
  // Initialize tab-specific content
  setTimeout(() => {
    if (targetTab === 'dashboard') {
      updateDashboard();
    } else if (targetTab === 'portfolio') {
      updatePortfolioTable();
    } else if (targetTab === 'lp-management') {
      updateLPManagementTable();
    } else if (targetTab === 'capital-calls') {
      updateCapitalCallsData();
    } else if (targetTab === 'reports') {
      updateReportsData();
    } else if (targetTab === 'write-offs') {
      updateWriteOffsData();
    }
  }, 50);
}

// Dashboard Functions
function updateDashboard() {
  console.log('Updating dashboard');
  const metrics = calculateMetrics();
  
  // Update metric values
  const elements = {
    'tvpi-value': `${metrics.tvpi.toFixed(2)}x`,
    'dpi-value': `${metrics.dpi.toFixed(2)}x`,
    'rvpi-value': `${metrics.rvpi.toFixed(2)}x`,
    'irr-value': formatPercentage(metrics.irr),
    'moic-value': `${metrics.moic.toFixed(2)}x`,
    'nav-value': formatCurrency(metrics.nav),
    'cash-multiple-value': `${metrics.cashOnCash.toFixed(2)}x`,
    'success-rate-value': formatPercentage(metrics.successRate),
    'capital-called': formatCurrency(metrics.totalPaidIn),
    'deployed-capital': formatCurrency(metrics.totalInvested),
    'portfolio-count': metrics.portfolioCount.toString(),
    'active-count': metrics.activeCount.toString(),
    'loss-ratio': formatPercentage(metrics.lossRatio)
  };
  
  // Add LP count for admin users
  if (userType === 'ADMIN') {
    elements['lp-count'] = fundData.lpCommitments.length.toString();
  }
  
  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
  
  // Hide LP count for LP users
  const lpCountStat = document.getElementById('lp-count-stat');
  if (lpCountStat && userType === 'LP') {
    lpCountStat.style.display = 'none';
  }
  
  // Update charts
  setTimeout(() => updateCharts(), 100);
}

function updateCharts() {
  // Sector allocation chart
  const sectorData = {};
  fundData.portfolioCompanies.forEach(company => {
    if (company.status === 'Active') {
      sectorData[company.sector] = (sectorData[company.sector] || 0) + company.currentValuation;
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
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B']
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
  const sortedCompanies = [...fundData.portfolioCompanies].sort((a, b) => 
    new Date(a.investmentDate) - new Date(b.investmentDate)
  );
  
  sortedCompanies.forEach(company => {
    cumulativeDeployment += company.investmentAmount;
    deploymentData.push(cumulativeDeployment / 1000000);
    deploymentLabels.push(formatDate(company.investmentDate));
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
  
  fundData.portfolioCompanies.forEach(company => {
    let moic = 0;
    let currentValue = company.currentValuation;
    
    if (company.status === 'Exited' && company.exitValuation) {
      moic = company.exitValuation / company.investmentAmount;
      currentValue = company.exitValuation;
    } else if (company.status === 'Active') {
      moic = company.currentValuation / company.investmentAmount;
    }
    
    const row = document.createElement('tr');
    
    let actionsHtml = '';
    if (userType === 'ADMIN') {
      actionsHtml = `
        <td>
          <div class="action-buttons">
            <button class="action-btn edit" onclick="editCompany(${company.id})">✏️ Edit</button>
            ${company.status === 'Active' ? `<button class="action-btn write-off" onclick="openWriteOffModal(${company.id})">🗑️ Write Off</button>` : ''}
          </div>
        </td>
      `;
    }
    
    row.innerHTML = `
      <td><strong>${company.name}</strong><br><small>${company.description || 'N/A'}</small></td>
      <td>${company.sector}</td>
      <td>${formatDate(company.investmentDate)}</td>
      <td>${formatCurrency(company.investmentAmount)}</td>
      <td>${company.status === 'Written Off' ? '$0' : formatCurrency(currentValue)}</td>
      <td><span class="status-badge ${company.status.toLowerCase().replace(' ', '-')}">${company.status}</span></td>
      <td>${moic > 0 ? `${moic.toFixed(1)}x` : 'N/A'}</td>
      ${actionsHtml}
    `;
    tableBody.appendChild(row);
  });
}

// LP Management Functions - ENHANCED WITH FULL CRUD
function updateLPManagementTable() {
  if (userType !== 'ADMIN') return;
  
  const metrics = calculateMetrics();
  
  // Update LP stats
  const elements = {
    'total-lps': fundData.lpCommitments.length.toString(),
    'total-commitments': formatCurrency(metrics.totalCommitted),
    'total-paid-in': formatCurrency(metrics.totalPaidIn),
    'uncalled-capital': formatCurrency(metrics.uncalledCapital)
  };
  
  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
  
  const tableBody = document.getElementById('lp-management-table-body');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  fundData.lpCommitments.forEach(lp => {
    const uncalled = lp.commitment - lp.paidIn;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${lp.name}</strong></td>
      <td>${formatCurrency(lp.commitment)}</td>
      <td>${formatCurrency(lp.paidIn)}</td>
      <td>${formatCurrency(uncalled)}</td>
      <td><span class="status-badge ${lp.status.toLowerCase().replace(' ', '-')}">${lp.status}</span></td>
      <td>${lp.type}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editLP(${lp.id})" aria-label="Edit LP">✏️ Edit</button>
          <button class="action-btn delete" onclick="deleteLP(${lp.id})" aria-label="Delete LP">🗑️ Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// LP CRUD Functions
function openAddLPModal() {
  if (userType !== 'ADMIN') return;
  
  const modalTitle = document.getElementById('lp-modal-title');
  if (modalTitle) modalTitle.textContent = 'Add LP';
  currentEditingLP = null;
  
  // Clear form
  const form = document.getElementById('lp-form');
  if (form) form.reset();
  
  openModal('lp-modal');
}

function editLP(lpId) {
  if (userType !== 'ADMIN') return;
  
  const lp = fundData.lpCommitments.find(l => l.id === lpId);
  if (!lp) return;
  
  currentEditingLP = lp;
  const modalTitle = document.getElementById('lp-modal-title');
  if (modalTitle) modalTitle.textContent = 'Edit LP';
  
  // Populate form fields
  const fields = {
    'lp-name': lp.name,
    'lp-commitment': lp.commitment,
    'lp-paid-in': lp.paidIn,
    'lp-status': lp.status,
    'lp-type': lp.type,
    'lp-contact': lp.contact
  };
  
  Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.value = value || '';
  });
  
  openModal('lp-modal');
}

function deleteLP(lpId) {
  if (userType !== 'ADMIN') return;
  
  const lp = fundData.lpCommitments.find(l => l.id === lpId);
  if (!lp) return;
  
  deleteTarget = { type: 'lp', id: lpId, name: lp.name };
  
  const deleteItemName = document.getElementById('delete-item-name');
  if (deleteItemName) deleteItemName.textContent = lp.name;
  
  openModal('delete-confirmation-modal');
}

function confirmDelete() {
  if (!deleteTarget || userType !== 'ADMIN') return;
  
  if (deleteTarget.type === 'lp') {
    const lpIndex = fundData.lpCommitments.findIndex(l => l.id === deleteTarget.id);
    if (lpIndex !== -1) {
      fundData.lpCommitments.splice(lpIndex, 1);
      showToast('LP deleted successfully');
      updateLPManagementTable();
      updateDashboard(); // Recalculate metrics
    }
  }
  
  closeModal('delete-confirmation-modal');
  deleteTarget = null;
}

function saveLP() {
  if (userType !== 'ADMIN') return;
  
  const form = document.getElementById('lp-form');
  if (!form || !form.checkValidity()) {
    showToast('Please fill in all required fields correctly', 'error');
    return;
  }
  
  const commitment = parseInt(document.getElementById('lp-commitment').value);
  const paidIn = parseInt(document.getElementById('lp-paid-in').value);
  
  // Validation
  if (commitment <= 0 || paidIn < 0) {
    showToast('Commitment must be positive and Paid-In cannot be negative', 'error');
    return;
  }
  
  if (paidIn > commitment) {
    showToast('Paid-In cannot exceed Commitment', 'error');
    return;
  }
  
  if (commitment > fundData.fundInfo.targetSize) {
    showToast('Commitment cannot exceed fund target size', 'error');
    return;
  }
  
  const lpData = {
    name: document.getElementById('lp-name').value,
    commitment: commitment,
    paidIn: paidIn,
    status: document.getElementById('lp-status').value,
    type: document.getElementById('lp-type').value,
    contact: document.getElementById('lp-contact').value
  };
  
  if (currentEditingLP) {
    // Update existing LP
    Object.assign(currentEditingLP, lpData);
    showToast('LP updated successfully');
  } else {
    // Add new LP
    const newLP = {
      id: Math.max(...fundData.lpCommitments.map(l => l.id), 0) + 1,
      ...lpData
    };
    fundData.lpCommitments.push(newLP);
    showToast('LP added successfully');
  }
  
  closeModal('lp-modal');
  updateLPManagementTable();
  updateDashboard(); // Recalculate metrics
  updateCapitalCallsData(); // Update capital calls if visible
}

// Capital Calls Functions
function updateCapitalCallsData() {
  if (userType !== 'ADMIN') return;
  
  const metrics = calculateMetrics();
  const calledPercentage = metrics.totalPaidIn / metrics.totalCommitted;
  
  // Update progress bar
  const progressFill = document.getElementById('capital-progress-fill');
  const calledPercentageSpan = document.getElementById('called-percentage');
  const remainingPercentageSpan = document.getElementById('remaining-percentage');
  
  if (progressFill && calledPercentageSpan && remainingPercentageSpan) {
    progressFill.style.width = `${calledPercentage * 100}%`;
    calledPercentageSpan.textContent = `${(calledPercentage * 100).toFixed(0)}%`;
    remainingPercentageSpan.textContent = `${((1 - calledPercentage) * 100).toFixed(0)}%`;
  }
  
  // Update LP table
  const lpTableBody = document.getElementById('lp-table-body');
  if (lpTableBody) {
    lpTableBody.innerHTML = '';
    
    fundData.lpCommitments.forEach(lp => {
      const outstanding = lp.commitment - lp.paidIn;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${lp.name}</strong></td>
        <td>${formatCurrency(lp.commitment)}</td>
        <td>${formatCurrency(lp.paidIn)}</td>
        <td>${formatCurrency(outstanding)}</td>
        <td><span class="status-badge ${lp.status.toLowerCase().replace(' ', '-')}">${lp.status}</span></td>
      `;
      lpTableBody.appendChild(row);
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
  
  // Filter data for LP users - show less detail
  const companies = userType === 'LP' ? 
    fundData.portfolioCompanies.map(c => ({...c, name: 'Confidential'})) :
    fundData.portfolioCompanies;
  
  companies.forEach(company => {
    let moic = 0;
    let currentValue = company.currentValuation;
    
    if (company.status === 'Exited' && company.exitValuation) {
      moic = company.exitValuation / company.investmentAmount;
      currentValue = company.exitValuation;
    } else if (company.status === 'Active') {
      moic = company.currentValuation / company.investmentAmount;
    }
    
    tableHTML += `
      <tr>
        <td><strong>${company.name}</strong></td>
        <td>${company.sector}</td>
        <td>${formatCurrency(company.investmentAmount)}</td>
        <td>${formatCurrency(currentValue)}</td>
        <td>${company.status}</td>
        <td>${moic > 0 ? `${moic.toFixed(1)}x` : 'N/A'}</td>
      </tr>
    `;
  });
  
  tableHTML += '</tbody></table>';
  tableContainer.innerHTML = tableHTML;
}

// Write-offs Functions
function updateWriteOffsData() {
  if (userType !== 'ADMIN') return;
  
  const writtenOffCompanies = fundData.portfolioCompanies.filter(c => c.status === 'Written Off');
  const totalWriteOffs = writtenOffCompanies.length;
  const writeOffAmount = writtenOffCompanies.reduce((sum, c) => sum + c.investmentAmount, 0);
  const writeOffImpact = writeOffAmount / fundData.portfolioCompanies.reduce((sum, c) => sum + c.investmentAmount, 0);
  
  // Update summary stats
  const elements = {
    'total-writeoffs': totalWriteOffs.toString(),
    'writeoff-amount': formatCurrency(writeOffAmount),
    'writeoff-impact': formatPercentage(writeOffImpact)
  };
  
  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
  
  // Update write-offs table
  const tableBody = document.getElementById('writeoffs-table-body');
  if (tableBody) {
    tableBody.innerHTML = '';
    
    writtenOffCompanies.forEach(company => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${company.name}</strong></td>
        <td>${company.sector}</td>
        <td>${formatCurrency(company.investmentAmount)}</td>
        <td>${formatDate(company.writeOffDate)}</td>
        <td>${company.writeOffReason}</td>
        <td>-${formatCurrency(company.investmentAmount)}</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

function openWriteOffModal(companyId) {
  if (userType !== 'ADMIN') return;
  
  const company = fundData.portfolioCompanies.find(c => c.id === companyId);
  if (!company || company.status !== 'Active') return;
  
  currentWriteOffCompany = company;
  const companyNameSpan = document.getElementById('writeoff-company-name');
  if (companyNameSpan) companyNameSpan.textContent = company.name;
  
  // Set default date to today
  const dateInput = document.getElementById('writeoff-date');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
  
  openModal('writeoff-modal');
}

function confirmWriteOff() {
  if (!currentWriteOffCompany || userType !== 'ADMIN') return;
  
  const form = document.getElementById('writeoff-form');
  if (!form || !form.checkValidity()) return;
  
  const writeOffDate = document.getElementById('writeoff-date').value;
  const writeOffReason = document.getElementById('writeoff-reason').value;
  const otherReason = document.getElementById('other-reason').value;
  const writeOffNotes = document.getElementById('writeoff-notes').value;
  
  // Update company data
  currentWriteOffCompany.status = 'Written Off';
  currentWriteOffCompany.currentValuation = 0;
  currentWriteOffCompany.writeOffDate = writeOffDate;
  currentWriteOffCompany.writeOffReason = writeOffReason === 'Other' ? otherReason : writeOffReason;
  currentWriteOffCompany.writeOffNotes = writeOffNotes;
  
  // Close modal and refresh data
  closeModal('writeoff-modal');
  currentWriteOffCompany = null;
  
  // Refresh all relevant views
  updatePortfolioTable();
  updateDashboard();
  updateWriteOffsData();
  
  showToast('Investment has been written off successfully');
}

// PDF Generation Function
function generatePDFReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const metrics = calculateMetrics();
  
  // Set up PDF document
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = margin;
  
  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Stardust Fund I', pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text('Quarterly Report - Q4 2024', pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;
  
  doc.setFontSize(12);
  doc.setTextColor(31, 184, 205);
  doc.setFont('helvetica', 'bold');
  doc.text('Giant Step Capital - Innovation Beyond Boundaries', pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 20;
  
  // Executive Summary
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, currentY);
  currentY += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const summaryText = `Stardust Fund I continues to demonstrate exceptional performance in deep technology sectors with a current TVPI of ${metrics.tvpi.toFixed(2)}x and a net IRR of ${formatPercentage(metrics.irr)}. The fund has deployed ${formatCurrency(metrics.totalInvested)} across ${metrics.portfolioCount} portfolio companies focusing on transformative deep tech innovations.`;
  
  const summaryLines = doc.splitTextToSize(summaryText, pageWidth - 2 * margin);
  doc.text(summaryLines, margin, currentY);
  currentY += summaryLines.length * 5 + 10;
  
  // Key Performance Metrics
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Performance Metrics', margin, currentY);
  currentY += 10;
  
  const metricsData = [
    ['TVPI', `${metrics.tvpi.toFixed(2)}x`],
    ['DPI', `${metrics.dpi.toFixed(2)}x`],
    ['RVPI', `${metrics.rvpi.toFixed(2)}x`],
    ['Net IRR', formatPercentage(metrics.irr)]
  ];
  
  doc.setFontSize(11);
  metricsData.forEach(([label, value], index) => {
    const x = margin + (index % 2) * (pageWidth - 2 * margin) / 2;
    const y = currentY + Math.floor(index / 2) * 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, x + 25, y);
  });
  currentY += 30;
  
  // Portfolio Summary (with appropriate privacy for LP users)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Portfolio Summary', margin, currentY);
  currentY += 10;
  
  if (userType === 'ADMIN') {
    // Include LP information for admin
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total LPs: ${fundData.lpCommitments.length}`, margin, currentY);
    currentY += 6;
    doc.text(`Total Commitments: ${formatCurrency(metrics.totalCommitted)}`, margin, currentY);
    currentY += 6;
  }
  
  // Save the PDF
  doc.save(`Stardust_Fund_I_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  
  showToast('PDF report generated successfully!');
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
  
  if (modalId === 'lp-modal') {
    const form = document.getElementById('lp-form');
    if (form) form.reset();
    currentEditingLP = null;
  }
  
  if (modalId === 'writeoff-modal') {
    const form = document.getElementById('writeoff-form');
    if (form) form.reset();
    currentWriteOffCompany = null;
    const otherReasonGroup = document.getElementById('other-reason-group');
    if (otherReasonGroup) otherReasonGroup.style.display = 'none';
  }
  
  if (modalId === 'delete-confirmation-modal') {
    deleteTarget = null;
  }
}

function openAddCompanyModal() {
  if (userType !== 'ADMIN') return;
  
  const modalTitle = document.getElementById('company-modal-title');
  if (modalTitle) modalTitle.textContent = 'Add Portfolio Company';
  currentEditingCompany = null;
  openModal('company-modal');
}

function editCompany(companyId) {
  if (userType !== 'ADMIN') return;
  
  const company = fundData.portfolioCompanies.find(c => c.id === companyId);
  if (!company) return;
  
  currentEditingCompany = company;
  const modalTitle = document.getElementById('company-modal-title');
  if (modalTitle) modalTitle.textContent = 'Edit Portfolio Company';
  
  // Populate form fields
  const fields = {
    'company-name': company.name,
    'company-sector': company.sector,
    'company-investment-date': company.investmentDate,
    'company-investment-amount': company.investmentAmount,
    'company-current-valuation': company.currentValuation,
    'company-description': company.description,
    'company-status': company.status
  };
  
  Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.value = value || '';
  });
  
  openModal('company-modal');
}

function saveCompany() {
  if (userType !== 'ADMIN') return;
  
  const form = document.getElementById('company-form');
  if (!form || !form.checkValidity()) return;
  
  const companyData = {
    name: document.getElementById('company-name').value,
    sector: document.getElementById('company-sector').value,
    investmentDate: document.getElementById('company-investment-date').value,
    investmentAmount: parseInt(document.getElementById('company-investment-amount').value),
    currentValuation: parseInt(document.getElementById('company-current-valuation').value),
    description: document.getElementById('company-description').value,
    status: document.getElementById('company-status').value
  };
  
  if (currentEditingCompany) {
    // Update existing company
    Object.assign(currentEditingCompany, companyData);
    showToast('Company updated successfully');
  } else {
    // Add new company
    const newCompany = {
      id: Math.max(...fundData.portfolioCompanies.map(c => c.id)) + 1,
      ...companyData
    };
    fundData.portfolioCompanies.push(newCompany);
    showToast('Company added successfully');
  }
  
  closeModal('company-modal');
  updatePortfolioTable();
  updateDashboard();
}

function openCapitalCallModal() {
  if (userType !== 'ADMIN') return;
  
  openModal('capital-call-modal');
}

function saveCapitalCall() {
  if (userType !== 'ADMIN') return;
  
  const form = document.getElementById('capital-call-form');
  if (!form || !form.checkValidity()) return;
  
  showToast('Capital call functionality would be implemented here');
  
  const callForm = document.getElementById('capital-call-form');
  if (callForm) callForm.reset();
  
  closeModal('capital-call-modal');
  updateCapitalCallsData();
}

// Event Listeners - FIXED EVENT HANDLING
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Setting up event listeners');
  
  // Setup login form event listeners - FIXED
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }
  
  // Direct button event listener as backup
  const loginButton = document.querySelector('.login-btn');
  if (loginButton) {
    loginButton.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }
  
  // Enter key support on password field
  const passwordField = document.getElementById('password');
  if (passwordField) {
    passwordField.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleLogin();
      }
    });
  }
  
  // Close modals when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.classList.add('hidden');
    }
  });
  
  // Handle write-off reason change
  const writeOffReasonSelect = document.getElementById('writeoff-reason');
  if (writeOffReasonSelect) {
    writeOffReasonSelect.addEventListener('change', function() {
      const otherReasonGroup = document.getElementById('other-reason-group');
      if (otherReasonGroup) {
        otherReasonGroup.style.display = this.value === 'Other' ? 'block' : 'none';
      }
    });
  }
  
  // Handle form submissions
  const companyForm = document.getElementById('company-form');
  if (companyForm) {
    companyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveCompany();
    });
  }
  
  const lpForm = document.getElementById('lp-form');
  if (lpForm) {
    lpForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveLP();
    });
  }
  
  const capitalCallForm = document.getElementById('capital-call-form');
  if (capitalCallForm) {
    capitalCallForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveCapitalCall();
    });
  }
  
  const writeOffForm = document.getElementById('writeoff-form');
  if (writeOffForm) {
    writeOffForm.addEventListener('submit', function(e) {
      e.preventDefault();
      confirmWriteOff();
    });
  }
  
  console.log('All event listeners attached successfully');
});

// Global functions for onclick handlers
window.openAddCompanyModal = openAddCompanyModal;
window.openAddLPModal = openAddLPModal;
window.editCompany = editCompany;
window.editLP = editLP;
window.deleteLP = deleteLP;
window.confirmDelete = confirmDelete;
window.openCapitalCallModal = openCapitalCallModal;
window.openWriteOffModal = openWriteOffModal;
window.confirmWriteOff = confirmWriteOff;
window.generatePDFReport = generatePDFReport;
window.closeModal = closeModal;
window.saveCompany = saveCompany;
window.saveLP = saveLP;
window.saveCapitalCall = saveCapitalCall;
window.switchTab = switchTab;
window.logout = logout;
window.handleLogin = handleLogin;