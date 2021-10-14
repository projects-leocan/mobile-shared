import { reduce, map } from "lodash/collection";
import { isEqual } from "lodash/lang";

const compare = function(a, b) {
  var result = {
    different: [],
    missing_from_first: [],
    missing_from_second: []
  };

  reduce(
    a,
    function(result, value, key) {
      try {
        if (b.hasOwnProperty && b.hasOwnProperty(key)) {
          if (isEqual(value, b[key])) {
            return result;
          } else {
            if (typeof a[key] != typeof {} || typeof b[key] != typeof {}) {
              //dead end.
              result.different.push(key);
              return result;
            } else {
              var deeper = compare(a[key], b[key]);
              result.different = result.different.concat(
                map(deeper.different, sub_path => {
                  return key + "." + sub_path;
                })
              );

              result.missing_from_second = result.missing_from_second.concat(
                map(deeper.missing_from_second, sub_path => {
                  return key + "." + sub_path;
                })
              );

              result.missing_from_first = result.missing_from_first.concat(
                map(deeper.missing_from_first, sub_path => {
                  return key + "." + sub_path;
                })
              );
              return result;
            }
          }
        } else {
          result.missing_from_second.push(key);
          return result;
        }
      } catch (error) {
        return result;
      }
    },
    result
  );

  reduce(
    b,
    function(result, value, key) {
      try {
        if (a.hasOwnProperty && a.hasOwnProperty(key)) {
          return result;
        } else {
          result.missing_from_first.push(key);
          return result;
        }
      } catch (error) {
        return result;
      }
    },
    result
  );

  return result;
};

export default compare;
