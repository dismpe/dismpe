'use strict';

let path = require('path');
let expect = require('chai').expect;

let index = require('../index');

let getWsusPackagePaths = index.getWsusPackagePaths;
let EXCLUDS_FOR_WIN7 = index.EXCLUDS_FOR_WIN7;

describe('index#getWsusPackagePaths', function(){

  let options = {
    rootDir: path.dirname(__dirname),
    arch: 'x64',
    lang: 'enu',
    ieLang: 'en-us',
  }
  it('Should return the correct package list', function*(){
    this.timeout(10000);
    const packageList = yield getWsusPackagePaths(options);
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
  it('Testing the exclude works', function*(){
    this.timeout(10000);
    expect(EXCLUDS_FOR_WIN7.indexOf('2506014')).to.equal(-1);
    const packageList = yield getWsusPackagePaths(options);
    let notFiltered = getNotFiltered(['2506014'], packageList)
    expect(notFiltered).to.eql(['2506014']);
    notFiltered = getNotFiltered(EXCLUDS_FOR_WIN7, packageList)
    expect(notFiltered).to.eql([]);
  });
})