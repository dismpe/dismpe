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

const EXCLUDS_FOR_WIN7 = [
  '2483614', // not affected on Win7 Sp1
  '2518295', // not affected on Win7 Sp1
  '2533552', // only online
  '2535512', // not affected on Win7 Sp1
  '2546250', // not affected on Win7 Sp1
  '2571621', // not affected on Win7 Sp1
  '2604114', // .NET related
  '2637518', // .NET related
  '2656355', // .NET related

  // superseded
  '2656410',
  '2729451',
  '2736418',
  '2742598',
  '2756920',
  '2789644',
  '2790978',
  '2843638',

  '2853587', //AD_LDS updates, should be installed separately

  //extra
  '2868846',
  '2928120', // RSAT

  '3042058',
  '3046339',
  '3062577',
  '3100465',
  '3108604',
  '3108669',
]

exports.EXCLUDS_FOR_WIN7 = EXCLUDS_FOR_WIN7;

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

let cloneOption = (option) => {
  return JSON.parse(JSON.stringify(option));
}

exports.getPaths = (options, root, type) => {
  let fullRoot = path.join(options.rootDir, root);
  let filenames = fs.readdirSync(fullRoot)
  let result = [];
  filenames.forEach((filename)=>{
    let fullPath = path.join(fullRoot, filename)
    let ok = false;
    if (type === null) {
      ok = true;
    } else {
      let stat = fs.lstatSync(fullPath);
      if (type === 'directory' && stat.isDirectory()) {
        ok = true;
      } else if (type === 'file' && stat.isFile()) {
        ok = true;
      }
    }
    if (ok) {
      result.push(path.join(root, filename));
    }
  });
  return result;
}

/*
http://forums.mydigitallife.info/threads/66837-WHDownloader-help
the most recommended to install:
General, Security, Hotfix.. Additional: IE11, Features, RDP, NotAllowedOffline
if you want/need to validate (genuine), you would need WAT

WMF4.0 is to have PowerShell 4.0, and it needs .NET 4.5 or higher

don't install anything from Extra, unless you actually need and know what's there updates are for
*/
exports.getWHDownloaderPackagePaths = function(options){
  let updatePath = `WHDownloader\\Updates\\Windows7-${options.arch}`
  let GeneralPath = path.join(updatePath, 'General')
  let SecurityPath = path.join(updatePath, 'Security')
  let HotfixPath = path.join(updatePath, 'Hotfix')

  let IE11Path = path.join(updatePath, 'Additional', '_IE11')
  let IE11UpdatesPath = path.join(updatePath, 'Additional', '_IE11', 'Updates')

  // Features
  let featuresPaths = exports.getPaths(options, path.join(updatePath, 'Additional', 'Features'), 'directory')
  // Remote desktop, we need sort them
  //  RDP have order problem
  let rdpPaths = exports.getPaths(options, path.join(updatePath, 'Additional', 'RDP'), 'file')
  rdpPaths = rdpPaths.sort();
  //Windows Activation Technologies(WAT)
  let watPath = path.join(updatePath, 'Additional', 'WAT')
  //Remove Additional\WMF4.0 This is powershell that need .NET 4.5 and that can not be integrate into install.wim

  // For extras, we only use MediaFeaturePack & MediaFormatFeaturePack & RSAT
  let mediaFeaturePackPath = path.join(updatePath, 'Extra', 'MediaFeaturePack');
  let mediaFormatFeaturePackPath = path.join(updatePath, 'Extra', 'MediaFormatFeaturePack');
  let rsatPath = path.join(updatePath, 'Extra', 'RSAT');
  let rsatWmsPath = path.join(updatePath, 'Extra', 'RSAT', 'WMS');
  let rsatUpdatesPath = path.join(updatePath, 'Extra', 'RSAT', 'Updates');
  let paths = [
    GeneralPath,
    SecurityPath,
    HotfixPath,
    IE11Path,
    IE11UpdatesPath,
    featuresPaths,
    rdpPaths,
    watPath,
    mediaFeaturePackPath,
    mediaFormatFeaturePackPath,
    rsatPath,
    rsatWmsPath,
    rsatUpdatesPath,
  ];
  let result = [];
  for (let p of paths) {
    if (Array.isArray(p)){
      Array.prototype.push.apply(result, p);
    } else {
      result.push(p);
    }
  }
  return result;

  `
  :: Extra updates
  Remove means can not be integrate, Disable means useless

  ::Active Directory? Lightweight Directory Services, disable it first
  :: Disable Extra\AD_LDS
  :: Disable Extra\AD_LDS\Updates

  :: Remove Extra\Addons\DA2.0
  :: Remove Extra\Addons\FM.API The FM.API lost a xml file
  :: Remove Extra\Addons\MicrosoftAgent outdate thing

  ::Windows NT Backup Restore Utility
  :: Disable Extra\Addons\NTBackup_en-us

  ::WIF have order problem, it's been superseded in .net 4.5
  :: Disable Extra\Addons\WIF\Windows6.1-KB974405-x64.msu
  :: Disable Extra\Addons\WIF\Windows6.1-KB2503351-x64.msu

  ::No need for me
  :: Disable Extra\Addons\WorkFolders

  :: Remove Extra\SL
  ::TODO: In future, if VirtualPC is possible, then integrate it
  :: Remove Extra\VirtualPC
  :: Remove Extra\WithoutPlatform
  :: Remove Extra\WMF3.0 We have WMF 4.0 in Additional, besides, it need .NET
  :: Remove Extra\WUClient
  `
}

let extractFile = (file, defaultOption) => {
  let targetPath = path.dirname(path.dirname(file.targetPath))
  file.extractPath = path.join(targetPath, file.id  +  '.x');
  fs.removeSync(file.extractPath);
  return process.exec(`"${file.targetPath}" -x:${file.extractPath} -q`, defaultOption)
}

exports.getWsusPackagePaths = function*(options, defaultOption) {
  let wsusClient = `wsusoffline\\client`

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
    file.targetPath = file.filePath;
  }

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
    if (EXCLUDS_FOR_WIN7.indexOf(file.kbPart.substring(2)) >= 0){
      continue;
    }
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

  return packagePaths;
}

exports.start = (options)=>{
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

    if (options.addPackage) {
      let packagePaths = [];
      if (options.udpateType === 'WHDownloader') {
        let whdPackagePaths = exports.getWHDownloaderPackagePaths(options);
      } if (options.udpateType === 'wsusoffline') {
        packagePaths = yield* exports.getWsusPackagePaths(options, defaultOption);
      }
      console.log(packagePaths);
      for (let packagePath of packagePaths) {
        yield process.exec(`Dism.exe /image:${options.mountDir} /Add-Package "/PackagePath:${packagePath}"`, defaultOption)
      }
    }
    
    // TODO: Drivers
    // TODO: auto - installations
    if (options.commit) {
      yield process.exec(`Dism.exe /Unmount-Wim /MountDir:${options.mountDir} /commit`, defaultOption)
    }
    
  }).catch((e)=>{
    console.log(e + e.stack);
  });
}
