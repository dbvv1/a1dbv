import {describe,it,expect,vi} from 'vitest';
import {readFile} from 'node:fs/promises';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadBattleAssets} from '../../src/render/battle-assets.js';
import {applyQuietBuildings} from '../../src/render/quiet-buildings.js';
import {applyQuietBuildingInstance} from '../../src/render/quiet-building-instance.js';
import {createBattlefield,battleAssetId} from '../../src/render/battlefield.js';
import {makeSim} from '../helpers.js';
import {getContent} from '../../src/content/catalog.js';

async function load(){
 const loader=new GLTFLoader().register(()=>({name:'CPU_texture_identity_only',loadTexture:async()=>new THREE.Texture()}));
 return loadBattleAssets(async url=>{const path=url.split('?')[0]!;const bytes=await readFile(new URL(`../../${path.startsWith('/')?path.slice(1):path}`,import.meta.url));return loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');});
}
function stone(root:THREE.Object3D){let result:THREE.Mesh|undefined;root.traverse(o=>{if(o instanceof THREE.Mesh&&o.geometry.hasAttribute('quietStoneMask'))result=o;});if(!result)throw new Error('No prepared stone mesh');return result;}
function inspect(material:THREE.Material){const shader={uniforms:{},vertexShader:'#include <begin_vertex>',fragmentShader:'#include <map_fragment>'};material.onBeforeCompile(shader as unknown as THREE.WebGLProgramParametersWithUniforms,{} as THREE.WebGLRenderer);return shader;}
describe('returned reader proposal versus production template consumer',()=>{
 it('actual battlefield placements share the once-bound template; removing one preserves the survivor',async()=>{
  const assets=await load(),family={road:new THREE.Texture(),forest:new THREE.Texture(),wall:new THREE.Texture(),dispose(){}},binding=applyQuietBuildings(assets,family);
  const sim=await makeSim(8,61),snapshot=sim.snapshot(),tower=snapshot.entities.find(e=>e.kind==='structure'&&e.structureKind==='tower')!;
  // Synthetic second placement uses the real snapshot contract and production sync/remove.
  const second={...tower,id:100000,position:{x:tower.position.x+3,z:tower.position.z}};
  const field=createBattlefield(getContent(8),assets);field.sync({...snapshot,entities:[...snapshot.entities,second]});
  const first=stone(field.root.getObjectByName(`entity-${tower.id}`)!),other=stone(field.root.getObjectByName('entity-100000')!),template=stone(assets.models[battleAssetId(tower)]!.scene);
  expect(first.material).toBe(other.material);expect(first.material).toBe(template.material);expect(first.geometry).toBe(other.geometry);
  const material=first.material as THREE.MeshStandardMaterial,shader=inspect(material);
  expect(material.map).toBe((other.material as THREE.MeshStandardMaterial).map);expect(shader.uniforms).toHaveProperty('quietWall.value',family.wall);
  expect(shader.vertexShader.match(/attribute float quietStoneMask;/g)).toHaveLength(1);
  const materialDisposed=vi.fn(),geometryDisposed=vi.fn(),wallDisposed=vi.fn(),atlasDisposed=vi.fn();
  material.addEventListener('dispose',materialDisposed);first.geometry.addEventListener('dispose',geometryDisposed);family.wall.addEventListener('dispose',wallDisposed);material.map!.addEventListener('dispose',atlasDisposed);
  field.sync({...snapshot,tick:snapshot.tick+1,entities:snapshot.entities});
  expect(field.root.getObjectByName('entity-100000')).toBeUndefined();expect(stone(field.root.getObjectByName(`entity-${tower.id}`)!).material).toBe(material);
  for(const f of [materialDisposed,geometryDisposed,wallDisposed,atlasDisposed])expect(f).not.toHaveBeenCalled();
  field.dispose();expect(materialDisposed).not.toHaveBeenCalled();binding.dispose();binding.dispose();expect(materialDisposed).toHaveBeenCalledTimes(1);expect(geometryDisposed).toHaveBeenCalledTimes(1);expect(wallDisposed).not.toHaveBeenCalled();expect(atlasDisposed).not.toHaveBeenCalled();
  assets.dispose();assets.dispose();expect(atlasDisposed).toHaveBeenCalledTimes(1);family.wall.dispose();expect(wallDisposed).toHaveBeenCalledTimes(1);
 });
 it('returned helper duplicates shader declarations when given the actual already-prepared template clone',async()=>{
  const assets=await load(),family={road:new THREE.Texture(),forest:new THREE.Texture(),wall:new THREE.Texture(),dispose(){}},binding=applyQuietBuildings(assets,family),root=assets.models['tower-teal']!.scene.clone(true);
  const extra=applyQuietBuildingInstance(root,'tower-teal',family),material=stone(root).material as THREE.Material,shader=inspect(material);
  expect(shader.vertexShader.match(/attribute float quietStoneMask;/g)).toHaveLength(2);
  expect(shader.fragmentShader.match(/uniform sampler2D quietWall;/g)).toHaveLength(2);
  expect(material.customProgramCacheKey().match(/\|quiet-stone-v1/g)).toHaveLength(2);
  extra.dispose();binding.dispose();assets.dispose();for(const t of [family.road,family.forest,family.wall])t.dispose();
 });
});
