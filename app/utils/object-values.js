export default function objectValues(obj) {
  return Object.keys(obj).map(function(key) {
    return obj[key];
  });
}
