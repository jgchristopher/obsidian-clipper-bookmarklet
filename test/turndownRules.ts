//import TurndownService from 'turndown';
let TurndownService = require('turndown')

let headerCount = 0;

function handleThead(rootNode) {
  let turndownService = new TurndownService();
  turndownService.addRule('thead', {
    filter: function(tableNode, options) {
      if (tableNode.nodeName === 'THEAD') {
        return true;
      }
      return false;
    },
    replacement: function(content, theadNode, options) {
      return handleTH(theadNode)
    }
  });
  turndownService.remove(['tbody'])

  let theadMD = turndownService.turndown(rootNode);
  let c = "| " + theadMD;
  return c;

}

function handleTbody(rootNode) {
  let turndownService = new TurndownService();
  turndownService.addRule('tbody', {
    filter: function(node, options) {
      if (node.nodeName === 'TBODY') {
        return true;
      }
      return false;
    },
    replacement: function(content, node, options) {
      return handleTR(node)
    }
  });
  turndownService.remove(['thead'])

  let tbodyMd = turndownService.turndown(rootNode);
  return tbodyMd;
}

function handleTH(rootNode) {
  let turndownService = new TurndownService();
  turndownService.addRule('th', {
    filter: function(node, options) {
      return node.nodeName === 'TH';
    },
    replacement: function(content, node, options) {
      headerCount++;
      content = content.replace(/\|+/g, '\\|'); // escape any | characters in the content
      content = content + " | ";
      return content;
    }
  });
  let md = turndownService.turndown(rootNode)
  md = md.trim().replace(/\n\r/g, '').replace(/\n/g, "");
  return md;
}

function handleTR(rootNode) {
  // This should take each TR and parse out the TD
  let turndownService = new TurndownService();
  turndownService.addRule('tr', {
    filter: function(node, options) {
      return node.nodeName === 'TR';
    },
    replacement: function(content, node, options) {
      let md = handleTD(node)
      return md + "|  \r\n";
    }
  });

  let md = turndownService.turndown(rootNode);
  return md;
}

function handleTD(trNode) {
  let turndownService = new TurndownService();
  turndownService.addRule('td', {
    filter: function(node, options) {
      return node.nodeName === 'TD';
    },
    replacement: function(content, node, options) {
      content = content.replace(/\|+/g, '\\|');
      return `| ${content} `;
    }
  });

  let md = turndownService.turndown(trNode);
  md = md.trim().replace(/\n\r/g, '').replace(/\n/g, "");
  return md;
}

let turndownService = new TurndownService();
turndownService.addRule('tables', {
  filter: function(node, options) {
    return node.nodeName === 'TABLE';
  },
  replacement: function(content, node, options) {
    let head = handleThead(node)
    let body = handleTbody(node);
    let buffer = "|";
    while (headerCount > 0) {
      buffer = buffer + "--|";
      headerCount--
    }
    return `
${head}
${buffer}
${body}  
`;
  }
})

let markdown = turndownService.turndown('<table class="_1B1L1C _2dlQll" tabindex="0"><thead><tr class="_2FzOEz"><th class="_1Ith84" scope="col"><div class="_3D6Vsj"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_3Rmqs8 _2GMChG _3-to_p"><span class="_3Rmqs8 _2GMChG _3-to_p">Tax rate</span></span></p></div></div></div></th><th class="_1Ith84" scope="col"><div class="_3D6Vsj"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_3Rmqs8 _2GMChG _3-to_p"><span class="_3Rmqs8 _2GMChG _3-to_p">Taxable income bracket</span></span></p></div></div></div></th><th class="_1Ith84" scope="col"><div class="_3D6Vsj"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_3Rmqs8 _2GMChG _3-to_p"><span class="_3Rmqs8 _2GMChG _3-to_p">Taxes owed</span></span></p></div></div></div></th></tr></thead><tbody><tr class="_3BaYKd"><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">10%</span></p></div></div></td><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$0 to $22,000.</span></p></div></div></td><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">10% of taxable income.</span></p></div></div></td></tr><tr class="_3BaYKd _2FzOEz"><td class="nCNh6k _2FzOEz"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">12%</span></p></div></div></td><td class="nCNh6k _2FzOEz"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$22,001 to $89,450.</span></p></div></div></td><td class="nCNh6k _2FzOEz"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$2,200 plus 12% of the amount over $22,000.</span></p></div></div></td></tr><tr class="_3BaYKd"><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">22%</span></p></div></div></td><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$89,451 to $190,750.</span></p></div></div></td><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$10,294 plus 22% of the amount over $89,450.</span></p></div></div></td></tr><tr class="_3BaYKd _2FzOEz"><td class="nCNh6k _2FzOEz"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">24%</span></p></div></div></td><td class="nCNh6k _2FzOEz"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$190,751 to $364,200.</span></p></div></div></td><td class="nCNh6k _2FzOEz"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$32,580 plus 24% of the amount over $190,750.</span></p></div></div></td></tr><tr class="_3BaYKd"><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">32%</span></p></div></div></td><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$364,201 to $462,500.</span></p></div></div></td><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$74,208 plus 32% of the amount over $364,200.</span></p></div></div></td></tr><tr class="_3BaYKd _2FzOEz"><td class="nCNh6k _2FzOEz"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">35%</span></p></div></div></td><td class="nCNh6k _2FzOEz"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$462,501 to $693,750.</span></p></div></div></td><td class="nCNh6k _2FzOEz"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$105,664 plus 35% of the amount over $462,500.</span></p></div></div></td></tr><tr class="_3BaYKd"><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">37%</span></p></div></div></td><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$693,751 or more.</span></p></div></div></td><td class="nCNh6k"><div class="OE0NEO fyWLSM _2gpzlo"><div class="OE0NEO fyWLSM"><p class="_2GMChG _3-to_p"><span class="_2GMChG _3-to_p">$186,601.50 + 37% of the amount over $693,750.</span></p></div></div></td></tr></tbody></table>')


console.log(markdown)
// console.log(headerCount)
