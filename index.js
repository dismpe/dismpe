'use strict';

const path = require('path');
const fs = require('fs-extra');
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
// WindowsUpdateAgent-7.6-x64:
//just integrate WUClient-SelfUpdate-ActiveX, WUClient-SelfUpdate-Aux-TopLevel and WUClient-SelfUpdate-Core-TopLevel from Win7SP1 .exe...
//https://www.ntlite.com/forum/discussion/217/help-windows-7-update-agent
//http://www.wincert.net/forum/topic/12518-windows-7-x64-and-x86-slipstreamingintegrating-updates-order/
//https://www.ntlite.com/download/
//https://www.raymond.cc/blog/create-an-integrated-up-to-date-windows-7-install-disc/

//额外更新
// 先尝试 没有额外更新，在尝试有额外更新
//D:\Software\OS\Windows-Patches\WHDownloaderv_0.1.0
//Additional Extra
//NDP46-KB3045557-x86-x64-AllOS-ARA.exe /q /extract:ndp466

const IE_PREFIXES = [
  'ie8',
  'ie9',
  'ie10',
  'ie11',
]

const IE_PACKAGE_PREFIEXES = [
  'IE-Win7.CAB',
  // Accoding to http://iboyd.net/index.php/2013/01/04/applying-kb2506143-to-an-offline-windows-7-sp1-wim-windows-setup-fail/
  //IE_SUPPORT_amd64_en-US should be deleted
  //'IE_SUPPORT_',
  'IE-Spelling-',
  'IE-Hyphenation-',
];

let cloneOption= (option) => {
  return JSON.parse(JSON.stringify(option));
}

let extractFile = (file, defaultOption) => {
  let targetPath = path.dirname(path.dirname(file.targetPath))
  file.extractPath = path.join(targetPath, file.id  +  '.x');
  fs.removeSync(file.extractPath);
  return process.exec(`"${file.targetPath}" -x:${file.extractPath} -q`, defaultOption)
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
  let id = 0;
  let files = filenames.map((filename)=>{
    let filePath = path.join(glbPath, filename)
    let filenameParts = filename.split('-');
    let kbPart = 'kb0000000'
    for (let part of filenameParts) {
      part = part.toLowerCase();
      if (part.length === kbPart.length && part.startsWith('kb')) {
        kbPart = part;
        break;
      }
    }
    let value = {
      id: id.toString(),
      filename: filename,
      filePath: filePath,
      kbPart: kbPart,
      stat: fs.statSync(filePath)
    };
    id = id + 1;
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
  const ieFilename = `IE11-Windows6.1-${options.arch}-${options.ieLang}.exe`.toLowerCase()
  const ieFile = filenameMap.get(ieFilename);
  let WindowsUpdateAgentFile = null;
  for (let file of files) {
    let pathKey = null;
    for (let prefix of IE_PREFIXES) {
      let filename = file.filename.toLowerCase();
      if (filename.startsWith('ie11') && filename.endsWith('.cab')) {
        break;
      }
      if (filename.startsWith('WindowsUpdateAgent-'.toLowerCase())) {
        pathKey = 'ie'
        WindowsUpdateAgentFile = file;
        break;
      }
      if (filename.startsWith(prefix) || filename.endsWith('.exe')) {
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

    file.pathKey = pathKey;
    file.tmpPath = tmpPaths[pathKey]
    file.targetPath = file.filePath;
    /*
    file.targetPath = path.join(file.tmpPath, file.filename);
    if (fs.existsSync(file.targetPath)){
      fs.removeSync(file.targetPath);
    }
    fs.renameSync(file.filePath, file.targetPath);
    */
  }

  try {
    yield extractFile(WindowsUpdateAgentFile, defaultOption);
    let wuaWin7Sp1File = {
      id: id.toString(),
      targetPath: path.join(WindowsUpdateAgentFile.extractPath, 'WUA-Win7SP1.exe')
    }

    yield extractFile(wuaWin7Sp1File, defaultOption);
    WindowsUpdateAgentFile.extractPath = wuaWin7Sp1File.extractPath;

    yield extractFile(ieFile, defaultOption);
    ieFile.kbPart = 'kb2841134';
    ieFile.packagePaths = [];
    let ieFilenames =  fs.readdirSync(ieFile.extractPath)
    for (let packagePrefix of IE_PACKAGE_PREFIEXES) {
      for (let filename of ieFilenames) {
        if (filename.toLowerCase().startsWith(packagePrefix.toLowerCase())) {
          ieFile.packagePaths.push(path.join(ieFile.extractPath, filename))
        }
      }
    }

    files.sort((a, b)=>{
      return a.kbPart.localeCompare(b.kbPart)
      //a.mtime.getTime() - b.stat.mtime.getTime();
    });

    let packagePaths = []
    for (let file of files) {
      if (file.pathKey === 'ie') { // There are other languages need to be excluded
        if (file.packagePaths) {
          Array.prototype.push.apply(packagePaths, file.packagePaths);
        } else if (file.extractPath) {
          packagePaths.push(file.extractPath);
        }
      } else {
        packagePaths.push(file.targetPath)
      }
    }

    console.log(packagePaths);
    for (let packagePath of packagePaths) {
      let packageOption = cloneOption(defaultOption)
      packageOption.cwd = path.dirname(packagePath);
      yield process.exec(`Dism.exe /image:${options.mountDir} /Add-Package "/PackagePath:${path.basename(packagePath)}"`, packageOption)
    }
  } finally {
    for (let file of files) {
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
    let mountPath = path.join(options.mountDir)
    let needMount = true;

    const installWinPath = `${osDevice}\\sources\\install.wim`;
    const wimFilepath = path.join(options.wimDir, 'install.wim')
    if (fs.existsSync(mountPath)){
      needMount = false;
      if (options.forceMount) {
        yield process.exec(`Dism.exe /Unmount-Wim /discard /MountDir:${options.mountDir}`, defaultOption);
        fs.removeSync(mountPath);
        if (fs.existsSync(wimFilepath)) {
          //TODO: use mtime is not accurate , cause fs.chmodSync
          // would change mtime
          let mtimeA = fs.statSync(wimFilepath).mtime;
          let mtimeB = fs.statSync(installWinPath).mtime;
          if (mtimeA.getTime() != mtimeB.getTime()){
            fs.removeSync(wimFilepath);
          }
        }
        needMount = true;
      }
    }

    if (needMount) {
      fs.mkdirsSync(mountPath);
      if (!fs.existsSync(wimFilepath)){
        fs.copySync(installWinPath, wimFilepath);
      }
      let stat = fs.statSync(installWinPath);
      fs.chmodSync(wimFilepath, 666)
      yield process.exec(`Dism.exe /Mount-Wim /WimFile:${wimFilepath} /Index:4 /MountDir:${options.mountDir}`, defaultOption);
      fs.utimesSync(wimFilepath, stat.atime, stat.mtime);
    }

    let wsusClient = `wsusoffline\\client`
    if (options.addPackage) {
      yield* dsimNormalUpdates(wsusClient, defaultOption, options);
    }
    if (options.commit) {
      yield process.exec(`Dism.exe /Unmount-Wim /MountDir:${options.mountDir} /commit`, defaultOption)
    }
    
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
  wimDir: 'C:/Win7',
  arch: 'x64',
  lang: 'enu',
  addPackage: false,
  commit: false,
  ieLang: 'en-us',
});