const { setWorldConstructor, World } = require("@cucumber/cucumber");
const PurgomalumService = require('../purgomalum.service/purgomalumService.js');

request = require('supertest');
var config = require("../../config/config.js");

class CustomWorld extends World {

  constructor(options) {
    super(options);
    this.purgomalumService = new PurgomalumService(config.baseurl);
  }

  setService(serviceName, requestType) {
    this.serviceName = serviceName + '?';
    this.requestType = requestType;
  }

  setDefaultService() {
    this.setService(config.defaultDataType, 'application/' + config.defaultDataType);
  }

  setContainsProfanityService() {
    this.setService(config.containsprofanityservice, 'text/plain');
  }

  setReplacementCharacter(replacementCharacter) {
    this.replaceParam = '&' + config.replacecharacterparam + '=' + replacementCharacter;
  }

  setReplaceCharacterService(replacementCharacter) {
    this.setDefaultService();
    this.setReplacementCharacter(replacementCharacter);    
  }

  setReplacementString(replacementString) {
    this.replaceParam = '&' + config.replacestringparam + '=' + replacementString; 
  }

  setReplaceStringService(replacementString) {
    this.setDefaultService();
    this.setReplacementString(replacementString);    
  }

  getParams(){
    if(this.replaceParam) {
      return config.testprocessparam + '=' + this.messageText + this.replaceParam;
    }
    else {
      return config.testprocessparam + '=' + this.messageText;
    }
  }

  async getResponse() {
    console.log('\r\nRunning ' + config.api + '/' + this.serviceName + this.getParams());
    return await request(config.api)
      .get('/' + this.serviceName + this.getParams())
      .set('Accept', this.requestType)
      .expect(200)
      .then(response => {
        return response;
        }) 
  }
}

setWorldConstructor(CustomWorld);