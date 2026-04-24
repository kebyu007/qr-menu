export const handlebarsHelpers = {
  times: function (n, block) {
    let accum = '';
    for (let i = 0; i < n; i++) accum += block.fn(i);
    return accum;
  },
  add: (a, b) => a + b,
  eq: (a, b) => a == b,
  lte: (a, b) => a <= b,
  toString: (val) => val ? val.toString() : '',
};
