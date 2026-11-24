import { surfaceBytes, surfaceSpecs } from './surface-data.mjs';

const entries=Object.entries(surfaceSpecs());
for(const [i,[key,spec]] of entries.entries()) {
  const material=surfaceBytes(spec);
  const {albedo,properties,normal}=material;
  postMessage({key,material,progress:(i+1)/entries.length},[albedo.buffer,properties.buffer,normal.buffer]);
}
