'use strict';

let path = require('path');
let spawnjs = require('spawn-js');
let process = spawnjs.process;
let spawn = spawnjs.spawn;


let start = (rootDir)=>{
  spawn(function*(){
    let ret = yield process.exec(path.join(rootDir, 'imdiskinst.exe') + ' -y')
    console.log('Install imdiskinst finished');
  });
}

start(__dirname);