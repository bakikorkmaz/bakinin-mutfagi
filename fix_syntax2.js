const fs = require('fs');
let c = fs.readFileSync('src/engine.js', 'utf8');
// The patch script accidentally ate "// Baki'nin" leaving "n Mutfağı..." on line 892
// Fix: remove the orphaned line and restore the comment correctly
c = c.replace("        };\nn Mutfag", "        };\n\n// Baki'nin Mutfag");
c = c.replace("        };\nn Mutfa\u011f", "        };\n\n// Baki'nin Mutfa\u011f");
fs.writeFileSync('src/engine.js', c);
console.log('Syntax fix applied');
