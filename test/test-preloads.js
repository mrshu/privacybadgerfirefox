const { Cc, Ci } = require("chrome");
const utils = require('./utils');
const { storage } = require("sdk/simple-storage");
const { Policy } = require("./contentPolicy");
const userStorage = require('./userStorage');

let preloadText = "@@||sgizmo.co^$third-party\n"+
                  "@@||www.logos.co.uk^$third-party\n"+
                  "@@||www.fuseservice.com^$third-party\n"+
                  "@@||piclens.co.uk^$third-party\n";

exports.testPreloads = function(assert) {
  userStorage.init();
  userStorage.syncPreloads(preloadText);
  assert.equal(Object.keys(storage.preloads).length, 4, "test sync preloads");
  let goodDomains = [ "https://sgizmo.co",
                      "http://www.sgizmo.co/abc?query=1#foobar",
                      "http://www.logos.co.uk/foobar",
                      "https://abc.piclens.co.uk",
                      "http://foo.bar.piclens.co.uk",
                      "https://maps.api.test.www.fuseservice.com" ];
  let badDomains = [ "http://google.com",
                     "https://cdn.logos.co.uk",
                     "http://cdn.logos.co",
                     "https://adswww.fuseservice.com",
                     "http://fuseservice.com",
                     "https://sgizmo.co.uk",
                     "https://lens.co.uk/abcdef" ];

  goodDomains.forEach(function(element, index, array) {
    assert.ok(Policy._isPreloadedWhitelistRequest(utils.makeURI(element)),
              "test that " + element + " is whitelisted");
  });

  badDomains.forEach(function(element, index, array) {
    assert.ok(!Policy._isPreloadedWhitelistRequest(utils.makeURI(element)),
              "test that " + element + " is NOT whitelisted");
  });

};

require("sdk/test").run(exports);
