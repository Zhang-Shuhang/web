/**
 * 函数节流
 * @param {function} fn 节流函数
 * @param {number} delay 节流时间
 * @returns 节流处理完的函数
 */
export function throttle(fn, delay) {
  let timer = null;
  let prev = null;
  return function() {
    let now = Date.now();
    let remaining = delay - (now - prev);
    const args = arguments;
    clearTimeout(timer);
    if (remaining <= 0) {
      fn.apply(this, args);
      prev = Date.now();
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}
