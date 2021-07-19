export const vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = vec4(position, 1.0);
}
`

export const fragment = `
uniform sampler2D dispMap;
uniform vec2 delta;
varying vec2 vUv;
void main() {
  // gl_FragColor = vec4(0.5, 0.5, 1.0, 0.0);
  /*
  float x1 = texture2D(dispMap, vec2(vUv.x - delta.x, vUv.y)).r;
  float x2 = texture2D(dispMap, vec2(vUv.x + delta.x, vUv.y)).r;
  float y1 = texture2D(dispMap, vec2(vUv.x, vUv.y - delta.y)).r;
  float y2 = texture2D(dispMap, vec2(vUv.x, vUv.y + delta.y)).r;
  gl_FragColor = vec4(0.5 + (x1 - x2), 0.5 + (y1 - y2), 1.0, 1.0);
  */
 gl_FragColor = texture2D(dispMap, vUv.xy);
}
`