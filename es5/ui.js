/* jshint esversion: 6 */

console.log("load ui.js");

class Ui extends pc.ScriptType {
    

    initialize() {
        this.setupMainContainer();
        this.setupMainPane();
        
        this.addRenderSettings();
        this.addDivider();
        this.addMediaInfo();
    }
    
    setupMainContainer() {
        const { Container } = pcui;
        
        const container = new Container({
            grid: true
        });
        
        container.style.position = 'relative';
        container.style.height = '100%';
        container.style.width = '100%';
        
        document.body.appendChild(container.dom);
        
        this.ui = container.dom;
    }
    
    setupMainPane() {
        const { Container, Panel, Label } = pcui;
        
        const panel = new Panel({
            flex: true,
            collapsible: true,
            collapsed: true,
            collapseHorizontally: true,
            removable: false,
            headerText: 'Settings'
        });
        const content = panel.content;
        panel.style.width = '250px';
                
        panel.on('collapse', function() { 
            const element = document.getElementById('twitter');
            if (element) element.style.display = 'none';
        });
        
        panel.on('expand', function() { 
            const element = document.getElementById('twitter');
            if (element) element.style.display = 'block';
        });

        this.ui.appendChild(panel.dom);
        this.pane = content.dom;
    }
    
    addRenderSettings() {
        const { Panel, SelectInput } = pcui;
        
        const panel = new Panel({
            flex: true,
            collapsible: false,
            headerText: 'Render Mode'
        });
        const content = panel.content;

        const options = [
            { v: 0, t: 'Disable' },
            { v: 1, t: 'Wireframe' },
            { v: 2, t: 'Bounding Boxes' },
            { v: 3, t: 'Wireframe + AABB' },
        ];
        const input = new SelectInput({ 
            options,
            value: 1
        });
        
        input.on('change', mode => { this.app.fire('ui:mode-select', mode); });
        
        content.dom.appendChild(input.dom);
        this.pane.appendChild(panel.dom);
    }
    
    addDivider() {
        const { Divider } = pcui;
        
        const divider = new Divider();
        this.pane.appendChild(divider.dom);
    }
    
    addMediaInfo() {
        const { Container } = pcui;
        
        const container = new Container({
            flex: true,
        });
        
        const media = document.createElement('div');
        media.innerHTML = this.html.resource || '';
        
        container.style.marginTop = 'auto';
        container.style.marginBottom = 'auto';
        container.style.marginLeft = 'auto';
        container.style.marginRight = 'auto';
        
        container.dom.appendChild(media);
        
        twttr.widgets.load();
        
        this.pane.appendChild(container.dom);
        
        const url = this.profile.getFileUrl();
        const image = document.createElement('img');
        image.src = url;
        image.width = 70;
        
        const avatar = document.getElementById('avatar');
        avatar.appendChild(image);
        avatar.style['text-align'] = 'center';
    }
    
}

pc.registerScript(Ui, 'ui');

Ui.attributes.add('html', { type: 'asset', assetType: 'html' });
Ui.attributes.add('profile', { type: 'asset', assetType: 'texture' });
