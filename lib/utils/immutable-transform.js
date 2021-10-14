// import R from 'ramda';
import Immutable from 'seamless-immutable';

// const isImmutable = R.has('asMutable');
// const convertToJs = (state) => state.asMutable({deep: true});
// const fromImmutable = R.when(isImmutable, convertToJs);
// const toImmutable = (raw) => Immutable(raw);

// export default {
//   out: (state) => {
//     state.mergeDeep = R.identity;
//     return toImmutable(state);
//   },
//   in: (raw) => {
//     return fromImmutable(raw);
//   }
// }

export default {
  out: (state) => {
    // console.time('transform out');
    const imm = Immutable(state);
    // console.timeEnd('transform out');
    return imm;
  },
  in: (state) => {
    // console.time('transform in');
    const imm = state.asMutable ? state.asMutable({deep: true}) : state;
    // console.timeEnd('transform in');
    return imm;
  }
}