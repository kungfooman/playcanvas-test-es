/* jshint esversion: 6 */

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
        
        container.style.position = 'absolute';
        container.style.height = '100%';
        container.style.left = '0px';
        container.style.top = '0px';
        
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
            { v: 8, t: 'Contact Points' },
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
    
    setMedia() {
        if (!this.html) {
            console.warn("ui.js: this.html is missing");
            return;
        }
        this.media.innerHTML = this.html.resource || '';
    }

    setProfile() {
        let image;
        if (this.profile && this.profile.loaded) {
            const url = this.profile.getFileUrl();
            image = document.createElement('img');
            image.src = url;
            image.width = 70;
        } else {
            console.warn("ui.js: profile is missing");
            return;
        }
        const avatar = document.getElementById('avatar');
        if (avatar) {
            avatar.appendChild(image);
            avatar.style['text-align'] = 'center';
        } else {
            console.warn("ui.js: avatar not found");
            return;
        }
    }

    addMediaInfo() {
        const { Container } = pcui;
        
        const container = new Container({
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

}

pc.registerScript(Ui, 'ui');

Ui.attributes.add('html', { type: 'asset', assetType: 'html' });
Ui.attributes.add('profile', { type: 'asset', assetType: 'texture' });
