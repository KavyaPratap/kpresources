document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // 1. ADVANCED PREVIEW ENGINE (Fixes "Square Box" issue)
    // =========================================
    function getPreviewHTML(prop, cssCode) {
        // Extract just the CSS rules (remove selector and braces)
        const rules = cssCode.replace(/^[^{]+{/, '').replace(/}$/, '').trim();
        
        // 1. TYPOGRAPHY (Show text, not a box)
        const typeProps = ['color', 'font', 'text', 'line-height', 'letter-spacing', 'word', 'decoration', 'direction', 'white-space'];
        if (typeProps.some(p => prop.includes(p))) {
            return `
                <style>.demo-text { ${rules} font-size: 1.5rem; background: #2d2d44; padding: 20px; border-radius: 8px; }</style>
                <div class="demo-text">
                    The quick brown fox jumps over the lazy dog.<br>
                    <strong>1234567890</strong>
                </div>`;
        }

        // 2. FLEXBOX (Show Container + Children)
        const flexProps = ['flex', 'justify', 'align', 'gap', 'order', 'wrap'];
        if (flexProps.some(p => prop.includes(p))) {
            return `
                <style>
                    .flex-parent { ${rules} min-height: 150px; background: #2d2d44; border: 2px dashed #6c63ff; padding: 10px; }
                    .flex-child { width: 50px; height: 50px; background: #ff6b6b; margin: 5px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 1px solid white; }
                    .flex-child:nth-child(2) { background: #4ecdc4; height: 70px; } /* Vary height for align-items demo */
                    .flex-child:nth-child(3) { background: #ffe66d; }
                </style>
                <div class="flex-parent">
                    <div class="flex-child">1</div>
                    <div class="flex-child">2</div>
                    <div class="flex-child">3</div>
                </div>
                <p style="font-size:0.8rem; color:#aaa; margin-top:5px;">* Dashed Box is the Parent Container</p>`;
        }

        // 3. GRID (Show Grid Cells)
        const gridProps = ['grid', 'template', 'column', 'row', 'place', 'area'];
        if (gridProps.some(p => prop.includes(p))) {
            // Check if code applies to parent or child
            if(prop.includes('column') || prop.includes('row') || prop.includes('area') || prop.includes('self')) {
                // Child Demo
                return `
                <style>
                    .grid-parent { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #2d2d44; padding: 10px; }
                    .grid-child { background: #4ecdc4; padding: 20px; text-align: center; border: 1px solid white; opacity: 0.5; }
                    .target { ${rules} background: #ff6b6b; opacity: 1; font-weight: bold; }
                </style>
                <div class="grid-parent">
                    <div class="grid-child">1</div>
                    <div class="grid-child target">Target</div>
                    <div class="grid-child">3</div>
                    <div class="grid-child">4</div>
                </div>`;
            } else {
                // Parent Demo
                return `
                <style>
                    .grid-parent { ${rules} background: #2d2d44; border: 2px dashed #6c63ff; padding: 10px; min-height: 150px; }
                    .grid-child { background: #ff6b6b; padding: 15px; border: 1px solid white; text-align: center; }
                    .grid-child:nth-child(even) { background: #4ecdc4; }
                </style>
                <div class="grid-parent">
                    <div class="grid-child">1</div><div class="grid-child">2</div>
                    <div class="grid-child">3</div><div class="grid-child">4</div>
                    <div class="grid-child">5</div><div class="grid-child">6</div>
                </div>`;
            }
        }

        // 4. POSITIONING (Show Context)
        const posProps = ['position', 'top', 'left', 'right', 'bottom', 'z-index'];
        if (posProps.some(p => prop.includes(p))) {
            return `
                <style>
                    .pos-parent { position: relative; height: 150px; background: #2d2d44; border: 2px solid #fff; }
                    .pos-box { ${rules} width: 60px; height: 60px; background: #ff6b6b; display: flex; align-items: center; justify-content: center; border: 1px solid white; }
                </style>
                <div class="pos-parent">
                    <div class="pos-box">Box</div>
                    <div style="position:absolute; bottom:5px; right:5px; font-size:0.8rem; opacity:0.5;">Parent (Relative)</div>
                </div>`;
        }

        // 5. ANIMATIONS & TRANSFORMS
        const animProps = ['transition', 'transform', 'animation', 'rotate', 'scale'];
        if (animProps.some(p => prop.includes(p))) {
            return `
                <style>
                    .anim-box { 
                        ${rules} 
                        width: 80px; height: 80px; background: linear-gradient(135deg, #6c63ff, #ff6b6b); 
                        margin: 40px auto; display: flex; align-items: center; justify-content: center;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    }
                    /* Add hover effect for transitions */
                    .anim-box:hover { transform: scale(1.2) rotate(10deg); filter: brightness(1.2); }
                </style>
                <div class="anim-box">Hover Me</div>`;
        }

        // 6. DEFAULT BOX (Width, Height, Border, Margin, etc.)
        return `
            <style>
                .def-box { 
                    ${rules} 
                    /* Fallbacks so box is visible if rule doesn't set size/color */
                    background-color: ${prop.includes('background') ? '' : '#6c63ff'};
                    width: ${prop.includes('width') ? '' : '100px'};
                    height: ${prop.includes('height') ? '' : '100px'};
                    border: ${prop.includes('border') ? '' : '1px solid white'};
                    display: flex; align-items: center; justify-content: center;
                }
            </style>
            <div class="def-box">Box</div>
        `;
    }

    // =========================================
    // 2. DATASETS
    // =========================================
    const tagGroups = {
        "1. Root & Metadata": ["html", "head", "title", "base", "link", "meta", "style"],
        "2. Scripting": ["script", "noscript", "canvas"],
        "3. Structure": ["body", "header", "footer", "main", "section", "article", "nav", "aside", "h1", "h2", "h3", "h4", "h5", "h6", "hgroup", "address"],
        "4. Text Content": ["p", "hr", "pre", "blockquote", "ol", "ul", "li", "dl", "dt", "dd", "figure", "figcaption", "div", "menu", "search"],
        "5. Inline Semantics": ["a", "em", "strong", "small", "s", "cite", "q", "dfn", "abbr", "ruby", "rt", "rp", "data", "time", "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u", "mark", "bdi", "bdo", "span", "br", "wbr"],
        "6. Edits": ["ins", "del"],
        "7. Media": ["picture", "source", "img", "iframe", "embed", "object", "video", "audio", "track", "map", "area"],
        "8. Tables": ["table", "caption", "colgroup", "col", "tbody", "thead", "tfoot", "tr", "td", "th"],
        "9. Forms": ["form", "label", "input", "button", "select", "datalist", "optgroup", "option", "textarea", "output", "progress", "meter", "fieldset", "legend"],
        "10. Interactive": ["details", "summary", "dialog"],
        "11. Components": ["slot", "template"]
    };

    const tagData = {
        'html': { d: 'Root element', c: `<!DOCTYPE html>\n<html lang="en">\n <body>...</body>\n</html>` },
        'head': { d: 'Metadata container', c: `<head>\n <title>Title</title>\n</head>` },
        'title': { d: 'Page Title', c: `<title>My Page</title>` },
        'base': { d: 'Base URL', c: `<base href="/" target="_blank">` },
        'link': { d: 'Link resource', c: `<link rel="stylesheet" href="style.css">` },
        'meta': { d: 'Metadata', c: `<meta charset="UTF-8">` },
        'style': { d: 'Internal CSS', c: `<style>body{color:red}</style>` },
        'script': { d: 'Script', c: `<script>console.log("Hi")<\/script>` },
        'noscript': { d: 'No-script', c: `<noscript>Enable JS</noscript>` },
        'canvas': { d: 'Canvas', c: `<canvas id="c"></canvas>` },
        'body': { d: 'Body', c: `<body>Content</body>` },
        'header': { d: 'Header', c: `<header>Logo</header>` },
        'footer': { d: 'Footer', c: `<footer>(c) 2023</footer>` },
        'main': { d: 'Main', c: `<main>Content</main>` },
        'section': { d: 'Section', c: `<section>...</section>` },
        'article': { d: 'Article', c: `<article>Blog</article>` },
        'nav': { d: 'Nav', c: `<nav><a href="#">Link</a></nav>` },
        'aside': { d: 'Aside', c: `<aside>Sidebar</aside>` },
        'address': { d: 'Address', c: `<address>Contact...</address>` },
        'h1': { d: 'Heading 1', c: `<h1>Title</h1>` },
        'h2': { d: 'Heading 2', c: `<h2>Title</h2>` },
        'h3': { d: 'Heading 3', c: `<h3>Title</h3>` },
        'h4': { d: 'Heading 4', c: `<h4>Title</h4>` },
        'h5': { d: 'Heading 5', c: `<h5>Title</h5>` },
        'h6': { d: 'Heading 6', c: `<h6>Title</h6>` },
        'hgroup': { d: 'H-Group', c: `<hgroup><h1>T</h1><h2>S</h2></hgroup>` },
        'p': { d: 'Paragraph', c: `<p>Text</p>` },
        'hr': { d: 'Thematic Break', c: `<hr>` },
        'pre': { d: 'Preformatted', c: `<pre>  Space</pre>` },
        'blockquote': { d: 'Blockquote', c: `<blockquote>Quote</blockquote>` },
        'ol': { d: 'Ordered List', c: `<ol><li>1</li></ol>` },
        'ul': { d: 'Unordered List', c: `<ul><li>.</li></ul>` },
        'li': { d: 'List Item', c: `<li>Item</li>` },
        'dl': { d: 'Desc List', c: `<dl><dt>T</dt><dd>D</dd></dl>` },
        'dt': { d: 'Term', c: `<dt>Term</dt>` },
        'dd': { d: 'Description', c: `<dd>Desc</dd>` },
        'figure': { d: 'Figure', c: `<figure><img src="x.jpg"><figcaption>Cap</figcaption></figure>` },
        'figcaption': { d: 'Fig Caption', c: `<figcaption>Cap</figcaption>` },
        'div': { d: 'Div', c: `<div>Content</div>` },
        'menu': { d: 'Menu', c: `<menu><li><button>X</button></li></menu>` },
        'search': { d: 'Search', c: `<search><form>...</form></search>` },
        'a': { d: 'Anchor', c: `<a href="#">Link</a>` },
        'em': { d: 'Emphasis', c: `<em>Italic</em>` },
        'strong': { d: 'Strong', c: `<strong>Bold</strong>` },
        'small': { d: 'Small', c: `<small>Txt</small>` },
        's': { d: 'Strikethrough', c: `<s>Old</s>` },
        'cite': { d: 'Cite', c: `<cite>Book</cite>` },
        'q': { d: 'Quote', c: `<q>Hi</q>` },
        'dfn': { d: 'Definition', c: `<dfn>HTML</dfn>` },
        'abbr': { d: 'Abbreviation', c: `<abbr title="X">X</abbr>` },
        'ruby': { d: 'Ruby', c: `<ruby>漢<rt>kan</rt></ruby>` },
        'rt': { d: 'Ruby Text', c: `<rt>txt</rt>` },
        'rp': { d: 'Ruby Paren', c: `<rp>(</rp>` },
        'data': { d: 'Data', c: `<data value="1">One</data>` },
        'time': { d: 'Time', c: `<time>2023</time>` },
        'code': { d: 'Code', c: `<code>var x</code>` },
        'var': { d: 'Variable', c: `<var>x</var>` },
        'samp': { d: 'Sample', c: `<samp>Out</samp>` },
        'kbd': { d: 'Keyboard', c: `<kbd>Ctrl</kbd>` },
        'sub': { d: 'Subscript', c: `H<sub>2</sub>` },
        'sup': { d: 'Superscript', c: `x<sup>2</sup>` },
        'i': { d: 'Italic', c: `<i>Txt</i>` },
        'b': { d: 'Bold', c: `<b>Txt</b>` },
        'u': { d: 'Underline', c: `<u>Txt</u>` },
        'mark': { d: 'Mark', c: `<mark>Hi</mark>` },
        'bdi': { d: 'BiDi Isolate', c: `<bdi>User</bdi>` },
        'bdo': { d: 'BiDi Override', c: `<bdo dir="rtl">Txt</bdo>` },
        'span': { d: 'Span', c: `<span>Txt</span>` },
        'br': { d: 'Break', c: `<br>` },
        'wbr': { d: 'Word Break', c: `Word<wbr>Break` },
        'ins': { d: 'Inserted', c: `<ins>New</ins>` },
        'del': { d: 'Deleted', c: `<del>Old</del>` },
        'picture': { d: 'Picture', c: `<picture><img src="x.jpg"></picture>` },
        'source': { d: 'Source', c: `<source src="x">` },
        'img': { d: 'Image', c: `<img src="x.jpg" alt="x">` },
        'iframe': { d: 'Iframe', c: `<iframe src="url"></iframe>` },
        'embed': { d: 'Embed', c: `<embed src="x">` },
        'object': { d: 'Object', c: `<object data="x"></object>` },
        'video': { d: 'Video', c: `<video src="v.mp4"></video>` },
        'audio': { d: 'Audio', c: `<audio src="a.mp3"></audio>` },
        'track': { d: 'Track', c: `<track src="s.vtt">` },
        'map': { d: 'Map', c: `<map name="x"><area></map>` },
        'area': { d: 'Area', c: `<area coords="0,0,10,10">` },
        'table': { d: 'Table', c: `<table><tr><td>D</td></tr></table>` },
        'caption': { d: 'Caption', c: `<caption>Title</caption>` },
        'colgroup': { d: 'Colgroup', c: `<colgroup><col></colgroup>` },
        'col': { d: 'Col', c: `<col style="background:red">` },
        'tbody': { d: 'Tbody', c: `<tbody>...</tbody>` },
        'thead': { d: 'Thead', c: `<thead>...</thead>` },
        'tfoot': { d: 'Tfoot', c: `<tfoot>...</tfoot>` },
        'tr': { d: 'Row', c: `<tr>...</tr>` },
        'td': { d: 'Cell', c: `<td>Data</td>` },
        'th': { d: 'Header Cell', c: `<th>Head</th>` },
        'form': { d: 'Form', c: `<form><input></form>` },
        'label': { d: 'Label', c: `<label>Name</label>` },
        'input': { d: 'Input', c: `<input type="text">` },
        'button': { d: 'Button', c: `<button>Click</button>` },
        'select': { d: 'Select', c: `<select><option>A</option></select>` },
        'datalist': { d: 'Datalist', c: `<datalist id="x"><option>A</option></datalist>` },
        'optgroup': { d: 'Optgroup', c: `<optgroup label="G"><option>O</option></optgroup>` },
        'option': { d: 'Option', c: `<option>O</option>` },
        'textarea': { d: 'Textarea', c: `<textarea>...</textarea>` },
        'output': { d: 'Output', c: `<output>0</output>` },
        'progress': { d: 'Progress', c: `<progress value="5" max="10"></progress>` },
        'meter': { d: 'Meter', c: `<meter value="0.5"></meter>` },
        'fieldset': { d: 'Fieldset', c: `<fieldset><legend>T</legend></fieldset>` },
        'legend': { d: 'Legend', c: `<legend>Title</legend>` },
        'details': { d: 'Details', c: `<details><summary>T</summary></details>` },
        'summary': { d: 'Summary', c: `<summary>Title</summary>` },
        'dialog': { d: 'Dialog', c: `<dialog open>Hi</dialog>` },
        'slot': { d: 'Slot', c: `<slot></slot>` },
        'template': { d: 'Template', c: `<template></template>` }
    };

    const cssGroups = {
        "1. Box Model & Layout": ["width", "height", "margin", "padding", "border", "box-sizing", "display", "position", "top", "left", "right", "bottom", "z-index", "float", "clear", "overflow", "visibility", "min-width", "max-width", "min-height", "max-height"],
        "2. Typography": ["color", "font-size", "font-family", "font-weight", "text-align", "line-height", "text-decoration", "text-transform", "letter-spacing", "word-spacing", "text-indent", "white-space", "word-break", "text-shadow", "font-style", "vertical-align", "direction"],
        "3. Backgrounds": ["background", "background-color", "background-image", "background-size", "background-position", "background-repeat", "opacity", "box-shadow", "background-attachment"],
        "4. Flexbox (Parent)": ["flex-direction", "justify-content", "align-items", "flex-wrap", "align-content", "gap"],
        "5. Flexbox (Children)": ["flex", "flex-basis", "flex-grow", "flex-shrink", "order", "align-self"],
        "6. Grid": ["grid-template-columns", "grid-template-rows", "grid-template-areas", "grid-auto-flow", "place-items", "place-content", "grid-column", "grid-row", "grid-area", "place-self"],
        "7. Borders & Outlines": ["border-radius", "border-width", "border-style", "border-color", "outline", "outline-offset", "border-collapse", "border-spacing"],
        "8. Animation": ["transition", "transform", "animation", "animation-delay", "animation-duration", "animation-iteration-count", "animation-direction", "animation-timing-function"],
        "9. Advanced": ["filter", "backdrop-filter", "clip-path", "cursor", "pointer-events", "user-select", "object-fit"]
    };

    const propertyData = {
        'width': { d: 'Width', c: 'div { width: 50%; }' },
        'height': { d: 'Height', c: 'div { height: 120px; }' },
        'margin': { d: 'Outer space', c: 'div { margin: 20px; }' },
        'padding': { d: 'Inner space', c: 'div { padding: 20px; }' },
        'border': { d: 'Border', c: 'div { border: 5px solid red; }' },
        'box-sizing': { d: 'Box model', c: 'div { box-sizing: border-box; padding: 20px; width: 100%; border: 5px solid blue; }' },
        'display': { d: 'Display', c: 'div { display: inline-block; width: 50px; height: 50px; }' },
        'position': { d: 'Position', c: 'div { position: relative; top: 20px; left: 20px; }' },
        'top': { d: 'Top offset', c: 'div { position: relative; top: 30px; }' },
        'left': { d: 'Left offset', c: 'div { position: relative; left: 30px; }' },
        'right': { d: 'Right offset', c: 'div { position: absolute; right: 0; }' },
        'bottom': { d: 'Bottom offset', c: 'div { position: absolute; bottom: 0; }' },
        'z-index': { d: 'Stack order', c: 'div { position: relative; z-index: 10; top: -10px; }' },
        'float': { d: 'Float', c: 'div { float: right; }' },
        'clear': { d: 'Clear', c: 'div { clear: both; }' },
        'overflow': { d: 'Overflow', c: 'div { overflow: scroll; height: 50px; }' },
        'visibility': { d: 'Visibility', c: 'div { visibility: hidden; }' },
        'min-width': { d: 'Min Width', c: 'div { min-width: 200px; }' },
        'max-width': { d: 'Max Width', c: 'div { max-width: 300px; width: 100%; }' },
        'min-height': { d: 'Min Height', c: 'div { min-height: 100px; }' },
        'max-height': { d: 'Max Height', c: 'div { max-height: 50px; overflow: auto; }' },
        'color': { d: 'Color', c: 'p { color: #ff6b6b; }' },
        'font-size': { d: 'Font Size', c: 'p { font-size: 24px; }' },
        'font-family': { d: 'Font Family', c: 'p { font-family: monospace; }' },
        'font-weight': { d: 'Weight', c: 'p { font-weight: bold; }' },
        'font-style': { d: 'Style', c: 'p { font-style: italic; }' },
        'text-align': { d: 'Align', c: 'p { text-align: center; }' },
        'line-height': { d: 'Line Height', c: 'p { line-height: 2.5; }' },
        'text-decoration': { d: 'Decoration', c: 'p { text-decoration: underline; }' },
        'text-transform': { d: 'Transform', c: 'p { text-transform: uppercase; }' },
        'letter-spacing': { d: 'Letter Space', c: 'p { letter-spacing: 5px; }' },
        'word-spacing': { d: 'Word Space', c: 'p { word-spacing: 20px; }' },
        'text-indent': { d: 'Indent', c: 'p { text-indent: 50px; }' },
        'white-space': { d: 'White Space', c: 'p { white-space: nowrap; overflow: hidden; }' },
        'word-break': { d: 'Word Break', c: 'p { word-break: break-all; width: 50px; }' },
        'text-shadow': { d: 'Shadow', c: 'h1 { text-shadow: 2px 2px 4px #000; }' },
        'background': { d: 'Background', c: 'div { background: linear-gradient(45deg, red, blue); }' },
        'background-color': { d: 'Bg Color', c: 'div { background-color: #6c63ff; }' },
        'background-image': { d: 'Bg Image', c: 'div { background-image: url("https://via.placeholder.com/150"); }' },
        'background-size': { d: 'Bg Size', c: 'div { background-image: url("https://via.placeholder.com/50"); background-size: cover; }' },
        'opacity': { d: 'Opacity', c: 'div { opacity: 0.5; background: red; }' },
        'box-shadow': { d: 'Box Shadow', c: 'div { box-shadow: 10px 10px 5px grey; background: white; }' },
        'flex-direction': { d: 'Flex Dir', c: 'div { display: flex; flex-direction: column; }' },
        'justify-content': { d: 'Justify', c: 'div { display: flex; justify-content: center; }' },
        'align-items': { d: 'Align', c: 'div { display: flex; align-items: center; }' },
        'flex-wrap': { d: 'Wrap', c: 'div { display: flex; flex-wrap: wrap; width: 100px; }' },
        'gap': { d: 'Gap', c: 'div { display: flex; gap: 20px; }' },
        'flex': { d: 'Flex', c: '.parent { display: flex; } .child { flex: 1; }' },
        'order': { d: 'Order', c: 'div { order: -1; }' },
        'grid-template-columns': { d: 'Grid Cols', c: 'div { display: grid; grid-template-columns: 1fr 2fr; }' },
        'grid-template-rows': { d: 'Grid Rows', c: 'div { display: grid; grid-template-rows: 50px auto; }' },
        'place-items': { d: 'Place Items', c: 'div { display: grid; place-items: center; }' },
        'border-radius': { d: 'Radius', c: 'div { border-radius: 50%; }' },
        'transition': { d: 'Transition', c: 'div { transition: all 0.5s; background: red; } div:hover { width: 100%; }' },
        'transform': { d: 'Transform', c: 'div { transform: rotate(45deg); }' },
        'animation': { d: 'Animation', c: 'div { animation: spin 2s infinite; }' },
        'filter': { d: 'Filter', c: 'img { filter: grayscale(100%); }' },
        'cursor': { d: 'Cursor', c: 'div { cursor: pointer; }' }
    };

    // =========================================
    // 3. GENERATE TABLES
    // =========================================
    
    // HTML Table
    const htmlTable = document.getElementById('htmlTableBody');
    if(htmlTable) {
        htmlTable.innerHTML = '';
        for (const [group, tags] of Object.entries(tagGroups)) {
            const grpRow = document.createElement('tr');
            grpRow.className = 'group-header';
            grpRow.innerHTML = `<td colspan="3" style="background:rgba(108,99,255,0.2); font-weight:bold; text-align:center; color:white;">${group}</td>`;
            htmlTable.appendChild(grpRow);
            tags.forEach(t => {
                if(tagData[t]) {
                    const r = document.createElement('tr');
                    r.className = 'data-row';
                    r.innerHTML = `<td><span class="tag" data-tag="${t}">&lt;${t}&gt;</span></td><td>${tagData[t].d}</td><td>HTML5</td>`;
                    htmlTable.appendChild(r);
                }
            });
        }
    }

    // CSS Table
    const cssTable = document.getElementById('cssTableBody');
    if(cssTable) {
        cssTable.innerHTML = '';
        for (const [group, props] of Object.entries(cssGroups)) {
            const grpRow = document.createElement('tr');
            grpRow.className = 'group-header';
            grpRow.innerHTML = `<td colspan="3" style="background:rgba(41,101,241,0.2); font-weight:bold; text-align:center; color:white;">${group}</td>`;
            cssTable.appendChild(grpRow);
            props.forEach(p => {
                if(propertyData[p]) {
                    const r = document.createElement('tr');
                    r.className = 'data-row';
                    r.innerHTML = `<td><span class="property" data-prop="${p}">${p}</span></td><td>${propertyData[p].d}</td><td>CSS3</td>`;
                    cssTable.appendChild(r);
                }
            });
        }
    }

    // =========================================
    // 4. SEARCH FUNCTIONALITY
    // =========================================
    function setupSearch(inputId, tableBodyId) {
        const input = document.getElementById(inputId);
        if(!input) return;
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const rows = document.querySelectorAll(`#${tableBodyId} tr`);
            rows.forEach(row => {
                if(row.classList.contains('group-header')) row.style.display = term ? 'none' : '';
                else if(row.classList.contains('data-row')) {
                    row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none';
                }
            });
        });
    }
    setupSearch('tagSearch', 'htmlTableBody');
    setupSearch('cssSearch', 'cssTableBody');

    // =========================================
    // 5. MODAL LOGIC
    // =========================================
    const modal = document.getElementById('tagModal');
    const mTitle = document.getElementById('modalTitle');
    const mCode = document.getElementById('codeExample');
    const mPreview = document.getElementById('outputPreview');
    const mExpl = document.getElementById('tagExplanation');

    function openModal(title, code, expl, isCss) {
        modal.style.display = 'flex';
        mTitle.innerText = title;
        mCode.textContent = code;
        mExpl.innerText = expl || 'Example usage.';
        
        if(isCss) {
            // Use Smart Preview Engine
            const prop = title.replace('Property: ', '').trim();
            mPreview.innerHTML = getPreviewHTML(prop, code);
        } else {
            // HTML Preview
            mPreview.innerHTML = `<div style="all:revert; color:#fff; font-family:sans-serif;">${code}</div>`;
        }
        hljs.highlightElement(mCode);
    }

    document.body.addEventListener('click', e => {
        const tag = e.target.closest('.tag');
        const prop = e.target.closest('.property');
        if(tag) {
            const d = tagData[tag.dataset.tag];
            if(d) openModal(`Tag: <${tag.dataset.tag}>`, d.c, d.e, false);
        }
        if(prop) {
            const d = propertyData[prop.dataset.prop];
            if(d) openModal(`Property: ${prop.dataset.prop}`, d.c, d.d, true);
        }
    });

    document.getElementById('closeModal').onclick = () => modal.style.display = 'none';
    window.onclick = e => { if(e.target == modal) modal.style.display = 'none'; };

    // Tabs
    document.querySelectorAll('.tab').forEach(t => {
        t.onclick = () => {
            document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
            t.classList.add('active');
            document.getElementById(t.dataset.tab + '-content').classList.add('active');
        };
    });
});