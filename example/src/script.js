import "./style.css";

import { VirtualScroll } from "../../dist";

window.addEventListener("DOMContentLoaded", () => {
  const pageXElement = document.getElementById("pageX");
  const pageYElement = document.getElementById("pageY");
  const scroll = new VirtualScroll({
    vertical: true,
    horizontal: true,
  });

  scroll.on("scroll", ({ currentX, currentY }) => {
    pageXElement.innerText = currentX;
    pageYElement.innerText = currentY;
  });
});
