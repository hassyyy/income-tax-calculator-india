console.log("App JS");

EMPLOYER_PF = 21600;
PROFESSIONAL_TAX = 2500;
STANDARD_DEDUCTION = 50000;

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
  otherDeductions = AutoNumeric.getNumber('#deductions-80c');
  deductions_80c = Math.min(150000, otherDeductions + pf);
  deductions = deductions_80c + AutoNumeric.getNumber('#deductions-others');

  oldTaxableIncome = income - hra - deductions - EMPLOYER_PF - PROFESSIONAL_TAX - STANDARD_DEDUCTION;
  newTaxableIncome = income - EMPLOYER_PF;

  // Taxable Income
  $('#old-taxable-income-annual').text(formatCurrency(oldTaxableIncome));
  $('#old-taxable-income-monthly').text(formatCurrencyMonthly(oldTaxableIncome));
  $('#new-taxable-income-annual').text(formatCurrency(newTaxableIncome));
  $('#new-taxable-income-monthly').text(formatCurrencyMonthly(newTaxableIncome));

  // Old Regime - Taxable Income Breakup
  $('#total-income-annual').text(formatCurrency(income));
  $('#total-income-monthly').text(formatCurrencyMonthly(income));
  $('#employer-pf-annual').text(formatCurrency(EMPLOYER_PF));
  $('#employer-pf-monthly').text(formatCurrencyMonthly(EMPLOYER_PF));
  $('#hra-annual').text(formatCurrency(hra));
  $('#hra-monthly').text(formatCurrencyMonthly(hra));
  $('#deductions-80c-annual').text(formatCurrency(deductions_80c));
  $('#deductions-80c-monthly').text(formatCurrencyMonthly(deductions_80c));
  $('#standard-deductions-annual').text(formatCurrency(STANDARD_DEDUCTION));
  $('#standard-deductions-monthly').text(formatCurrencyMonthly(STANDARD_DEDUCTION));
  $('#other-deductions-annual').text(formatCurrency(otherDeductions));
  $('#other-deductions-monthly').text(formatCurrencyMonthly(otherDeductions));
  $('#professional-tax-annual').text(formatCurrency(PROFESSIONAL_TAX));
  $('#professional-tax-monthly').text(formatCurrencyMonthly(PROFESSIONAL_TAX));

  // New Regime - Taxable Income Breakup
  $('#nr-total-income-annual').text(formatCurrency(income));
  $('#nr-total-income-monthly').text(formatCurrencyMonthly(income));
  $('#nr-employer-pf-annual').text(formatCurrency(EMPLOYER_PF));
  $('#nr-employer-pf-monthly').text(formatCurrencyMonthly(EMPLOYER_PF));

  oldTax = calculateTax(oldTaxableIncome, true);
  newTax = calculateTax(newTaxableIncome);
  $('#old-tax-annual').text(formatCurrency(oldTax));
  $('#old-tax-monthly').text(formatCurrencyMonthly(oldTax));
  $('#new-tax-annual').text(formatCurrency(newTax));
  $('#new-tax-monthly').text(formatCurrencyMonthly(newTax));

  oldTaxCess = oldTax * 0.04;
  newTaxCess = newTax * 0.04;
  oldTakeHome = Math.round(income - pf - EMPLOYER_PF - PROFESSIONAL_TAX - oldTax - oldTaxCess);
  newTakeHome = Math.round(income - pf - EMPLOYER_PF - PROFESSIONAL_TAX - newTax - newTaxCess);
  $('#old-take-home-annual').text(formatCurrency(oldTakeHome));
  $('#old-take-home-monthly').text(formatCurrencyMonthly(oldTakeHome));
  $('#new-take-home-annual').text(formatCurrency(newTakeHome));
  $('#new-take-home-monthly').text(formatCurrencyMonthly(newTakeHome));

  // Old Regime - Take Home Breakup
  $('#or-home-total-income-annual').text(formatCurrency(income));
  $('#or-home-total-income-monthly').text(formatCurrencyMonthly(income));
  $('#or-home-employee-pf-annual').text(formatCurrency(pf));
  $('#or-home-employee-pf-monthly').text(formatCurrencyMonthly(pf));
  $('#or-home-employer-pf-annual').text(formatCurrency(EMPLOYER_PF));
  $('#or-home-employer-pf-monthly').text(formatCurrencyMonthly(EMPLOYER_PF));
  $('#or-home-professional-tax-annual').text(formatCurrency(PROFESSIONAL_TAX));
  $('#or-home-professional-tax-monthly').text(formatCurrencyMonthly(PROFESSIONAL_TAX));
  $('#or-home-income-tax-annual').text(formatCurrency(oldTax));
  $('#or-home-income-tax-monthly').text(formatCurrencyMonthly(oldTax));
  $('#or-home-cess-annual').text(formatCurrency(oldTaxCess));
  $('#or-home-cess-monthly').text(formatCurrencyMonthly(oldTaxCess));

  // New Regime - Take Home Breakup
  $('#nr-home-total-income-annual').text(formatCurrency(income));
  $('#nr-home-total-income-monthly').text(formatCurrencyMonthly(income));
  $('#nr-home-employee-pf-annual').text(formatCurrency(pf));
  $('#nr-home-employee-pf-monthly').text(formatCurrencyMonthly(pf));
  $('#nr-home-employer-pf-annual').text(formatCurrency(EMPLOYER_PF));
  $('#nr-home-employer-pf-monthly').text(formatCurrencyMonthly(EMPLOYER_PF));
  $('#nr-home-professional-tax-annual').text(formatCurrency(PROFESSIONAL_TAX));
  $('#nr-home-professional-tax-monthly').text(formatCurrencyMonthly(PROFESSIONAL_TAX));
  $('#nr-home-income-tax-annual').text(formatCurrency(newTax));
  $('#nr-home-income-tax-monthly').text(formatCurrencyMonthly(newTax));
  $('#nr-home-cess-annual').text(formatCurrency(newTaxCess));
  $('#nr-home-cess-monthly').text(formatCurrencyMonthly(newTaxCess));

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
    slab1Income = Math.min(taxableIncome, 250000);
    slab1Tax = 0;
    slab2Income = Math.max(Math.min(taxableIncome-250000, 250000), 0);
    slab2Tax = slab2Income * 0.05;
    slab3Income = Math.max(Math.min(taxableIncome-500000, 500000), 0);
    slab3Tax = slab3Income * 0.20;
    slab4Income = Math.max(taxableIncome-1000000, 0);
    slab4Tax = slab4Income * 0.30;

    $('#or-slab-1-income').text(formatCurrency(slab1Income));
    $('#or-slab-1-tax').text(formatCurrency(slab1Tax));
    $('#or-slab-2-income').text(formatCurrency(slab2Income));
    $('#or-slab-2-tax').text(formatCurrency(slab2Tax));
    $('#or-slab-3-income').text(formatCurrency(slab3Income));
    $('#or-slab-3-tax').text(formatCurrency(slab3Tax));
    $('#or-slab-4-income').text(formatCurrency(slab4Income));
    $('#or-slab-4-tax').text(formatCurrency(slab4Tax));

    return  (slab1Tax + slab2Tax  + slab3Tax  + slab4Tax)
  } else {
    slab1Income = Math.min(taxableIncome, 250000);
    slab1Tax = 0;
    slab2Income = Math.max(Math.min(taxableIncome-250000, 250000), 0);
    slab2Tax = slab2Income * 0.05;
    slab3Income = Math.max(Math.min(taxableIncome-500000, 250000), 0);
    slab3Tax = slab3Income * 0.10;
    slab4Income = Math.max(Math.min(taxableIncome-750000, 250000), 0);
    slab4Tax = slab4Income * 0.15;
    slab5Income = Math.max(Math.min(taxableIncome-1000000, 250000), 0);
    slab5Tax = slab5Income * 0.20;
    slab6Income = Math.max(Math.min(taxableIncome-1250000, 250000), 0);
    slab6Tax = slab6Income * 0.25;
    slab7Income = Math.max(taxableIncome-1500000, 0);
    slab7Tax = slab7Income * 0.30;

    $('#nr-slab-1-income').text(formatCurrency(slab1Income));
    $('#nr-slab-1-tax').text(formatCurrency(slab1Tax));
    $('#nr-slab-2-income').text(formatCurrency(slab2Income));
    $('#nr-slab-2-tax').text(formatCurrency(slab2Tax));
    $('#nr-slab-3-income').text(formatCurrency(slab3Income));
    $('#nr-slab-3-tax').text(formatCurrency(slab3Tax));
    $('#nr-slab-4-income').text(formatCurrency(slab4Income));
    $('#nr-slab-4-tax').text(formatCurrency(slab4Tax));
    $('#nr-slab-5-income').text(formatCurrency(slab5Income));
    $('#nr-slab-5-tax').text(formatCurrency(slab5Tax));
    $('#nr-slab-6-income').text(formatCurrency(slab6Income));
    $('#nr-slab-6-tax').text(formatCurrency(slab6Tax));
    $('#nr-slab-7-income').text(formatCurrency(slab7Income));
    $('#nr-slab-7-tax').text(formatCurrency(slab7Tax));

    return  (slab1Tax + slab2Tax  + slab3Tax  + slab4Tax  + slab5Tax  + slab6Tax  + slab7Tax)
  }
}

function formatCurrency(value) {
  return AutoNumeric.format(Math.round(value), CURRENCY_OPTIONS)
}

function formatCurrencyMonthly(value) {
  return AutoNumeric.format(Math.round(value/12), CURRENCY_OPTIONS)
}
