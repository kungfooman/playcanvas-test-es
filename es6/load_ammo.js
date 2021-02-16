import { wasmSupported, loadWasmModuleAsync } from "./wasm-loader.js";

export function load_ammo(callback) {    
    if (wasmSupported()) {
        loadWasmModuleAsync('Ammo', './ammo/ammo.wasm.js', './ammo/ammo.wasm.wasm', callback);
    } else {
        loadWasmModuleAsync('Ammo', './ammo/ammo.js', '', callback);
    }
}
