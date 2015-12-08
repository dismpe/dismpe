'use strict';

const path = require('path');
const fs = require('fs');
const spawnjs = require('spawn-js');
const process = spawnjs.process;
const spawn = spawnjs.spawn;

const ALPHABET = 'ABCDEFGHIJKLMOPQRSTUVWXYZ';
let getDevice = ()=>{
  let finalDevice = null;
  for (let ascii of ALPHABET) {
    finalDevice = ascii + ':';
    if (!fs.existsSync(finalDevice + '/')) {
      break;
    }
  }
  return finalDevice;
}

let start = (rootDir, options)=>{
  spawn(function*(){
    let ret;
    let defaultOption = {
      cwd: rootDir,
      echo: true,
      echoStdout: true,
      echoError: true,
    }
    //ret = yield process.exec(path.join(rootDir, 'imdiskinst.exe') + ' -y')
    console.log('Install imdiskinst finished')

    ret = yield process.exec(`imdisk -l -n`)
    for (let unit of ret.stdout.split(/[\r\n]/gmi)) {
      if (unit.trim().length > 0) {
        yield process.exec(`imdisk -D -u ${unit}`, defaultOption)
      }
    }

    const osDevice = getDevice();
    yield process.exec(`imdisk -a -f ${options.osPath} -m ${osDevice}`, defaultOption);
    const patchDevice = getDevice();
    yield process.exec(`imdisk -a -f ${options.patchPath} -m ${patchDevice}`, defaultOption);
    
  }).catch((e)=>{
    console.log(e + e.stack);
  });
}

start(__dirname, {
  osPath: 'Win7/en_windows_7_ultimate_with_sp1_x64_dvd_u_677332-backup.iso',
  patchPath: 'Win7/Windows-KB913086-201511.iso',
});