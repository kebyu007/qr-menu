export const handlebarsHelpers = {
  times: function (n, block) {
    let accum = '';
    for (let i = 0; i < n; i++) {
      accum += block.fn(i);
    }
    return accum;
  },
  eq: function (a, b) {
    if (a === undefined || b === undefined || a === null || b === null) {
      return false;
    }
    return String(a) === String(b);
  },
};