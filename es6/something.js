var Something = pc.createScript('something');
Something.attributes.add('guid', {
    type: 'string', 
    default: "?-?-?-?-?", 
    title: 'GUID', 
    description: 'Different GUID for every instance'
});
// initialize code called once per entity
Something.prototype.initialize = function() {
    this.guid = pc.guid.create();
    console.log("initialize() guid:", this.guid)
};
Something.prototype.something = function(a, b) {
    console.log("something() guid:", this.guid);
};


camera.addComponent('script');
box1.addComponent('script');
window.scriptSomething1 = camera.script.create("something");
window.scriptSomething2 = box1.script.create("something");