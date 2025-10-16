export default {
  inserted: function(el) {
    el.style.cursor = 'move'; 
    el.onmousedown = function(e) {
      let diffX = e.clientX - el.offsetLeft;
      let diffY = e.clientY - el.offsetTop;

      document.onmousemove = function(e) {
        let left = e.clientX - diffX;
        let top = e.clientY - diffY;

        if (left < 0) left = 0;
        else if (left > window.innerWidth - el.offsetWidth)
          left = window.innerWidth - el.offsetWidth;

        if (top < 0) top = 0;
        else if (top > window.innerHeight - el.offsetHeight)
          top = window.innerHeight - el.offsetHeight;

        el.style.left = left + "px";
        el.style.top = top + "px";
      };

      document.onmouseup = function() {
        this.onmousemove = null;
        this.onmouseup = null;
      };
    };
  },
};
