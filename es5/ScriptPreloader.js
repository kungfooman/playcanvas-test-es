/**
 * 
 * @param {} callback 
 * @param {*} scripts 
 */

function ScriptPreloader(callback, scripts) {
    this.callback = callback;
    this.scripts = scripts;
    this.done = 0;
    for (var i=0; i<this.scripts.length; i++) {
        var script = this.scripts[i];
        app.assets.loadFromUrl(script, 'script', this.check.bind(this));
    }
}

ScriptPreloader.prototype.check = function() {
    this.done++;
    if (this.scripts.length == this.done) {
        this.callback();
    }
}
