const start = require('./src/dsimpe.js');

let options = {
  rootDir: __dirname,
  osPath: 'Win7/en_windows_7_ultimate_with_sp1_x64_dvd_u_677332-backup.iso',
  patchPath: 'Win7/Windows-KB913086-201511.iso',
  forceMount: false,
  mountDir: 'C:/Win7/mount',
  wimDir: 'C:/Win7',
  arch: 'x64',
  lang: 'enu',
  addPackage: false,
  commit: false,
  ieLang: 'en-us',
  udpateType:' WHDownloader', //[WHDownloader|wsusoffline]
}
start(options);