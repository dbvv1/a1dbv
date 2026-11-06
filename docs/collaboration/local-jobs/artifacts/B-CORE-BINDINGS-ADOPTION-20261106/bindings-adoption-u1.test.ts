// @vitest-environment jsdom
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {BINDINGS_STORAGE_KEY,DEFAULT_BINDINGS,KeyboardBindings} from '../../src/input/bindings.js';
import {createControls} from '../../src/input/controls.js';
import {controlsHelp,createKeyboardSettings} from '../../src/ui/keyboard-settings.js';
import {createHud} from '../../src/ui/hud.js';
import {createHeroSelection} from '../../src/ui/hero-selection.js';
import {Simulation} from '../../src/sim/simulation.js';
import type {SimCommand,Snapshot} from '../../src/sim/types.js';
import type {GameWorld} from '../../src/render/world.js';

// Reader-adoption check for the SECOND real rebind (W<->R, Stop S->G).
// CPU DOM (jsdom) plus the real Controls and Simulation; rendering/audio/pointer I/O are doubled.
// This is not a browser, renderer, focus-inertness or device claim.

const names={Q:'Skill 1',W:'Skill 2',E:'Skill 3',R:'Ultimate',attackMove:'Attack-move',stop:'Stop',focusCamera:'Lock camera'};
const navigation={closestPoint:(p:{x:number;z:number})=>({...p}),findPath:(a:{x:number;z:number},b:{x:number;z:number})=>({success:true,points:[a,b],reason:null})};
const SECOND_REBIND={Q:'Q',W:'R',E:'E',R:'W',attackMove:'A',stop:'G',focusCamera:'Space'};
const cleanup:Array<()=>void>=[];
afterEach(()=>{while(cleanup.length)cleanup.pop()!();vi.restoreAllMocks();document.body.replaceChildren();});

beforeEach(()=>{
  document.body.innerHTML='<button id="trigger">Keyboard settings</button><dialog></dialog><section id="hud"></section><select></select><p id="hero-details"></p><p id="help"></p>';
  Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value:function(this:HTMLDialogElement){this.open=true;}});
  Object.defineProperty(HTMLDialogElement.prototype,'close',{configurable:true,value:function(this:HTMLDialogElement){this.open=false;this.dispatchEvent(new Event('close'));}});
});

function storage(){const values=new Map<string,string>();let fail=false;return {
  values,setFail(value:boolean){fail=value;},
  store:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{if(fail)throw new Error('quota');values.set(key,value);},removeItem:(key:string)=>{if(fail)throw new Error('denied');values.delete(key);}},
};}

type Fixture={store:ReturnType<typeof storage>;trigger:HTMLButtonElement;dialog:HTMLDialogElement;values:Map<string,string>;setFail:(value:boolean)=>void};
function fixture():Fixture{
  const s=storage();
  return {store:s.store,trigger:document.querySelector<HTMLButtonElement>('#trigger')!,dialog:document.querySelector('dialog')!,values:s.values,setFail:s.setFail};
}

function mount(f:Fixture,bindings:KeyboardBindings,sim=new Simulation({seed:1,contentVersion:10,navigation,heroesPerTeam:1})){
  const commands:SimCommand[]=[];
  const say=vi.fn(),setTargeting=vi.fn(),setPointer=vi.fn(),leavePointer=vi.fn();
  const canvas=document.createElement('canvas');canvas.tabIndex=0;
  const world={canvas,setTargeting,setPointer,leavePointer,aim:()=>{const snapshot=sim.snapshot(),hero=snapshot.heroes[0]!;return {point:{x:hero.position.x+2,z:hero.position.z},entityId:null};}} as unknown as GameWorld;
  const hudRoot=document.querySelector<HTMLElement>('#hud')!;
  const helpEl=document.querySelector<HTMLElement>('#help')!;
  const select=document.querySelector<HTMLSelectElement>('select')!;
  const details=document.querySelector<HTMLElement>('#hero-details')!;
  const playerId=sim.snapshot().heroes.find(hero=>hero.team===0)!.id;
  let controls!:ReturnType<typeof createControls>;
  const hud=createHud(hudRoot,sim.catalog,slot=>controls.skill(slot),()=>{},()=>{},bindings);
  const selection=createHeroSelection(select,details,sim.catalog,slot=>bindings.label(slot));
  const refresh=()=>{helpEl.textContent=controlsHelp(bindings);hud.update(sim.snapshot(),playerId);selection.refresh();};
  controls=createControls(world,sim.catalog,()=>{const snapshot=sim.snapshot();return {snapshot,hero:snapshot.heroes.find(hero=>hero.id===playerId)!};},command=>commands.push(command),say,()=>{},bindings);
  const editor=createKeyboardSettings(f.dialog,f.trigger,bindings,names,()=>{},refresh);
  refresh();
  let disposed=false;
  const dispose=()=>{if(disposed)return;disposed=true;editor.dispose();controls.dispose();hud.dispose();};
  cleanup.push(dispose);
  const keyInDialog=(key:string)=>{const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});document.activeElement!.dispatchEvent(event);return event;};
  const clickInDialog=(selector:string)=>{const target=f.dialog.querySelector<HTMLButtonElement>(selector)!;target.focus();target.click();};
  const rowText=(action:string)=>f.dialog.querySelector<HTMLButtonElement>(`[data-binding-action="${action}"]`)!.textContent;
  const status=()=>f.dialog.querySelector<HTMLElement>('[data-binding-status]')!.textContent??'';
  return {
    sim,bindings,world,commands,say,setTargeting,hud,hudRoot,helpEl,select,selection,editor,dialog:f.dialog,dispose,
    skillButtons:()=>[...hudRoot.querySelectorAll<HTMLButtonElement>('[data-skills] button')],
    advance(ticks:number){for(let i=0;i<ticks;i++)sim.step([]);},
    open(){f.trigger.focus();f.trigger.click();},
    capture(action:string,key:string){f.dialog.querySelector<HTMLButtonElement>(`[data-binding-action="${action}"]`)!.focus();f.dialog.querySelector<HTMLButtonElement>(`[data-binding-action="${action}"]`)!.click();keyInDialog(key);},
    clickInDialog,rowText,status,
    pressKey(key:string){const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});document.body.dispatchEvent(event);return event;},
    canvasClick(button=0){canvas.dispatchEvent(new MouseEvent('pointerdown',{button,clientX:10,clientY:10,bubbles:true,cancelable:true}));},
    refresh,playerId,
  };
}
type Mounted=ReturnType<typeof mount>;

function rebindAndSaveSecondSet(m:Mounted){
  m.open();
  m.capture('W','r');
  expect(m.status()).toContain('already used by Ultimate');
  m.clickInDialog('[data-binding-swap]');
  m.capture('stop','g');
  m.clickInDialog('[data-binding-save]');
}

describe('reader adopts the page for a second real rebind',()=>{
  it('cancels one draft, explicitly swaps W/R, moves Stop to G and saves once; real controls, Simulation and every hint follow',()=>{
    const f=fixture(),m=mount(f,new KeyboardBindings(()=>f.store));try{
      // A draft edit must be discardable without touching the effective keys or storage.
      m.open();m.capture('Q','f');
      expect(m.bindings.draft.Q).toBe('F');
      m.clickInDialog('[data-binding-cancel]');
      expect(m.bindings.value).toEqual(DEFAULT_BINDINGS);expect(m.bindings.draft).toEqual(DEFAULT_BINDINGS);
      expect(f.values.has(BINDINGS_STORAGE_KEY)).toBe(false);
      const cancelledMana=m.sim.snapshot().heroes[0]!.mana;
      m.pressKey('f');m.canvasClick();m.advance(1);
      expect(m.commands).toHaveLength(0);
      expect(m.sim.snapshot().heroes[0]!.mana).toBeGreaterThanOrEqual(cancelledMana);

      // Explicit W<->R swap: conflict is named first, then the swap button decides.
      m.open();m.capture('W','r');
      expect(m.bindings.draft).toEqual(DEFAULT_BINDINGS);
      expect(m.status()).toContain('already used by Ultimate');
      m.clickInDialog('[data-binding-swap]');
      expect(m.bindings.draft).toMatchObject({W:'R',R:'W'});
      // Stop S->G.
      m.capture('stop','g');
      expect(m.bindings.draft.stop).toBe('G');
      expect(m.rowText('W')).toBe('R');expect(m.rowText('R')).toBe('W');expect(m.rowText('stop')).toBe('G');
      // One save commits everything.
      m.clickInDialog('[data-binding-save]');
      expect(m.dialog.open).toBe(false);
      expect(JSON.parse(f.values.get(BINDINGS_STORAGE_KEY)!)).toEqual({version:1,bindings:SECOND_REBIND});

      // HUD, help and hero hint all read the same effective binding; skill slots stay Q/W/E/R.
      const buttons=m.skillButtons();
      expect(buttons[0]!.textContent).toMatch(/^Q /);expect(buttons[1]!.textContent).toMatch(/^R /);
      expect(buttons[2]!.textContent).toMatch(/^E /);expect(buttons[3]!.textContent).toMatch(/^W /);
      expect(m.helpEl.textContent).toContain('Q/R/E/W then left-click');
      expect(m.helpEl.textContent).toContain('G: stop');
      expect(m.select.title).toContain('R: Slipstream');expect(m.select.title).toContain('W: Skyfall Seal');

      // Physical W now aims the R slot; the original ability is consumed.
      m.pressKey('w');expect(m.setTargeting).toHaveBeenLastCalledWith('R');
      expect(m.say).toHaveBeenLastCalledWith(expect.stringMatching(/^W Skyfall Seal/));
      m.canvasClick();expect(m.commands[0]).toMatchObject({type:'cast',slot:'R'});
      const beforeR=m.sim.snapshot().heroes[0]!.mana;
      expect(m.sim.step(m.commands.splice(0))[0]?.accepted).toBe(true);
      const afterR=m.sim.snapshot().heroes[0]!;
      expect(afterR.mana).toBeLessThan(beforeR);expect(afterR.cooldowns.R).toBeGreaterThan(0);
      // The original cast resolves before the next input; this is simulation speed, not the binding layer.
      m.advance(10);
      expect(m.sim.snapshot().heroes[0]!.castSlot).toBeNull();

      // Physical R now aims the W slot, still through the same command path.
      m.pressKey('r');expect(m.setTargeting).toHaveBeenLastCalledWith('W');
      expect(m.say).toHaveBeenLastCalledWith(expect.stringMatching(/^R Slipstream/));
      m.canvasClick();expect(m.commands[0]).toMatchObject({type:'cast',slot:'W'});
      expect(m.sim.step(m.commands.splice(0))[0]?.accepted).toBe(true);
      expect(m.sim.snapshot().heroes[0]!.cooldowns.W).toBeGreaterThan(0);

      // The old stop key is dead; G emits the original stop command.
      const targetingCalls=m.setTargeting.mock.calls.length;
      m.pressKey('s');expect(m.setTargeting).toHaveBeenCalledTimes(targetingCalls);expect(m.commands).toHaveLength(0);
      m.pressKey('g');expect(m.commands[0]).toMatchObject({type:'stop'});
      expect(m.sim.step(m.commands.splice(0))[0]?.accepted).toBe(true);
    }finally{m.editor.dispose();}
  });

  it('a fresh owner on the same storage and a new match keep the rebind; a failed save leaves effective actions and hints on screen, and defaults still go through the editor',()=>{
    const f=fixture(),first=mount(f,new KeyboardBindings(()=>f.store));
    try{
      rebindAndSaveSecondSet(first);
      first.dispose();
      // A new owner reads the same storage; a new match keeps the saved bindings.
      const fresh=new KeyboardBindings(()=>f.store);
      expect(fresh.value).toEqual(SECOND_REBIND);
      const m=mount(f,fresh);
      expect(m.sim.snapshot().tick).toBe(0);
      m.pressKey('g');expect(m.commands[0]).toMatchObject({type:'stop'});m.commands.length=0;
      expect(m.skillButtons()[1]!.textContent).toMatch(/^R /);
      expect(m.helpEl.textContent).toContain('Q/R/E/W');

      // Existing storage-failure double: setItem throws, so apply() must fail.
      f.setFail(true);
      m.open();m.capture('Q','f');expect(fresh.draft.Q).toBe('F');
      m.clickInDialog('[data-binding-save]');
      expect(m.dialog.open).toBe(true);
      expect(m.status()).toContain('Could not save keyboard settings');
      expect(fresh.value.Q).toBe('Q');expect(fresh.draft.Q).toBe('F');
      expect(fresh.value).toEqual(SECOND_REBIND);
      // Repaint from the live snapshot: every hint still shows the effective set, not the draft.
      m.refresh();
      expect(m.skillButtons()[0]!.textContent).toMatch(/^Q /);
      expect(m.skillButtons()[1]!.textContent).toMatch(/^R /);
      expect(m.skillButtons()[3]!.textContent).toMatch(/^W /);
      expect(m.helpEl.textContent).toContain('Q/R/E/W');expect(m.helpEl.textContent).toContain('G: stop');
      expect(m.select.title).toContain('W: Skyfall Seal');
      m.clickInDialog('[data-binding-cancel]');
      expect(fresh.draft).toEqual(fresh.value);

      // Draft never reached gameplay: F is dead, Q and the W<->R swap still work.
      const failedDraftMana=m.sim.snapshot().heroes[0]!.mana;
      m.pressKey('f');m.canvasClick();m.advance(1);expect(m.commands).toHaveLength(0);
      expect(m.sim.snapshot().heroes[0]!.mana).toBeGreaterThanOrEqual(failedDraftMana);
      m.pressKey('q');expect(m.setTargeting).toHaveBeenLastCalledWith('Q');m.canvasClick();
      expect(m.commands[0]).toMatchObject({type:'cast',slot:'Q'});m.commands.length=0;

      // Restore defaults through the editor, then save: no direct JSON or internal field writes.
      f.setFail(false);
      m.open();m.clickInDialog('[data-binding-defaults]');
      expect(fresh.draft).toEqual(DEFAULT_BINDINGS);expect(fresh.value).toEqual(SECOND_REBIND);
      m.clickInDialog('[data-binding-save]');
      expect(fresh.value).toEqual(DEFAULT_BINDINGS);
      expect(f.values.has(BINDINGS_STORAGE_KEY)).toBe(false);
      expect(m.helpEl.textContent).toContain('Q/W/E/R then left-click');
      expect(m.skillButtons()[0]!.textContent).toMatch(/^Q /);expect(m.skillButtons()[1]!.textContent).toMatch(/^W /);
      m.pressKey('s');expect(m.commands[0]).toMatchObject({type:'stop'});
      expect(m.sim.step(m.commands.splice(0))[0]?.accepted).toBe(true);
    }finally{first.editor.dispose();}
  });
});

// Keep the Snapshot type import used so the file type-checks under editors even without emit.
export type _Snapshot=Snapshot;
