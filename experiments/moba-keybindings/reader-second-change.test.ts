// @vitest-environment jsdom
// Fresh reader assembly from README wiring and its named source entry points.
import { it, expect, vi } from 'vitest';
import { KeyboardBindings, DEFAULT_BINDINGS, BINDINGS_STORAGE_KEY } from '../../src/input/bindings.js';
import { createControls } from '../../src/input/controls.js';
import { createKeyboardSettings, controlsHelp } from '../../src/ui/keyboard-settings.js';
import { createHud } from '../../src/ui/hud.js';
import { createHeroSelection } from '../../src/ui/hero-selection.js';
import { Simulation } from '../../src/sim/simulation.js';
import type { SimCommand } from '../../src/sim/types.js';
it('independently assembles the second change, lifecycle, consumers and rollback from the guide', () => {
  document.body.innerHTML = '<button id="keyboard-settings"></button><dialog id="keyboard-dialog"></dialog><main></main><select id="hero-select"></select><p id="details"></p><p id="controls-help"></p><canvas tabindex="0"></canvas>';
  const dialog = document.querySelector('dialog')!, trigger = document.querySelector<HTMLButtonElement>('button')!;
  dialog.showModal = () => {
    dialog.open = true;
  };
  dialog.close = () => {
    dialog.open = false;
    dialog.dispatchEvent(new Event('close'));
  };
  const values = new Map<string, string>();
  let writes = 0, removes = 0, fail = false;
  const store = {
    getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => {
      if (fail)
        throw Error('quota');
      writes++;
      values.set(k, v);
    }, removeItem: (k: string) => {
      removes++;
      values.delete(k);
    }
  };
  const names = {
    Q: 'Skill 1', W: 'Skill 2', E: 'Skill 3', R: 'Ultimate', attackMove: 'Attack move', stop: 'Stop', focusCamera: 'Camera'
  };
  const help = document.querySelector('#controls-help')!, select = document.querySelector('select')!, root = document.querySelector('main')!;
  const canvas = document.querySelector('canvas')!;
  const mount = () => {
    const bindings = new KeyboardBindings(() => store);
    const sim = new Simulation({
      seed: 1, contentVersion: 10, heroesPerTeam: 1, navigation: {
        closestPoint: p => ({
          ...p
        }), findPath: (a, b) => ({
          success: true, points: [a, b], reason: null
        })
      }
    });
    const commands: SimCommand[] = [];
    const current = () => {
      const snapshot = sim.snapshot();
      return {
        snapshot, hero: snapshot.heroes[0]!
      };
    };
    const world = {
      canvas, setTargeting: vi.fn(), setPointer: vi.fn(), leavePointer: vi.fn(), aim: () => ({
        point: {
          x: current().hero.position.x + 2, z: current().hero.position.z
        }, entityId: null
      })
    };
    const controls = createControls(world, sim.catalog, current, c => commands.push(c), () => {
    }, () => {
    }, bindings);
    const hud = createHud(root, sim.catalog, s => controls.skill(s), () => {
    }, () => {
    }, bindings);
    const heroes = createHeroSelection(select, document.querySelector('#details')!, sim.catalog, s => bindings.label(s));
    const refresh = () => {
      help.textContent = controlsHelp(bindings);
      heroes.refresh();
      hud.update(sim.snapshot(), current().hero.id);
    };
    const settings = createKeyboardSettings(dialog, trigger, bindings, names, open => {
      commands.length = 0;
      controls.setEnabled(!open && sim.snapshot().status === 'running');
      world.leavePointer();
    }, refresh);
    refresh();
    return {
      bindings, sim, commands, controls, world, refresh, dispose() {
        settings.dispose();
        controls.dispose();
        hud.dispose();
      }
    };
  };
  const button = (selector: string) => document.querySelector<HTMLButtonElement>(selector)!;
  const click = (selector: string) => {
    const b = button(selector);
    b.focus();
    b.click();
  };
  const edit = (action: string, key: string) => {
    click(`[data-binding-action="${action}"]`);
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', {
      key, bubbles: true, cancelable: true
    }));
  };
  const press = (key: string) => document.body.dispatchEvent(new KeyboardEvent('keydown', {
    key, bubbles: true, cancelable: true
  }));
  const pointer = () => canvas.dispatchEvent(new MouseEvent('pointerdown', {
    button: 0, bubbles: true, cancelable: true
  }));
  let m = mount();
  const hints = (keys: string[]) => {
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-skills] button')];
    const def = m.sim.catalog.heroes[m.sim.snapshot().heroes[0]!.definitionId]!;
    for (const [i, slot] of (['Q', 'W', 'E', 'R'] as const).entries()) {
      const ability = m.sim.catalog.abilities[def.abilities[slot]]!;
      expect(buttons[i]!.textContent).toMatch(new RegExp(`^${keys[i]} `));
      expect(buttons[i]!.title.startsWith(`${keys[i]}: `)).toBe(true);
      expect(select.title).toContain(`${keys[i]}: ${ability.name}`);
    }
    expect(help.textContent).toContain(keys.join('/'));
  };
  const cast = (key: string, slot: 'Q' | 'W' | 'R') => {
    press(key);
    pointer();
    expect(m.commands).toHaveLength(1);
    expect(m.commands[0]).toMatchObject({
      type: 'cast', slot
    });
    const mana = m.sim.snapshot().heroes[0]!.mana;
    expect(m.sim.step(m.commands.splice(0))[0]?.accepted).toBe(true);
    expect(m.sim.snapshot().heroes[0]!.mana).toBeLessThan(mana);
    for (let i = 0; i < 60 && m.sim.snapshot().heroes[0]!.castSlot !== null; i++)
      m.sim.step([]);
    expect(m.sim.snapshot().heroes[0]!.castSlot).toBeNull();
  };
  try {
    click('#keyboard-settings');
    edit('Q', 'F');
    click('[data-binding-cancel]');
    expect(m.bindings.value).toEqual(DEFAULT_BINDINGS);
    expect(writes).toBe(0);
    press('F');
    pointer();
    expect(m.commands).toHaveLength(0);
    click('#keyboard-settings');
    edit('W', 'R');
    expect(document.querySelector('[data-binding-status]')!.textContent).toContain('Ultimate');
    expect(m.bindings.draft).toEqual(DEFAULT_BINDINGS);
    click('[data-binding-swap]');
    edit('stop', 'G');
    expect(m.bindings.value).toEqual(DEFAULT_BINDINGS);
    press('S');
    m.controls.skill('Q');
    pointer();
    expect(m.commands).toHaveLength(0);
    click('[data-binding-save]');
    expect(writes).toBe(1);
    expect(dialog.open).toBe(false);
    hints(['Q', 'R', 'E', 'W']);
    expect(help.textContent).toContain('G: stop');
    cast('W', 'R');
    cast('R', 'W');
    press('S');
    expect(m.commands).toHaveLength(0);
    press('G');
    expect(m.commands[0]?.type).toBe('stop');
    expect(m.sim.step(m.commands.splice(0))[0]?.accepted).toBe(true);
    m.dispose();
    m = mount();
    expect(m.sim.snapshot().tick).toBe(0);
    hints(['Q', 'R', 'E', 'W']);
    cast('R', 'W');
    cast('W', 'R');
    const effective = {
      ...m.bindings.value
    }, bytes = values.get(BINDINGS_STORAGE_KEY);
    fail = true;
    click('#keyboard-settings');
    edit('Q', 'F');
    click('[data-binding-save]');
    expect(dialog.open).toBe(true);
    expect(m.bindings.value).toEqual(effective);
    expect(m.bindings.draft.Q).toBe('F');
    expect(values.get(BINDINGS_STORAGE_KEY)).toBe(bytes);
    expect(writes).toBe(1);
    expect(document.querySelector('[data-binding-status]')!.textContent).toContain('Could not save');
    hints(['Q', 'R', 'E', 'W']);
    click('[data-binding-cancel]');
    press('F');
    pointer();
    expect(m.commands).toHaveLength(0);
    cast('Q', 'Q');
    fail = false;
    click('#keyboard-settings');
    click('[data-binding-defaults]');
    expect(m.bindings.value).toEqual(effective);
    expect(removes).toBe(0);
    click('[data-binding-save]');
    expect(removes).toBe(1);
    expect(values.has(BINDINGS_STORAGE_KEY)).toBe(false);
    hints(['Q', 'W', 'E', 'R']);
    press('G');
    expect(m.commands).toHaveLength(0);
    press('S');
    expect(m.commands[0]?.type).toBe('stop');
    expect(m.sim.step(m.commands.splice(0))[0]?.accepted).toBe(true);
  }
  finally {
    m.dispose();
    document.body.replaceChildren();
  }
});
