function orders(a, b, order) {
  switch(order) {
    case 'Reverse Chronological':
      return a.date == b.date ?
            a.round < b.round ?
            1 : -1 : a.date < b.date ?
            1 : -1;
      break;
    case 'Chronological':
      return a.date == b.date ?
        b.round < a.round ?
          1 : -1 : b.date < a.date ?
          1 : -1;
      break;
    case 'High Spread':
      return Math.abs(b.score - b.oppscore) - Math.abs(a.score - a.oppscore) ;
      break;
    case 'Low Spread':
      return Math.abs(a.score - a.oppscore) - Math.abs(b.score - b.oppscore);
      break;
    case 'High Winner':
      return b.score - a.score;
      break;
    case 'High Loser':
      return b.oppscore - a.oppscore;
      break;
    case 'Low Winner':
      return a.score -b.score;
      break;
    case 'Low Loser':
      return a.oppscore - b.oppscore;
      break;
    case 'Player Name':
      return a.player < b.player ? -1 : 1;
      break;
    case 'Player Name R':
      return b.player < a.player ? -1 : 1;
      break;
    case 'Opp Name':
      return a.opp < b.opp ? -1 : 1;
      break;
    case 'Opp Name R':
      return b.opp < a.opp ? -1 : 1;
      break;
  }
  return a - b;
}

function filterFunction() {
  let input, filter, a, i;
  input = document.getElementById("nameSearch");
  filter = input.value.toUpperCase();
  let div = document.getElementById("nameDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    let txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}


export { filterFunction, orders }
