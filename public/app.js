console.log("App JS");

inputElements = ['#ctc', '#pf', "#hra", '#deductions-80c', '#deductions-others']
currencyOptions = {
  currencySymbol : '₹',
  digitalGroupSpacing: '2',
  allowDecimalPadding: false
}
AutoNumeric.multiple(inputElements, currencyOptions);
