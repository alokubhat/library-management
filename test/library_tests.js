var Library = artifacts.require("./Library.sol");

contract("Library", function(accounts) {
  it("initializes with ten book", function() {
    return Library.deployed().then(function(instance) {
      return instance.numBooks();
    }).then(function(count) {
      assert.equal(count, 10);
    });
  });
});