export function convertFloat32ToInt16(buffer: Float32Array): Int16Array {
  const l = buffer.length;
  const buf = new Int16Array(l);

  for (let i = 0; i < l; i++) {
    buf[i] = Math.min(1, buffer[i]) * 0x7fff;
  }

  return buf;
}
