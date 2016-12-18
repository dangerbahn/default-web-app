
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
    return window.setTimeout(callback, 16);
  };
}

/**
 * returns a function that executes the passed in function at most once
 * per animation frame.
 *
 * @method  throttleAnimationFrame
 * @param  {Function}  the function to throttle
 * @return {Function}  the throttled function
 */
export default function throttleAnimationFrame(func) {

  var running = false;

  return function() {

    var args = arguments;

    if (running) {
      return;
    }

    running = true;

    window.requestAnimationFrame(function() {
      func.apply(undefined, args);
      running = false;
    });

  };
}
