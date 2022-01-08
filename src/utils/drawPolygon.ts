import { P5Instance } from "react-p5-wrapper";

// Draw a basic polygon, handles triangles, squares, pentagons, etc
export default function drawPolygon(
  p5: P5Instance,
  x: number,
  y: number,
  radius: number,
  sides = 3,
  angle = 0
) {
  p5.beginShape();

  for (let i = 0; i < sides; i++) {
    const a = angle + p5.TWO_PI * (i / sides);
    let sx = x + p5.cos(a) * radius;
    let sy = y + p5.sin(a) * radius;
    p5.vertex(sx, sy);
  }
  p5.endShape(p5.CLOSE);
}
