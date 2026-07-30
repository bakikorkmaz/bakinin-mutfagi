const fs = require('fs');
let code = fs.readFileSync('src/engine.js', 'utf8');

const lastCross = code.lastIndexOf('export const generateCrossMenu');
const firstCross = code.indexOf('export const generateCrossMenu');

if (firstCross !== -1 && lastCross !== -1 && firstCross !== lastCross) {
   const endCross = code.indexOf('export const getDishDetails', firstCross);
   if (endCross !== -1) {
       const commentStart = code.lastIndexOf('//', firstCross);
       code = code.substring(0, commentStart > 0 ? commentStart : firstCross) + code.substring(endCross);
       fs.writeFileSync('src/engine.js', code, 'utf8');
       console.log('Successfully wiped old cross menu!');
   }
} else {
    console.log('No duplication found.');
}
