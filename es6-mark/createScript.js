import * as pc from 'playcanvas';
/**
 * @typedef {object} ScriptArgs
 * @property {boolean} [enabled]
 * @property {any} [attributes]
 * @property {boolean} [preloading]
 * @property {number} [ind]
 */
/**
 * @todo PR to bring registerName into pc?
 * @param {pc.Entity} entity 
 * @param {typeof pc.ScriptType} script 
 * @param {ScriptArgs} [args]
 * @returns 
 */
export function createScript(entity, script, args) {
  if (!entity) {
    console.warn("createScript> no entity");
    return;
  }
  if (!entity.script) {
    entity.addComponent('script');
  }
  if (!script.registerName) {
    console.warn("createScript> demanding script.registerName for ", script);
    return;
  }
  if (!pc.app.scripts.has(script)) {
    pc.registerScript(script, script.registerName);
  }
  return entity.script.create(script.registerName, args);
}
