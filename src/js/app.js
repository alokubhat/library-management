App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  adminAcc: 0xf98403a6b19a1721fd28125d5a4d231e0060b3d2,

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

      return App.render();
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

        if (App.adminAcc != App.account){
          $("#accountType").html("USER ACCOUNT");
        }
        else{
          $("#accountType").html("ADMIN ACCOUNT");
        }
        
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

          if (App.adminAcc != App.account) {
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

      if (App.adminAcc != App.account) {
        userControls.show();
        adminControls.hide();
      }
      else{
        userControls.hide();
        adminControls.show();
      }
    }).catch(function(error) {
      console.warn(error);
    });
  },

  checkoutBook: function() {
    var checkoutBookId = $('#checkoutBook').val();
    App.contracts.Library.deployed().then(function(instance) {
      return instance.checkout(checkoutBookId, { from: App.account });
    }).then(function(result) {
      
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