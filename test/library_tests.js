var Library = artifacts.require("./Library.sol");

contract("Library", function(accounts) {
  var libInstance;

  it("initializes with two candidates", function() {
    return Library.deployed().then(function(instance) {
      return instance.numBooks();
    }).then(function(count) {
      assert.equal(count, 10);
    });
  });

  it("initializes with two candidates", function() {
    return Library.deployed().then(function(instance) {
      libInstance = instance;
      libInstance.checkout(1, {from: accounts[1], gas:3000000});
      libInstance.getBooksForUser({from: accounts[1], gas:3000000});
      libInstance.numCurUserBooks({from: accounts[1], gas:3000000})
      return libInstance.numCurUserBooks({from: accounts[1], gas:3000000})
    }).then(function(userBooks) {
      assert.equal(userBooks,1);
    });
  });

  // it("check msg.sender", function() {
  //   return Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     electionInstance.callCandFirst({ from: accounts[1] });
  //     return electionInstance.lastCaller({from: accounts[1], gas:3000000});
  //   }).then(function(lastCaller1) {
  //     assert.equal(lastCaller1, 0x0000000000000000000000000000000000000000);
  //     return electionInstance.sameAccCalled({from: accounts[1], gas:3000000});
  //   }).then(function(voterStat1) {
  //     assert.equal(voterStat1, false);
  //     electionInstance.callCandSecond({ from: accounts[1] });
  //     return electionInstance.lastCaller({from: accounts[1], gas:3000000});
  //   }).then(function(lastCaller12) {
  //     assert.equal(lastCaller12, accounts[1]);
  //     return electionInstance.sameAccCalled({from: accounts[1], gas:3000000});
  //   }).then(function(voterStat) {
  //     assert.equal(voterStat, true);
  //   });
  // });

  // it("it initializes the candidates with the correct values", function() {
  //   return Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     return electionInstance.candidates(1);
  //   }).then(function(candidate) {
  //     assert.equal(candidate[0], 1, "contains the correct id");
  //     assert.equal(candidate[1], "Candidate 1", "contains the correct name");
  //     assert.equal(candidate[2], 0, "contains the correct votes count");
  //     return electionInstance.candidates(2);
  //   }).then(function(candidate) {
  //     assert.equal(candidate[0], 2, "contains the correct id");
  //     assert.equal(candidate[1], "Candidate 2", "contains the correct name");
  //     assert.equal(candidate[2], 0, "contains the correct votes count");
  //   });
  // });

  // it("throws an exception for invalid candidates", function() {
  //   return Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     return electionInstance.vote(99, { from: accounts[1] })
  //   }).then(assert.fail).catch(function(error) {
  //     assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
  //     return electionInstance.candidates(1);
  //   }).then(function(candidate1) {
  //     var voteCount = candidate1[2];
  //     assert.equal(voteCount, 0, "candidate 1 did not receive any votes");
  //     return electionInstance.candidates(2);
  //   }).then(function(candidate2) {
  //     var voteCount = candidate2[2];
  //     assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
  //   });
  // });

  // it("allows a voter to cast a vote", function() {
  //   return Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     candidateId = 1;
  //     return electionInstance.vote(candidateId, { from: accounts[1] });
  //   }).then(function(receipt) {
  //     return electionInstance.voters(accounts[1]);
  //   }).then(function(voted) {
  //     assert(voted, "the voter was marked as voted");
  //     return electionInstance.candidates(candidateId);
  //   }).then(function(candidate) {
  //     var voteCount = candidate[2];
  //     assert.equal(voteCount, 1, "increments the candidate's vote count");
  //   })
  // });

  // it("throws an exception for double voting", function() {
  //   return Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     candidateId = 2;
  //     electionInstance.vote(candidateId, { from: accounts[1] });
  //     return electionInstance.candidates(candidateId);
  //   }).then(function(candidate) {
  //     var voteCount = candidate[2];
  //     assert.equal(voteCount, 1, "accepts first vote");
  //     // Try to vote again
  //     return electionInstance.vote(candidateId, { from: accounts[1] });
  //   }).then(assert.fail).catch(function(error) {
  //     assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
  //     return electionInstance.candidates(1);
  //   }).then(function(candidate1) {
  //     var voteCount = candidate1[2];
  //     assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
  //     return electionInstance.candidates(2);
  //   }).then(function(candidate2) {
  //     var voteCount = candidate2[2];
  //     assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
  //   });
  // });
});