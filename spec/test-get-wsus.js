'use strict';

let path = require('path')
let expect = require('chai').expect
let dsimpe = require('../src/dsimpe.js')

let getWsusPackagePaths = dsimpe.getWsusPackagePaths;
let EXCLUDS_FOR_WIN7 = dsimpe.EXCLUDS_FOR_WIN7;
let getWHDownloaderPackagePaths = dsimpe.getWHDownloaderPackagePaths;

describe('dsimpe#', function(){

  let options = {
    rootDir: path.dirname(__dirname),
    arch: 'x64',
    lang: 'enu',
    ieLang: 'en-us',
  }
  it('getWsusPackagePaths Should return the correct package list', function*(){
    this.timeout(10000);
    const packageList = yield* getWsusPackagePaths(options);
    expect(packageList.length).to.equal(192);
  })
  let getNotFiltered = (ids, packageList)=>{
    let notFiltered = [];
    for (let key of ids) {
      for (let packagePath of packageList) {
        if (packagePath.indexOf(key) >= 0) {
          notFiltered.push(key);
        }
      }
    }
    return notFiltered;
  }
  it('getWsusPackagePaths Testing the exclude works', function*(){
    this.timeout(10000);
    expect(EXCLUDS_FOR_WIN7.indexOf('2506014')).to.equal(-1);
    const packageList = yield* getWsusPackagePaths(options);
    let notFiltered = getNotFiltered(['2506014'], packageList)
    expect(notFiltered).to.eql(['2506014']);
    notFiltered = getNotFiltered(EXCLUDS_FOR_WIN7, packageList)
    expect(notFiltered).to.eql([]);
  });

  it('test path sort', function(){
    this.timeout(10000);
    let paths = ['Windows6.1-KB2857650-x64.msu', 'Windows6.1-KB2574819-v2-x64.msu'];
    expect(paths.sort()).to.eql(['Windows6.1-KB2574819-v2-x64.msu', 'Windows6.1-KB2857650-x64.msu'])
  });

  it('getWHDownloaderPackagePaths', function(){
    let ret = getWHDownloaderPackagePaths(options)
    expect(ret).to.eql([ 'WHDownloader\\Updates\\Windows7-x64\\General',
        'WHDownloader\\Updates\\Windows7-x64\\Security',
        'WHDownloader\\Updates\\Windows7-x64\\Hotfix',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\_IE11',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\_IE11\\Updates',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\Features\\IIS',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\Features\\LPRPortMonitor',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\Features\\MSMQ',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\Features\\NFS',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\Features\\SNMP',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\Features\\SUA',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\Features\\TelnetServer',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\RDP\\Windows6.1-KB2574819-v2-x64.msu',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\RDP\\Windows6.1-KB2592687-x64.msu',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\RDP\\Windows6.1-KB2830477-x64.msu',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\RDP\\Windows6.1-KB2923545-x64.msu',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\RDP\\Windows6.1-KB2984976-x64.msu',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\RDP\\Windows6.1-KB2985461-x64.msu',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\RDP\\Windows6.1-KB3020387-x64.msu',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\RDP\\Windows6.1-KB3020388-x64.msu',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\RDP\\Windows6.1-KB3024260-x64.msu',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\RDP\\Windows6.1-KB3069762-x64.msu',
        'WHDownloader\\Updates\\Windows7-x64\\Additional\\WAT',
        'WHDownloader\\Updates\\Windows7-x64\\Extra\\MediaFeaturePack',
        'WHDownloader\\Updates\\Windows7-x64\\Extra\\MediaFormatFeaturePack',
        'WHDownloader\\Updates\\Windows7-x64\\Extra\\RSAT',
        'WHDownloader\\Updates\\Windows7-x64\\Extra\\RSAT\\WMS',
        'WHDownloader\\Updates\\Windows7-x64\\Extra\\RSAT\\Updates' ]);
  });
})