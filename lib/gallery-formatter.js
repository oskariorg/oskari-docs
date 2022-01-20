const { marked: md } = require('marked');
const fm = require('front-matter')

// See https://marked.js.org/demo/ to check how images are parsed. At version 0.8.2:
//     jee ![Component layers](/images/architecture/components.png) moi
// is parsed as:
//     [{type:"paragraph", text:"jee ![Component layers](/images/architecture/components.png) moi"}]
// but with "master" (branch?) version its paragraph with tokens-array that are additional tokens that can have type: image
// recurse token.tokens to find image -> !!token.tokens.find(child => child.type === 'image');
function galleryDescription(content) {
    var frontMatterMeta = fm(content);
    const minimumKeySet = ['title', 'description', 'image'];
    const galleryItem = {
        ...frontMatterMeta.attributes
    };
    const allGood = minimumKeySet.every(key => galleryItem[key]);
    if (allGood) {
        return galleryItem;
    }
    // parse missing meta from content
    const tokens = md.lexer(frontMatterMeta.body);
    if (!galleryItem.title) {
        const heading = tokens.find((token) => token.type === 'heading') || {text : ''};
        galleryItem.title = heading.text;
    }
    if (!galleryItem.description) {
        const desc = tokens.find((token) => token.type === 'paragraph') || {text : ''};
        galleryItem.description = desc.text;
    }
    if (!galleryItem.image) {
        var firstImage = tokens.find((token) => {
            if (token.type !== 'paragraph' && token.type !== 'html') {
                return false;
            }
            if (!token.text.includes("![") && !token.text.includes("<img ")) {
                return false;
            }
            /* Might be:
            { type: 'paragraph',
            text: 'JEe ![Preview](/images/gallery/asdi.png) aset' }

            OR something like:

            { type: 'paragraph',
            text: '[![Fishing restrictions](http://img.youtube.com/vi/y5WDdfBVE88/0.jpg)](https://youtu.be/y5WDdfBVE88 "Restrictions")' }
            */
            return true;
        });
        galleryItem.image = returnImgSrc(firstImage.text);
    }
    return galleryItem;
}

function returnImgSrc (content)  {
    const mdStart = content.indexOf('![');
    if (mdStart !== -1) {
        const imgStart = content.indexOf('(', mdStart) + 1;
        const imgEnd = content.indexOf(')', mdStart);
        return content.substring(imgStart, imgEnd);
    }
    const idStr = '<img src="';
    const htmlStart = content.toLowerCase().indexOf(idStr);
    if (htmlStart !== -1) {
        const imgStart = htmlStart + idStr.length;
        const imgEnd = content.indexOf('"', imgStart);
        return content.substring(imgStart, imgEnd);
    }
}

function galleryDoc(fileContent, galleryItem) {
    var renderer = new md.Renderer();
    // https://github.com/markedjs/marked
    var origImage = renderer.image;
    renderer.image = function(...args) {
        // href like toolbar.png
        // override it to use the versioned url prefixed with /apires
        //args[0] = '/images/gallery/' + args[0];
        const html = origImage.apply(renderer, args);
        let openTag = html.substring(0, html.lastIndexOf('>'));
        if (openTag.endsWith('/')) {
            openTag = openTag.substring(0, openTag.length -1);
        }
        // add class to images linked with md syntax
        return `${openTag} class="img-responsive" />`;
    };
    var frontMatterMeta = fm(fileContent)
    var content = md(frontMatterMeta.body, { renderer: renderer });
    return content;
}

module.exports = {
    getGalleryDescription : galleryDescription,
    galleryDoc: galleryDoc
}