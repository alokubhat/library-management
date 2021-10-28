App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      web3.eth.defaultAccount = web3.eth.accounts[8];
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      web3.eth.defaultAccount = web3.eth.accounts[8];
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Library.json", function(library) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Library = TruffleContract(library);
      // Connect provider to interact with contract
      App.contracts.Library.setProvider(App.web3Provider);

      //App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Library.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.transactionEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var libraryInstance;
    var loader = $("#loader");
    var content = $("#content");
    var userControls = $("#user");
    var adminControls = $("#admin");

    loader.hide();
    content.show();
    userControls.hide();
    adminControls.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Library.deployed().then(function(instance) {
      libraryInstance = instance;
      return libraryInstance.numBooks({ from: App.account });
    }).then(function(numBooks) {
      var bookList = $("#listOfBooks");
      bookList.empty();

      var checkoutBookSelect = $('#checkoutBook');
      checkoutBookSelect.empty();

      var returnBookSelect = $('#returnBook');
      returnBookSelect.empty();

      var removeBookSelect = $('#removeBook');
      removeBookSelect.empty();

      for (var i = 1; i <= numBooks; i++) {
        libraryInstance.books(i, { from: App.account }).then(function(book) {
          var id = book[0];
          var name = book[1];
          var author = book[2];
          var isAvailable = "❌";
          if(true == book[3])
            isAvailable = "✅";


          // Render Book List
          var bookRow = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + author + "</td><td>" + isAvailable + "</td></tr>"
          bookList.append(bookRow);
          
          if (0xf98403a6b19a1721fd28125d5a4d231e0060b3d2 != App.account) {
            if (true == book[3]) {
              // Render Checkout Book List
              var checkoutBookOption = "<option value='" + id + "' >" + name + " - " + author + "</ option>"
              checkoutBookSelect.append(checkoutBookOption);
            }
            else if (book[4] == App.account) {
              // Render Return Book List
              var returnBookOption = "<option value='" + id + "' >" + name + " - " + author + "</ option>"
              returnBookSelect.append(returnBookOption);
            }
          }
          else{
            // Render Remove Book List
            var removeBookOption = "<option value='" + id + "' >" + name + " - " + author + "</ option>"
            removeBookSelect.append(removeBookOption);
          }
        });
      }

      if (0xf98403a6b19a1721fd28125d5a4d231e0060b3d2 != App.account) {
        userControls.show();
        adminControls.hide();
      }
      else{
        userControls.hide();
        adminControls.show();
      }
    //   libraryInstance.getBooksForUser({from: App.account, gas:3000000});
    //   return libraryInstance.curUserBooks();
    // }).then(function(userBooks) {
    //   var numCurBooks = libraryInstance.numCurUserBooks();
    //   for (var i = 1; i <= numCurBooks; i++)
    //   {
    //     var id = userBooks[i][0];
    //     var name = userBooks[i][1];
    //     var author = userBooks[i][2];
    //     // Render Return Book List
    //     var returnBookOption = "<option value='" + id + "' >" + name + " - " + author + "</ option>"
    //     returnBookSelect.append(returnBookOption);
    //   }
    }).catch(function(error) {
      console.warn(error);
    });
  },

  checkoutBook: function() {
    var checkoutBookId = $('#checkoutBook').val();
    App.contracts.Library.deployed().then(function(instance) {
      return instance.checkout(checkoutBookId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();

      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },

  returnBook: function() {
    var returnBookId = $('#returnBook').val();
    App.contracts.Library.deployed().then(function(instance) {
      return instance.returnBook(returnBookId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();

      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },

  addBook: function() {
    var bookName = document.getElementById("addBookName").value;
    var authorName = document.getElementById("addAuthorName").value;
    App.contracts.Library.deployed().then(function(instance) {
      return instance.addBook(bookName, authorName, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
  
      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },

  removeBook: function() {
    var removeBookId = $('#removeBook').val();
    App.contracts.Library.deployed().then(function(instance) {
      return instance.removeBook(removeBookId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();

      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});