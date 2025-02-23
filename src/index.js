import { Clock } from "./clock";
import { Marquee } from "./marquee";

import { reveal } from "./helpers/reveal";

const clock = new Clock(".clock_inner");

const marqueeElements = document.querySelectorAll(".marquee");
marqueeElements.forEach(
  (marqueeElement, index) => new Marquee(marqueeElement, index + 1 * 20)
);

reveal();