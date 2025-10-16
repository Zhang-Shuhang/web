/**
 * 函数防抖
 * @param {function} fn 防抖函数
 * @param {number} delay 防抖时间
 * @returns 防抖处理完的函数
 */
export function debounce(fn, delay) {
  let timer = null;
  return function() {
    let arg = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arg);
    }, delay);
  };
}
