console.log("App JS");

EMPLOYER_PF = 21600;
PROFESSIONAL_TAX = 2500;
CONVEYANCE = 50000;

inputElements = ['#ctc', '#pf', "#hra", '#deductions-80c', '#deductions-others']
CURRENCY_OPTIONS = {
  currencySymbol : '₹',
  digitalGroupSpacing: '2',
  allowDecimalPadding: false
}
AutoNumeric.multiple(inputElements, CURRENCY_OPTIONS);

function displayResult() {
  console.log('Calculating Tax');
  $('#result').css('visibility','visible');
  $('#result-table').css('visibility','visible');

  income = AutoNumeric.getNumber('#ctc');
  pf = AutoNumeric.getNumber('#pf');
  hra = AutoNumeric.getNumber('#hra');
  deductions_80c = Math.min(150000, AutoNumeric.getNumber('#pf') + pf);
  deductions = deductions_80c + AutoNumeric.getNumber('#deductions-others');

  oldTaxableIncome = income - hra - deductions - EMPLOYER_PF - PROFESSIONAL_TAX - CONVEYANCE;
  newTaxableIncome = income - EMPLOYER_PF;
  $('#old-taxable-income-annual').text(formatCurrency(oldTaxableIncome));
  $('#old-taxable-income-monthly').text(formatCurrencyMonthly(oldTaxableIncome));
  $('#new-taxable-income-annual').text(formatCurrency(newTaxableIncome));
  $('#new-taxable-income-monthly').text(formatCurrencyMonthly(newTaxableIncome));


  oldTax = calculateTax(oldTaxableIncome, true);
  newTax = calculateTax(newTaxableIncome);
  $('#old-tax-annual').text(formatCurrency(oldTax));
  $('#old-tax-monthly').text(formatCurrencyMonthly(oldTax));
  $('#new-tax-annual').text(formatCurrency(newTax));
  $('#new-tax-monthly').text(formatCurrencyMonthly(newTax));

  oldTakeHome = Math.round(income - pf - EMPLOYER_PF - PROFESSIONAL_TAX - (oldTax * 1.04));
  newTakeHome = Math.round(income - pf - EMPLOYER_PF - PROFESSIONAL_TAX - (newTax * 1.04));
  $('#old-take-home-annual').text(formatCurrency(oldTakeHome));
  $('#old-take-home-monthly').text(formatCurrencyMonthly(oldTakeHome));
  $('#new-take-home-annual').text(formatCurrency(newTakeHome));
  $('#new-take-home-monthly').text(formatCurrencyMonthly(newTakeHome));

  if(oldTakeHome > newTakeHome) {
    $('#old-regime-check').css('visibility','visible');
    $('#new-regime-check').css('visibility','hidden');
    takeHomeDifference = formatCurrencyMonthly((oldTakeHome - newTakeHome))
    $('#result').text(`Old regime is better than New regime by ${takeHomeDifference} per month`);
  } else {
    $('#old-regime-check').css('visibility','hidden');
    $('#new-regime-check').css('visibility','visible');
    takeHomeDifference = formatCurrencyMonthly((newTakeHome - oldTakeHome))
    $('#result').text(`New regime is better than Old regime by ${takeHomeDifference} per month`);
  }
}

function calculateTax(taxableIncome, old = false) {
  if(old) {
    return  (Math.max(Math.min(taxableIncome-250000, 250000), 0) * 0.05) +
            (Math.max(Math.min(taxableIncome-500000, 500000), 0) * 0.20) +
            (Math.max(taxableIncome-1000000, 0) * 0.30)
  } else {
    return  (Math.max(Math.min(taxableIncome-250000, 250000), 0) * 0.05) +
            (Math.max(Math.min(taxableIncome-500000, 250000), 0) * 0.10) +
            (Math.max(Math.min(taxableIncome-750000, 250000), 0) * 0.15) +
            (Math.max(Math.min(taxableIncome-1000000, 250000), 0) * 0.20) +
            (Math.max(Math.min(taxableIncome-1250000, 250000), 0) * 0.25) +
            (Math.max(taxableIncome-1500000, 0) * 0.30)
  }
}

function formatCurrency(value) {
  return AutoNumeric.format(value, CURRENCY_OPTIONS)
}

function formatCurrencyMonthly(value) {
  return AutoNumeric.format(Math.round(value/12), CURRENCY_OPTIONS)
}
