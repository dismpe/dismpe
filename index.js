'use strict';

const path = require('path');
const fs = require('fs.extra');
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

// 更新 次序
//http://www.wincert.net/forum/topic/12518-windows-7-x64-and-x86-slipstreamingintegrating-updates-order/
//https://www.ntlite.com/download/
//https://www.raymond.cc/blog/create-an-integrated-up-to-date-windows-7-install-disc/

//额外更新
// 先尝试 没有额外更新，在尝试有额外更新
//D:\Software\OS\Windows-Patches\WHDownloaderv_0.1.0
//Additional Extra
//NDP46-KB3045557-x86-x64-AllOS-ARA.exe /q /extract:ndp466

let dsimWindowsUpdateAgent = function*(wsusClient, defaultOption, options){
  let wsus = `${wsusClient}\\wsus`
  let WindowsUpdateAgentPath = `${wsus}\\WindowsUpdateAgent30`
  fs.removeSync(path.join(options.rootDir, WindowsUpdateAgentPath));
  yield process.exec(`${WindowsUpdateAgentPath}-${options.arch} -x:${WindowsUpdateAgentPath} -q`, defaultOption)
  yield process.exec(`Dism.exe /image:${options.mountDir} /Add-Package /PackagePath:${WindowsUpdateAgentPath}`, defaultOption)
}

const IE_PREFIXES = [
  'ie8',
  'ie9',
  'ie10',
  'ie11',
]

let cloneOption= (option) => {
  return JSON.parse(JSON.stringify(option));
}

let dsimNormalUpdates = function*(wsusClient, defaultOption, options){
  let w61 = `${wsusClient}\\w61`
  if (options.arch !== 'x86') {
    w61 = `${wsusClient}\\w61-${options.arch}`
  }
  const glb = path.join(w61, 'glb');
  const glbPath = path.join(options.rootDir, glb);
  let filenames = fs.readdirSync(glbPath)
  let filenameMap = new Map();
  let files = filenames.map((filename)=>{
    let filePath = path.join(glbPath, filename)
    let value = {
      filename: filename,
      filePath: filePath,
      stat: fs.statSync(filePath)
    };
    filenameMap.set(filename.toLowerCase(), value);
    return value;
  });

  const tmpPaths = {
    ie: path.join(options.rootDir, w61, 'ie-tmp'),
    beforeIE: path.join(options.rootDir, w61, 'before-ie-tmp'),
    afterIE: path.join(options.rootDir, w61, 'after-ie-tmp'),
  }
  for (let k in tmpPaths) {
    fs.mkdirsSync(tmpPaths[k])
  }
  const movedFiles = [];
  const ieFilename = `IE11-Windows6.1-${options.arch}-${options.ieLang}.exe`.toLowerCase()
  const ieFile = filenameMap.get(ieFilename);
  for (let file of files) {
    let pathKey = null;
    for (let prefix of IE_PREFIXES) {
      if (file.filename.toLowerCase().startsWith(prefix)){
        pathKey = 'ie'
        break;
      }
    }
    if (!pathKey) {
      if (file.stat.mtime.getTime()
          < ieFile.stat.mtime.getTime()){
        pathKey = 'beforeIE'
      } else {
        pathKey = 'afterIE'
      }
    }

    let tmpPath = tmpPaths[pathKey]
    movedFiles.push(file)
    file.targetPath = path.join(tmpPath, file.filename);
    if (fs.existsSync(file.targetPath)){
      fs.removeSync(file.targetPath);
    }
    fs.renameSync(file.filePath, file.targetPath);
  }

  try {
    let ieOption = cloneOption(defaultOption);
    let ie11Path = path.join(ieFile.targetPath, 'ie11');
    fs.removeSync(ie11Path);
    ieOption.cwd = path.join(ieFile.targetPath, '..');
    yield process.exec(ieFilename + ' /x:ie11', ieOption)
    for (let path of [tmpPaths.beforeIE, ie11Path, tmpPaths.afterIE]) {
      yield process.exec(`Dism.exe /image:${options.mountDir} /Add-Package /PackagePath:${path}`, defaultOption)
    }
  } finally {
    for (let file of movedFiles) {
      fs.renameSync(file.targetPath, file.filePath);
    }
  }
}


let start = (options)=>{
  spawn(function*(){
    let ret;
    let defaultOption = {
      cwd: options.rootDir,
      echo: true,
      echoStdout: true,
      echoError: true,
    }
    ret = yield process.exec(`where imdisk`)
    if (ret.error) {
      ret = yield process.exec(path.join(options.rootDir, 'imdiskinst.exe') + ' -y')
      console.log('Install imdiskinst finished')
    }

    ret = yield process.exec('imdisk -l -n', {cwd: options.rootDir})
    for (let unit of ret.stdout.split(/[\r\n]/gmi)) {
      if (unit.trim().length > 0) {
        yield process.exec(`imdisk -D -u ${unit}`, defaultOption)
      }
    }

    const osDevice = getDevice();
    yield process.exec(`imdisk -a -f ${options.osPath} -m ${osDevice}`, defaultOption);
    const patchDevice = getDevice();
    yield process.exec(`imdisk -a -f ${options.patchPath} -m ${patchDevice}`, defaultOption);
    let mountPath = path.join(options.mountDir)
    let needMount = true;
    if (fs.existsSync(mountPath)){
      needMount = false;
      if (options.forceMount) {
        yield process.exec(`Dism.exe /Unmount-Wim /discard /MountDir:${options.mountDir}`, defaultOption);
        fs.removeSync(mountPath);
        needMount = true;
      }
    }
    if (needMount) {
      fs.mkdirsSync(mountPath);
      let installWinPath = `${osDevice}\\sources\\install.wim`;
      console.log(installWinPath);
      yield process.exec(`Dism.exe /Mount-Wim /ReadOnly /WimFile:${installWinPath} /Index:4 /MountDir:${options.mountDir}`, defaultOption);
    }

    let wsusClient = `wsusoffline\\client`
    //yield* dsimWindowsUpdateAgent(wsusClient, defaultOption, options);
    yield* dsimNormalUpdates(wsusClient, defaultOption, options);
    
  }).catch((e)=>{
    console.log(e + e.stack);
  });
}

start({
  rootDir: __dirname,
  osPath: 'Win7/en_windows_7_ultimate_with_sp1_x64_dvd_u_677332-backup.iso',
  patchPath: 'Win7/Windows-KB913086-201511.iso',
  forceMount: false,
  mountDir: 'C:/Win7/mount',
  arch: 'x64',
  lang: 'enu',
  ieLang: 'en-us',
});