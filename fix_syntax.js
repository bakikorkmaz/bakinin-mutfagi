const fs = require('fs');
let c = fs.readFileSync('src/SocialFlow.js', 'utf8');
// Fix the duplicated single-quote introduced by earlier regex replacement
c = c.replace("overflow: 'hidden''}", "overflow: 'hidden'}");
fs.writeFileSync('src/SocialFlow.js', c);
console.log('Fixed syntax error in SocialFlow.js');
