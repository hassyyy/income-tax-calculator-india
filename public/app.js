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
  $('#result').show();
  $('#result-table').show();

  income = AutoNumeric.getNumber('#ctc');
  pf = AutoNumeric.getNumber('#pf');
  hra = AutoNumeric.getNumber('#hra');
  deductions = AutoNumeric.getNumber('#deductions-80c') + AutoNumeric.getNumber('#deductions-others');

  oldTaxableIncome = income - pf - hra - deductions - EMPLOYER_PF - PROFESSIONAL_TAX - CONVEYANCE;
  newTaxableIncome = income - EMPLOYER_PF;
  $('#old-taxable-income-annual').text(AutoNumeric.format(oldTaxableIncome, CURRENCY_OPTIONS));
  $('#old-taxable-income-monthly').text(AutoNumeric.format(Math.round(oldTaxableIncome/12), CURRENCY_OPTIONS));
  $('#new-taxable-income-annual').text(AutoNumeric.format(newTaxableIncome, CURRENCY_OPTIONS));
  $('#new-taxable-income-monthly').text(AutoNumeric.format(Math.round(newTaxableIncome/12), CURRENCY_OPTIONS));

  oldTax = calculateTax(oldTaxableIncome, true);
  newTax = calculateTax(newTaxableIncome);
  $('#old-tax-annual').text(AutoNumeric.format(oldTax, CURRENCY_OPTIONS));
  $('#old-tax-monthly').text(AutoNumeric.format(Math.round(oldTax/12), CURRENCY_OPTIONS));
  $('#new-tax-annual').text(AutoNumeric.format(newTax, CURRENCY_OPTIONS));
  $('#new-tax-monthly').text(AutoNumeric.format(Math.round(newTax/12), CURRENCY_OPTIONS));

  oldTakeHome = Math.round(income - pf - EMPLOYER_PF - PROFESSIONAL_TAX - (oldTax * 1.04));
  newTakeHome = Math.round(income - pf - EMPLOYER_PF - PROFESSIONAL_TAX - (newTax * 1.04));
  $('#old-take-home-annual').text(AutoNumeric.format(oldTakeHome, CURRENCY_OPTIONS));
  $('#old-take-home-monthly').text(AutoNumeric.format(Math.round(oldTakeHome/12), CURRENCY_OPTIONS));
  $('#new-take-home-annual').text(AutoNumeric.format(newTakeHome, CURRENCY_OPTIONS));
  $('#new-take-home-monthly').text(AutoNumeric.format(Math.round(newTakeHome/12), CURRENCY_OPTIONS));

  if(oldTakeHome > newTakeHome) {
    $('#old-regime').addClass('best-regime');
    $('#new-regime').removeClass('best-regime');
    takeHomeDifference = AutoNumeric.format(Math.round((oldTakeHome - newTakeHome)/12), CURRENCY_OPTIONS)
    $('#result').text(`Old regime is better than New regime by ${takeHomeDifference} per month`);
  } else {
    $('#old-regime').removeClass('best-regime');
    $('#new-regime').addClass('best-regime');
    takeHomeDifference = AutoNumeric.format(Math.round((newTakeHome - oldTakeHome)/12), CURRENCY_OPTIONS)
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
