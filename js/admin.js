/**
 * AURA LAB // COMMERCE & OPERATIONS BACK-OFFICE CONTROLLER
 * Powers: Sidebar active state routing, quick search filtering,
 * timeframe controls, export triggers, and simulated order actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  highlightActiveSidebarRoute();
  setupAdminSearch();
  setupTimeframeButtons();
});

// Highlight sidebar item matching current page
function highlightActiveSidebarRoute() {
  const currentPath = window.location.pathname.split('/').pop() || 'admin-dashboard.html';
  const navLinks = document.querySelectorAll('aside nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === 'admin.html' && href === 'admin-dashboard.html'))) {
      link.className = 'flex items-center gap-space-sm px-space-md py-2.5 transition-colors bg-primary text-on-primary font-medium rounded-lg shadow-sm';
      link.setAttribute('aria-current', 'page');
    } else {
      link.className = 'flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-sm text-body-sm';
      link.removeAttribute('aria-current');
    }
  });
}

// Table search filter for Orders, Products, and Customers
function setupAdminSearch() {
  const searchInput = document.getElementById('admin-quick-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

// Timeframe Segmented Control Toggles
function setupTimeframeButtons() {
  const buttons = document.querySelectorAll('.timeframe-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.className = 'timeframe-btn px-3.5 py-1.5 rounded-full font-label-uppercase text-label-uppercase text-on-surface-variant hover:text-on-surface transition-colors';
      });
      btn.className = 'timeframe-btn px-3.5 py-1.5 rounded-full font-label-uppercase text-label-uppercase bg-primary text-on-primary shadow-sm';
    });
  });
}

// Simulated Export Action
function exportAdminData(dataType) {
  const timestamp = new Date().toISOString().split('T')[0];
  alert(`Preparing encrypted telemetry export for: ${dataType.toUpperCase()}\nFile: aura_${dataType}_${timestamp}.csv\nDispatched to authenticated Zurich cloud node.`);
}

// Simulated Order Dispatch Action
function markOrderDispatched(orderId, btn) {
  if (confirm(`Confirm dispatch for order #${orderId}? Courier will be notified for immediate pickup.`)) {
    if (btn) {
      btn.innerHTML = `<span class="material-symbols-outlined text-[14px]">check</span> Dispatched`;
      btn.className = 'px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-label-numeric text-[11px] font-bold inline-flex items-center gap-1';
      btn.disabled = true;
    }
  }
}
