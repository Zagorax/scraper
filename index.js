const jsdom = require("jsdom");
const rp = require('request-promise-native');
const fs = require("fs");

const url = process.argv[2];
const { JSDOM } = jsdom;

(async function main() {
    var htmlString = await rp(url).catch(err => console.log(err)); //Get request
    
    var dom = new JSDOM(htmlString, { runScripts: 'dangerously', resources: 'usable', url}); //Allow the execution of scripts and other resources -- make sure your site is safe!
    
    await Promise.resolve()
        .then(function() {
            return new Promise(function(resolve) {
                dom.window.onload = function() { //Wait for script to execute
                    resolve(dom);
                }
            })
            .catch(err => resolve(err));
        })
        .then(function(dom) {
            fs.appendFileSync("content/" + "output" + ".html", dom.window.document.querySelector("html").innerHTML); //Write file
        })
        .catch(function(err) {
            console.log(err);
        })
    
    console.log("Done!")
    process.exit()
})()