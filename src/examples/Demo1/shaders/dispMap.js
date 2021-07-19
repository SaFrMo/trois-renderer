import snoise3 from './snoise3'

export const vertex = `varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}`

export const fragment = `
uniform float uTime;
uniform float uNoiseCoef;
varying vec2 vUv;
${snoise3}
void main() {
  vec2 p = vec2(vUv * uNoiseCoef);
  float noise = (snoise(vec3(p.x, p.y, uTime)) + 1.0) / 2.0;
  gl_FragColor = vec4(noise, 0.0, 0.0, 1.0);
}
`