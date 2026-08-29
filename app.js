const modal = document.querySelector('#calculator-modal');
const content = document.querySelector('#calculator-content');
const rupees = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, value));

const templates = {
  budget: () => `<section class="calculator"><h2>Monthly Budget Planner</h2><p class="intro">Find your monthly balance and a simple saving target.</p><form class="calc-form" data-calculator="budget"><div class="field"><label>Monthly take-home income (&#8377;)</label><input required type="number" name="income" min="0" placeholder="50000" /></div><div class="field"><label>Rent / housing (&#8377;)</label><input required type="number" name="housing" min="0" placeholder="15000" /></div><div class="field"><label>Food & groceries (&#8377;)</label><input required type="number" name="food" min="0" placeholder="7000" /></div><div class="field"><label>Commute (&#8377;)</label><input required type="number" name="commute" min="0" placeholder="3000" /></div><div class="field"><label>EMIs & bills (&#8377;)</label><input required type="number" name="bills" min="0" placeholder="8000" /></div><div class="field"><label>Other spending (&#8377;)</label><input required type="number" name="other" min="0" placeholder="5000" /></div><button class="calculate">See my monthly picture</button></form><div class="result"></div></section>`,
  commute: () => `<section class="calculator"><h2>Commute Cost Calculator</h2><p class="intro">See the true monthly cost of your daily journey.</p><form class="calc-form" data-calculator="commute"><div class="field"><label>One-way distance (km)</label><input required type="number" name="distance" min="0" step="0.1" placeholder="12" /></div><div class="field"><label>Working days each month</label><input required type="number" name="days" min="1" max="31" placeholder="22" /></div><div class="field full"><label>How do you commute?</label><select name="mode"><option value="bike">Bike / scooter</option><option value="car">Car</option><option value="metro">Metro</option><option value="bus">Bus</option><option value="cab">Cab / auto</option></select></div><div class="field full"><label>Cost per km (&#8377;) &mdash; edit this if you know it</label><input required type="number" name="rate" min="0" step="0.1" value="2.5" /></div><button class="calculate">Calculate my commute cost</button></form><div class="result"></div></section>`,
  emi: () => `<section class="calculator"><h2>EMI & Loan Calculator</h2><p class="intro">Understand your monthly EMI and the complete cost of borrowing.</p><form class="calc-form" data-calculator="emi"><div class="field"><label>Loan amount (&#8377;)</label><input required type="number" name="principal" min="1" placeholder="500000" /></div><div class="field"><label>Annual interest rate (%)</label><input required type="number" name="rate" min="0" step="0.1" placeholder="10.5" /></div><div class="field full"><label>Loan period (years)</label><input required type="number" name="years" min="1" step="1" placeholder="5" /></div><button class="calculate">Calculate my EMI</button></form><div class="result"></div></section>`
};

document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => { content.innerHTML = templates[button.dataset.tool](); modal.showModal(); }));
document.querySelector('.close-modal').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });

content.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target; const data = Object.fromEntries(new FormData(form)); const result = form.parentElement.querySelector('.result');
  if (form.dataset.calculator === 'budget') {
    const income = Number(data.income);
    const categories = [
      { label: 'Housing', value: Number(data.housing), tone: 'housing' },
      { label: 'Food', value: Number(data.food), tone: 'food' },
      { label: 'Commute', value: Number(data.commute), tone: 'commute' },
      { label: 'EMIs & bills', value: Number(data.bills), tone: 'bills' },
      { label: 'Other', value: Number(data.other), tone: 'other' }
    ];
    const spent = categories.reduce((sum, item) => sum + item.value, 0);
    const balance = income - spent;
    const target = income * 0.2;
    const status = balance < 0 ? 'Needs attention' : balance < target ? 'Tight but positive' : 'Healthy buffer';
    const statusClass = balance < 0 ? 'negative' : balance < target ? 'watch' : 'positive';
    const largest = [...categories].sort((a, b) => b.value - a.value)[0];
    const bars = categories.map(item => {
      const percent = spent ? Math.round((item.value / spent) * 100) : 0;
      return `<div class="mix-row"><div><span>${item.label}</span><b>${rupees(item.value)}</b></div><i><em class="${item.tone}" style="width:${percent}%"></em></i><small>${percent}% of planned spending</small></div>`;
    }).join('');
    const nextStep = balance < 0
      ? `Your plan is ${rupees(Math.abs(balance))} over income. Review ${largest.label.toLowerCase()} first because it is your largest cost.`
      : balance < target
        ? `You are positive, but below a 20% savings target. Reducing ${largest.label.toLowerCase()} by even 10% could help build your buffer.`
        : `You are meeting a 20% savings target. Keep the ${rupees(balance)} monthly buffer for goals, emergencies, or early debt repayment.`;
    result.innerHTML = `<section class="budget-insight"><div class="result-title"><div><small>YOUR BUDGET SNAPSHOT</small><h3>A clearer monthly picture</h3></div><span class="status ${statusClass}">${status}</span></div><div class="snapshot-grid"><div><small>Monthly income</small><strong>${rupees(income)}</strong></div><div><small>Planned spending</small><strong>${rupees(spent)}</strong></div><div><small>Monthly balance</small><strong class="${balance < 0 ? 'negative-text' : ''}">${balance < 0 ? '-' : ''}${rupees(Math.abs(balance))}</strong></div></div><div class="insight-columns"><div class="mix-card"><h4>Planned spending mix</h4>${bars}</div><div class="next-card"><small>NEXT BEST STEP</small><h4>${nextStep}</h4><p>At this pace, your 12-month balance would be ${balance >= 0 ? rupees(balance * 12) : `a shortfall of ${rupees(Math.abs(balance * 12))}`}.</p></div></div><p class="result-note">Planning estimate only. Your inputs stay in this browser and are not stored.</p></section>`;
  }
  if (form.dataset.calculator === 'commute') {
    const defaults = { bike: 2.5, car: 8, metro: 3, bus: 2, cab: 15 };
    if (event.submitter === form.querySelector('button') && data.rate === '2.5' && data.mode !== 'bike') form.rate.value = defaults[data.mode];
    const rate = Number(form.rate.value);
    const days = Number(data.days);
    const distance = Number(data.distance);
    const monthly = distance * 2 * days * rate;
    const yearly = monthly * 12;
    const carMonthly = distance * 2 * days * defaults.car;
    const alternative = data.mode === 'car' ? 0 : Math.max(0, carMonthly - monthly);
    const modeName = form.mode.options[form.mode.selectedIndex].text;
    const nextStep = data.mode === 'car'
      ? `Your car estimate is based on ${rupees(rate)} per km. Compare it with carpooling or public transport before committing to a daily route.`
      : `Compared with an estimated car commute, this route could save about ${rupees(alternative)} each month.`;
    result.innerHTML = `<section class="budget-insight"><div class="result-title"><div><small>COMMUTE COST SNAPSHOT</small><h3>${modeName} at a glance</h3></div><span class="status positive">Cost estimate</span></div><div class="snapshot-grid"><div><small>Monthly cost</small><strong>${rupees(monthly)}</strong></div><div><small>Per workday</small><strong>${rupees(monthly / days)}</strong></div><div><small>Annual cost</small><strong>${rupees(yearly)}</strong></div></div><div class="insight-columns"><div class="mix-card"><h4>Your route assumptions</h4><div class="fact-row"><span>Round-trip distance</span><b>${distance * 2} km</b></div><div class="fact-row"><span>Working days</span><b>${days} / month</b></div><div class="fact-row"><span>Cost per km</span><b>${rupees(rate)}</b></div></div><div class="next-card"><small>DECISION INSIGHT</small><h4>${nextStep}</h4><p>Update the cost per km whenever your fuel price or fare changes.</p></div></div><p class="result-note">Planning estimate only. Fuel, fares, parking, maintenance, and city routes can change the final cost.</p></section>`;
  }
  if (form.dataset.calculator === 'emi') {
    const principal = Number(data.principal);
    const months = Number(data.years) * 12;
    const monthlyRate = Number(data.rate) / 1200;
    const emi = monthlyRate ? principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : principal / months;
    const totalRepayment = emi * months;
    const interest = totalRepayment - principal;
    const interestShare = totalRepayment ? Math.round((interest / totalRepayment) * 100) : 0;
    const nextStep = interest > 0
      ? `Interest accounts for ${interestShare}% of your total repayment. A prepayment made early in the loan can reduce interest and shorten the term.`
      : `This is a zero-interest repayment plan, so your total repayment is equal to the amount borrowed.`;
    result.innerHTML = `<section class="budget-insight"><div class="result-title"><div><small>LOAN REPAYMENT SNAPSHOT</small><h3>Your borrowing in brief</h3></div><span class="status ${interestShare > 35 ? 'watch' : 'positive'}">${interestShare > 35 ? 'Interest-heavy' : 'Repayment plan'}</span></div><div class="snapshot-grid"><div><small>Monthly EMI</small><strong>${rupees(emi)}</strong></div><div><small>Total interest</small><strong>${rupees(interest)}</strong></div><div><small>Total repayment</small><strong>${rupees(totalRepayment)}</strong></div></div><div class="insight-columns"><div class="mix-card"><h4>Loan structure</h4><div class="fact-row"><span>Amount borrowed</span><b>${rupees(principal)}</b></div><div class="fact-row"><span>Interest rate</span><b>${Number(data.rate)}% p.a.</b></div><div class="fact-row"><span>Repayment period</span><b>${Number(data.years)} years</b></div></div><div class="next-card"><small>DECISION INSIGHT</small><h4>${nextStep}</h4><p>Check your lender's prepayment charge and terms before making an extra payment.</p></div></div><p class="result-note">Illustrative calculation using a standard reducing-balance EMI formula. It is not financial advice.</p></section>`;
  }
  result.classList.add('show');
});

document.querySelector('#year').textContent = new Date().getFullYear();

