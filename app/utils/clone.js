
export default function clone(obj) {
  if (["boolean", "string", "number"].indexOf(typeof obj) > -1) {
    return obj;
  }
  if (typeof obj !== 'object' || obj === null) {
    return clone({val: obj}).val;
  }
  return JSON.parse(JSON.stringify(obj));
}
