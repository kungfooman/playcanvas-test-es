var Ui = pc.createScript("ui");

Ui.prototype.initialize = function() {
    this.setupMainContainer();
    this.setupMainPane();
    
    this.addRenderSettings();
    this.addDivider();
    this.addMediaInfo();
}

Ui.prototype.setupMainContainer = function() {
    var container = new pcui.Container({
        grid: true
    });
    
    container.style.position = 'absolute';
    container.style.height = '100%';
    container.style.left = '0px';
    container.style.top = '0px';
    
    document.body.appendChild(container.dom);
    
    this.ui = container.dom;
}

Ui.prototype.setupMainPane = function() {
    var panel = new pcui.Panel({
        flex: true,
        collapsible: true,
        collapsed: true,
        collapseHorizontally: true,
        removable: false,
        headerText: 'Settings'
    });
    var content = panel.content;
    panel.style.width = '250px';
            
    panel.on('collapse', function() { 
        var element = document.getElementById('twitter');
        if (element) {
            element.style.display = 'none';
        }
    });
    
    panel.on('expand', function() { 
        var element = document.getElementById('twitter');
        if (element) {
            element.style.display = 'block';
        }
    });

    this.ui.appendChild(panel.dom);
    this.pane = content.dom;
}

Ui.prototype.addRenderSettings = function() {
    var panel = new pcui.Panel({
        flex: true,
        collapsible: false,
        headerText: 'Render Mode'
    });
    var content = panel.content;
    
    var options = [
        { v: 0, t: 'Disable' },
        { v: 1, t: 'Wireframe' },
        { v: 2, t: 'Bounding Boxes' },
        { v: 3, t: 'Wireframe + AABB' },
        { v: 8, t: 'Contact Points' },
    ];
    var input = new pcui.SelectInput({ 
        options,
        value: 1
    });
    
    input.on('change', mode => { this.app.fire('ui:mode-select', mode); });
    
    content.dom.appendChild(input.dom);
    this.pane.appendChild(panel.dom);
}

Ui.prototype.addDivider = function() {
    this.divider = new pcui.Divider();
    this.pane.appendChild(this.divider.dom);
}

Ui.prototype.setMedia = function() {
    if (!this.html) {
        console.warn("ui.js: this.html is missing");
        return;
    }
    this.media.innerHTML = this.html.resource || '';
}

Ui.prototype.setProfile = function() {
    var image;
    if (this.profile && this.profile.loaded) {
        var url = this.profile.getFileUrl();
        image = document.createElement('img');
        image.src = url;
        image.width = 70;
    } else {
        console.warn("ui.js: profile is missing");
        return;
    }
    var avatar = document.getElementById('avatar');
    if (avatar) {
        avatar.appendChild(image);
        avatar.style['text-align'] = 'center';
    } else {
        console.warn("ui.js: avatar not found");
        return;
    }
}

Ui.prototype.addMediaInfo = function() {
    var container = new pcui.Container({
        flex: true,
    });
    
    this.media = document.createElement('div');
    this.setMedia();
    
    container.style.marginTop = 'auto';
    container.style.marginBottom = 'auto';
    container.style.marginLeft = 'auto';
    container.style.marginRight = 'auto';
    
    container.dom.appendChild(this.media);
    
    //twttr.widgets.load();
    
    this.pane.appendChild(container.dom);
    this.setProfile();
}

Ui.attributes.add('html', {
    type: 'asset',
    assetType: 'html'
});

Ui.attributes.add('profile', {
    type: 'asset',
    assetType: 'texture'
});
