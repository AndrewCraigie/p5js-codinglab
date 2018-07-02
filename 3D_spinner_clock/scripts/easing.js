// Andrew Craigie
// Easing funcitons
// Refactored from: https://github.com/kaelzhang/easing-functions/blob/master/index.js

let Ease = {

  Linear: {
    None: k => k
  },

  Quadratic: {
    In: k => k * k,
    Out: k => 2 - k,
    InOut: k => {
      if ((k *= 2) < 1) return 0.5 * k * k;
      return -0.5 * (--k * (k - 2) - 1);
    }
  },

  Cubic: {
    In: k => k * k * k,
    Out: k => --k * k * k + 1,
    InOut: k => {
      if ((k *= 2) < 1) return 0.5 * k * k * k;
      return 0.5 * ((k -= 2) * k * k + 2);
    }
  },

  Quartic: {
    Out: k => 1 - (--k * k * k * k),
    InOut: k => {
      if ((k *= 2) < 1) return 0.5 * k * k * k * k;
      return -0.5 * ((k -= 2) * k * k * k - 2);
    }
  },

  Quintic: {
    In: k => k * k * k * k * k,
    Out: k => --k * k * k * k * k + 1,
    InOut: k => {
      if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
      return 0.5 * ((k -= 2) * k * k * k * k + 2);
    }
  },

  Sinusoidal: {
    In: k => 1 - Math.cos(k * Math.PI / 2),
    Out: k => Math.sin(k * Math.PI / 2),
    InOut: k => 0.5 * (1 - Math.cos(Math.PI * k))
  },

  Exponential: {
    In: k => k === 0 ? 0 : Math.pow(1024, k - 1),
    Out: k => k === 1 ? 1 : 1 - Math.pow(2, -10 * k),
    InOut: k => {
      if (k === 0) return 0;
      if (k === 1) return 1;
      if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
      return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    }
  },

  Circular: {
    In: k => 1 - Math.sqrt(1 - k * k),
    Out: k => Math.sqrt(1 - (--k * k)),
    InOut: k => {
      if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
      return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    }
  },

  Elastic: {
    In: k => {
      let s, a = 0.1,
        p = 0.4;
      if (k === 0) return 0;
      if (k === 1) return 1;
      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else {
        s = p * Math.asin(1 / a) / (2 * Math.PI);
      };
      return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    },

    Out: k => {
      let s, a = 0.1,
        p = 0.4;
      if (k === 0) return 0;
      if (k === 1) return 1;
      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else {
        s = p * Math.asin(1 / a) / (2 * Math.PI);
      }
      return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
    },


    InOut: k => {
      let s, a = 0.1,
        p = 0.4;
      if (k === 0) return 0;
      if (k === 1) return 1;
      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else {
        s = p * Math.asin(1 / a) / (2 * Math.PI);
      }
      if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
      return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
    }
  },

  Back: {
    In: k => {
      let s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },
    Out: k => {
      let s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },
    InOut: k => {
      let s = 1.70158 * 1.525;
      if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }
  },

  Bounce: {
    In: k => 1 - Ease.Bounce.Out( 1 - k ),
    Out: k => {
      if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
      } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
      } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
      } else {
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
      }
    },
    InOut: k => {
      if (k < 0.5) return Ease.Bounce.In(k * 2) * 0.5;
      return Ease.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
    }
  },

};
