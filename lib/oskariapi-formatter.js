
var md = require('marked');

function changeLog(fileContent) {
    var renderer = new md.Renderer();
    renderer.heading = function (text, level) {
        var clazz = '';
        if(text.indexOf('[add]') != -1) {
            clazz = 'add';
        } else if (text.indexOf('[mod]') != -1) {
            clazz = 'mod'
        } else if (text.indexOf('[rem]') != -1) {
            clazz = 'rem'
        }

        var text = text.replace('[mod]', '');
        text = text.replace('[add]', '');
        text = text.replace('[rem]', '');
        text = text.replace('[rpc]', '<span class="label label-primary rpc">RPC</span>');
        text = text.replace('[breaking]', '<span class="label label-primary breaking">NOT BACKWARDS COMPATIBLE</span>');

        return '<h' + level + ' class=' +  clazz + '>' + text + '</h' + level + '>';
    }

    var formatted = md(fileContent, { renderer: renderer });
    return formatted;
}

function bundleDoc(fileContent, version, bundle) {
    var renderer = new md.Renderer();
    // https://github.com/markedjs/marked
    var origImage = renderer.image;
    var origHeading = renderer.heading;
    var RPC_BADGE = '<span class="label label-primary rpc">RPC</span>';
    renderer.heading = function(...args) {
        if(!args[0]) {
            return '';
        }
        var formatted = origHeading.apply(renderer, args);
        return formatted.replace('[rpc]', RPC_BADGE).replace('[RPC]', RPC_BADGE);
    };
    renderer.image = function(...args) {
        // href like toolbar.png
        // override it to use the versioned url prefixed with /apires
        args[0] = '/apires/' + version + '/' + bundle + '/' + args[0];
        return origImage.apply(renderer, args);
    };
    var content = md(fileContent, { renderer: renderer });
    return content;
}

function bundleDescription(content) {
    var tokens = md.lexer(content);
    var firstHeading = tokens.find((token) => token.type === 'heading') || {text : ''};
    var firstText = tokens.find((token) => token.type === 'paragraph') || {text : ''};

    var isRpcEnabled = firstHeading.text.toLowerCase().indexOf('[rpc]') !== -1;
    var value =  {
        name : firstHeading.text.replace('[rpc]', '').replace('[RPC]', ''),
        desc : firstText.text,
        rpc : isRpcEnabled
    };
    return value;
}

module.exports = {
    bundle : bundleDoc,
    log : changeLog,
    getBundleDescription : bundleDescription
}