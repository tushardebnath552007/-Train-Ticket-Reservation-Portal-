/**
 * Client-Side JavaScript Integration & Asynchronous Controller
 * Author: Sub-Team D (Karthik Subramanian, Neha Deshmukh)
 * Project: Train Ticket Reservation & Dynamic Fleet Management System
 */

const API_BASE = (function() {
  if (window.location.origin.includes('3000') || window.location.origin.includes('run.app')) {
    return `${window.location.origin}/api/v1`;
  }
  // When running via VS Code Live Server:
  // If Live Server took port 5500, backend is on 8000; otherwise backend is on 5500
  if (window.location.port === '5500') {
    return 'http://localhost:8000/api/v1';
  }
  return 'http://localhost:5500/api/v1';
})();

// Global State
const RailState = {
  selectedTrain: null,
  selectedCoach: null,
  selectedSeats: [], // Array of { seat_id, seat_number, berth_type, fare }
  searchParams: {
    source: 'NDLS',
    destination: 'HWH',
    date: new Date().toISOString().split('T')[0]
  }
};

/**
 * Universal Fetch Helper with graceful error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Page 1: Route Search Portal Controller
 */
function initSearchPortal() {
  const form = document.getElementById('search-trains-form');
  const sourceSelect = document.getElementById('source-station');
  const destSelect = document.getElementById('dest-station');
  const dateInput = document.getElementById('travel-date');

  if (!form) return;

  // Set default travel date to today or tomorrow
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Load available stations
  fetchAPI('/stations')
    .then(stations => {
      if (sourceSelect && destSelect) {
        sourceSelect.innerHTML = '';
        destSelect.innerHTML = '';
        stations.forEach(st => {
          const opt1 = new Option(`${st.name} (${st.code})`, st.code);
          const opt2 = new Option(`${st.name} (${st.code})`, st.code);
          sourceSelect.add(opt1);
          destSelect.add(opt2);
        });
        sourceSelect.value = 'NDLS';
        destSelect.value = 'HWH';
      }
    })
    .catch(err => console.warn('Could not populate live stations:', err));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const source = sourceSelect ? sourceSelect.value : 'NDLS';
    const dest = destSelect ? destSelect.value : 'HWH';
    const date = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];

    if (source === dest) {
      alert('Source and destination stations cannot be the same!');
      return;
    }

    // Redirect to trains.html with query parameters
    window.location.href = `trains.html?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(dest)}&date=${encodeURIComponent(date)}`;
  });
}

/**
 * Page 2: Available Trains & Schedule Matrix Controller
 */
async function initTrainsMatrix() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('source') || 'NDLS';
  const dest = params.get('destination') || 'HWH';
  const date = params.get('date') || new Date().toISOString().split('T')[0];

  const resultsHeader = document.getElementById('results-route-header');
  const trainsContainer = document.getElementById('trains-container');
  const emptyState = document.getElementById('empty-state');

  if (resultsHeader) {
    resultsHeader.textContent = `${source} ➔ ${dest} | Date: ${date}`;
  }

  try {
    const response = await fetchAPI(`/trains?source=${source}&destination=${dest}&date=${date}`);
    const trains = response.trains || [];

    if (trains.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (trainsContainer) {
      trainsContainer.innerHTML = '';
      trains.forEach(tr => {
        const card = document.createElement('div');
        card.className = 'train-card';
        card.innerHTML = `
          <div class="train-header">
            <div>
              <span class="train-title">
                ${tr.train_name} <span style="color: var(--accent-gold); font-family: monospace;">#${tr.train_number}</span>
              </span>
              <span class="train-badge">${tr.train_type.replace('_', ' ')}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              Runs: <strong style="color: #fff;">${tr.runs_on}</strong>
            </div>
          </div>

          <div class="route-timeline">
            <div class="time-point">
              <div class="time-val">${tr.departure_time}</div>
              <div class="station-val">${tr.source_name} (${tr.source_code})</div>
            </div>
            <div class="duration-line">
              <span>⏱ ${tr.duration_hours} hrs</span>
              <div class="line-track"></div>
              <span>Fastest Direct</span>
            </div>
            <div class="time-point dest">
              <div class="time-val">${tr.arrival_time}</div>
              <div class="station-val">${tr.destination_name} (${tr.destination_code})</div>
            </div>
          </div>

          <div class="coach-grid">
            ${tr.coaches.map(c => `
              <div class="coach-tier-card" onclick="selectCoachAndProceed(${tr.train_id}, ${c.coach_id}, '${tr.train_name}', '${tr.train_number}', '${c.coach_code}', '${c.coach_type}', ${c.base_fare})">
                <div class="coach-tier-type">${c.coach_type} (${c.coach_code})</div>
                <div class="coach-fare">₹${c.base_fare}</div>
                <div class="seat-avail-tag">🟢 ${c.available_seats} Available</div>
              </div>
            `).join('')}
          </div>
        `;
        trainsContainer.appendChild(card);
      });
    }
  } catch (err) {
    if (trainsContainer) {
      trainsContainer.innerHTML = `<div style="color: var(--accent-rose); padding: 2rem;">Error loading trains: ${err.message}</div>`;
    }
  }
}

function selectCoachAndProceed(trainId, coachId, trainName, trainNumber, coachCode, coachType, baseFare) {
  const params = new URLSearchParams(window.location.search);
  const date = params.get('date') || new Date().toISOString().split('T')[0];

  const payload = {
    trainId,
    coachId,
    trainName,
    trainNumber,
    coachCode,
    coachType,
    baseFare,
    date
  };
  sessionStorage.setItem('active_booking_selection', JSON.stringify(payload));
  window.location.href = `seats.html?train_id=${trainId}&coach_id=${coachId}&date=${encodeURIComponent(date)}`;
}

/**
 * Page 3: Interactive Coach Grid & Seat Selector Controller
 */
async function initSeatsMatrix() {
  const params = new URLSearchParams(window.location.search);
  const trainId = params.get('train_id') || '1';
  const coachId = params.get('coach_id') || '1';
  const date = params.get('date') || '2026-10-15';

  const gridContainer = document.getElementById('seat-grid');
  const trainMeta = document.getElementById('seat-train-meta');
  const selectedCountEl = document.getElementById('selected-count');
  const totalPriceEl = document.getElementById('total-price');
  const proceedBtn = document.getElementById('proceed-to-checkout-btn');

  let selectedSeats = [];
  let baseFare = 1500;

  try {
    const data = await fetchAPI(`/trains/${trainId}/coaches/${coachId}/seats`);
    baseFare = data.base_fare;

    if (trainMeta) {
      trainMeta.textContent = `${data.train_name} (#${data.train_number}) - Coach ${data.coach_code} (${data.coach_type}) | Base Fare: ₹${baseFare}`;
    }

    if (gridContainer) {
      gridContainer.innerHTML = '';
      data.seats.forEach(seat => {
        const cell = document.createElement('div');
        cell.className = `seat-cell ${seat.is_booked ? 'booked' : ''}`;
        cell.innerHTML = `
          <span class="seat-number">${seat.seat_number}</span>
          <span class="seat-berth">${seat.berth_type}</span>
        `;

        if (!seat.is_booked) {
          cell.addEventListener('click', () => {
            const idx = selectedSeats.findIndex(s => s.seat_id === seat.seat_id);
            if (idx > -1) {
              selectedSeats.splice(idx, 1);
              cell.classList.remove('selected');
            } else {
              if (selectedSeats.length >= 6) {
                alert('Maximum 6 seats can be selected per booking session.');
                return;
              }
              selectedSeats.push({ ...seat, baseFare });
              cell.classList.add('selected');
            }

            // Update sidebar totals
            if (selectedCountEl) selectedCountEl.textContent = selectedSeats.length;
            if (totalPriceEl) totalPriceEl.textContent = `₹${selectedSeats.length * baseFare}`;
            if (proceedBtn) proceedBtn.disabled = selectedSeats.length === 0;
          });
        }

        gridContainer.appendChild(cell);
      });
    }

    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        if (selectedSeats.length === 0) return;
        sessionStorage.setItem('selected_seats', JSON.stringify(selectedSeats));
        window.location.href = `booking.html?train_id=${trainId}&coach_id=${coachId}&date=${encodeURIComponent(date)}`;
      });
    }

  } catch (err) {
    if (gridContainer) {
      gridContainer.innerHTML = `<div style="color: var(--accent-rose); padding: 2rem;">Failed to load coach layout: ${err.message}</div>`;
    }
  }
}

/**
 * Page 4: Passenger Details & Checkout Controller
 */
function initBookingCheckout() {
  const params = new URLSearchParams(window.location.search);
  const trainId = parseInt(params.get('train_id') || '1');
  const coachId = parseInt(params.get('coach_id') || '1');
  const journeyDate = params.get('date') || new Date().toISOString().split('T')[0];

  const rawSeats = sessionStorage.getItem('selected_seats');
  const seats = rawSeats ? JSON.parse(rawSeats) : [];

  const passengerContainer = document.getElementById('passengers-form-container');
  const summarySeatsCount = document.getElementById('summary-seats-count');
  const summaryBaseFare = document.getElementById('summary-base-fare');
  const summaryTotalFare = document.getElementById('summary-total-fare');
  const checkoutForm = document.getElementById('checkout-form');

  if (seats.length === 0) {
    alert('No seats selected! Redirecting to search...');
    window.location.href = 'index.html';
    return;
  }

  const baseFarePerSeat = seats[0].baseFare || 1500;
  const totalAmount = baseFarePerSeat * seats.length;

  if (summarySeatsCount) summarySeatsCount.textContent = seats.length;
  if (summaryBaseFare) summaryBaseFare.textContent = `₹${baseFarePerSeat}`;
  if (summaryTotalFare) summaryTotalFare.textContent = `₹${totalAmount}`;

  // Build inputs for each selected seat
  if (passengerContainer) {
    passengerContainer.innerHTML = '';
    seats.forEach((seat, idx) => {
      const pCard = document.createElement('div');
      pCard.className = 'passenger-card';
      pCard.style.cssText = 'background: var(--bg-card); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border: 1px solid var(--border-color);';
      pCard.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 0.5rem; color: var(--accent-gold);">
          Passenger ${idx + 1} (Allocated Seat #${seat.seat_number} - ${seat.berth_type})
        </div>
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
          <input type="text" class="form-control" name="p_name_${idx}" placeholder="Full Name" required />
          <input type="number" class="form-control" name="p_age_${idx}" placeholder="Age" min="1" max="120" required />
          <select class="form-control" name="p_gender_${idx}">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      `;
      passengerContainer.appendChild(pCard);
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Acquiring Exclusive Lock & Committing...';
      }

      const contactName = document.getElementById('contact-name').value;
      const contactEmail = document.getElementById('contact-email').value;
      const contactPhone = document.getElementById('contact-phone').value;

      const passengers = seats.map((seat, idx) => ({
        full_name: checkoutForm[`p_name_${idx}`].value,
        age: parseInt(checkoutForm[`p_age_${idx}`].value),
        gender: checkoutForm[`p_gender_${idx}`].value,
        berth_preference: seat.berth_type,
        seat_id: seat.seat_id
      }));

      const payload = {
        train_id: trainId,
        coach_id: coachId,
        journey_date: journeyDate,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        passengers
      };

      try {
        const result = await fetchAPI('/bookings', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        // Show ticket modal
        displayDigitalTicketModal(result.pnr, result.total_amount, seats.length);
        sessionStorage.removeItem('selected_seats');

      } catch (err) {
        alert(`Booking Transaction Failed: ${err.message}`);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Pay & Generate PNR';
        }
      }
    });
  }
}

function displayDigitalTicketModal(pnr, amount, seatCount) {
  const modal = document.createElement('div');
  modal.className = 'ticket-modal-overlay';
  modal.innerHTML = `
    <div class="digital-ticket-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <span class="system-badge"><span class="status-dot"></span> PNR CONFIRMED</span>
        <button onclick="window.location.href='dashboard.html'" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">&times;</button>
      </div>

      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Cryptographic Railway PNR</div>
        <div class="ticket-header-pnr">${pnr}</div>
        <div style="font-size: 0.85rem; color: var(--accent-emerald); font-weight: 600; margin-top: 0.25rem;">
          ✓ SQLite EXCLUSIVE Lock Verified • Zero Race Conditions
        </div>
      </div>

      <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">Allocated Seats:</span>
          <strong>${seatCount} Berth(s)</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Total Fare Paid:</span>
          <strong style="color: var(--accent-gold);">₹${amount}</strong>
        </div>
      </div>

      <div style="display: flex; gap: 1rem;">
        <a href="dashboard.html" class="btn-primary" style="flex: 1; text-align: center;">View in Dashboard</a>
        <button onclick="window.print()" class="btn-secondary" style="flex: 1;">Print Boarding Pass</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

/**
 * Page 5: Dashboard & Ticket Management Controller
 */
function initDashboard() {
  const emailInput = document.getElementById('search-user-email');
  const lookupBtn = document.getElementById('lookup-user-btn');
  const pnrInput = document.getElementById('lookup-pnr');
  const pnrBtn = document.getElementById('lookup-pnr-btn');
  const historyTbody = document.getElementById('bookings-tbody');

  async function loadUserHistory(email) {
    if (!email) return;
    try {
      const res = await fetchAPI(`/bookings/user/${encodeURIComponent(email)}`);
      renderBookings(res.history || []);
    } catch (err) {
      alert(`Could not fetch history: ${err.message}`);
    }
  }

  function renderBookings(bookings) {
    if (!historyTbody) return;
    historyTbody.innerHTML = '';
    if (bookings.length === 0) {
      historyTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No reservation records found for this query.</td></tr>`;
      return;
    }

    bookings.forEach(b => {
      const tr = document.createElement('tr');
      const isConfirmed = b.status === 'CONFIRMED';
      tr.innerHTML = `
        <td style="font-family: monospace; font-weight: bold; color: var(--accent-gold);">${b.pnr}</td>
        <td>${b.train_name} (#${b.train_number})</td>
        <td>${b.source_code} ➔ ${b.destination_code}</td>
        <td>${b.journey_date}</td>
        <td>₹${b.total_amount}</td>
        <td>
          <span class="system-badge" style="background: ${isConfirmed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${isConfirmed ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
            ${b.status}
          </span>
        </td>
        <td>
          ${isConfirmed ? `<button class="btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; border-color: var(--accent-rose); color: var(--accent-rose);" onclick="cancelTicketAction('${b.pnr}')">Cancel</button>` : `<span style="color: var(--text-muted); font-size: 0.8rem;">Refund Processed</span>`}
        </td>
      `;
      historyTbody.appendChild(tr);
    });
  }

  if (lookupBtn && emailInput) {
    lookupBtn.addEventListener('click', () => loadUserHistory(emailInput.value.trim()));
  }

  if (pnrBtn && pnrInput) {
    pnrBtn.addEventListener('click', async () => {
      const pnr = pnrInput.value.trim();
      if (!pnr) return;
      try {
        const booking = await fetchAPI(`/bookings/${pnr}`);
        renderBookings([booking]);
      } catch (err) {
        alert(err.message);
      }
    });
  }
}

async function cancelTicketAction(pnr) {
  if (!confirm(`Are you sure you want to cancel ticket PNR ${pnr}? An 85% refund will be credited and seats will be released immediately.`)) {
    return;
  }
  try {
    const res = await fetchAPI(`/bookings/${pnr}`, { method: 'DELETE' });
    alert(res.message);
    window.location.reload();
  } catch (err) {
    alert(`Cancellation error: ${err.message}`);
  }
}

/**
 * Bonus: Administrator Fleet Console Controller
 */
async function initAdminConsole() {
  const activeTrainsEl = document.getElementById('admin-active-trains');
  const occupancyEl = document.getElementById('admin-occupancy-rate');
  const revenueEl = document.getElementById('admin-total-revenue');
  const auditLogsContainer = document.getElementById('audit-logs-tbody');

  try {
    const metrics = await fetchAPI('/admin/metrics');
    if (activeTrainsEl) activeTrainsEl.textContent = metrics.active_trains;
    if (occupancyEl) occupancyEl.textContent = `${metrics.occupancy_rate_percent}%`;
    if (revenueEl) revenueEl.textContent = `₹${metrics.total_revenue.toLocaleString()}`;

    const logs = await fetchAPI('/admin/audit-logs?limit=15');
    if (auditLogsContainer) {
      auditLogsContainer.innerHTML = '';
      logs.forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-family: monospace;">#${log.log_id}</td>
          <td><strong style="color: var(--accent-blue);">${log.action_type}</strong></td>
          <td><span class="system-badge" style="font-size: 0.7rem;">${log.lock_mode}</span></td>
          <td>${log.execution_time_ms} ms</td>
          <td style="color: var(--text-muted); font-size: 0.8rem;">${log.details}</td>
          <td style="font-size: 0.75rem;">${new Date(log.created_at).toLocaleTimeString()}</td>
        `;
        auditLogsContainer.appendChild(tr);
      });
    }
  } catch (err) {
    console.error('Failed to load admin telemetry:', err);
  }
}

// Auto-route initializer on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/frontend/')) {
    initSearchPortal();
  } else if (path.endsWith('trains.html')) {
    initTrainsMatrix();
  } else if (path.endsWith('seats.html')) {
    initSeatsMatrix();
  } else if (path.endsWith('booking.html')) {
    initBookingCheckout();
  } else if (path.endsWith('dashboard.html')) {
    initDashboard();
  } else if (path.endsWith('admin.html')) {
    initAdminConsole();
  }
});
