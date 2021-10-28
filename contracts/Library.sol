pragma solidity >=0.5.16;

contract Library{
    struct Book
    {
        uint id;
        string name;
        string author;
        bool isAvailable;
        address user;
    }

    mapping(uint => Book) public books;
    mapping(address => uint[]) private checkedOutBooks;
    uint public numBooks;
    // Book[] public curUserBooks;
    // uint public numCurUserBooks;

    // // transaction event
    // event transactionEvent (
    //     uint bookID
    // );

    constructor() public{
        addBook("The Alchemist", "Paulo Coelho");
        addBook("Harry Potter and the Prisoner of Azkaban", "J K Rowling");
        addBook("Jonathan Livingston Seagull", "Richard Bach");
        addBook("Man's Search For Meaning", "Viktor Frankl");
        addBook("The Snow Leopard Adventure", "Deepak Dalal");
        addBook("A Study in Scarlet", "Sir Arthur Conan Doyle");
        addBook("Digital Fortress", "Dan Brown");
        addBook("Micro", "Michael Crichton");
        addBook("The Invisible Man", "H G Wells");
        addBook("Journey to the Center of the Earth", "Jules Verne");
    }

    function addBook (string memory _bookName, string memory _authorName) public{
        ++numBooks;
        books[numBooks] = Book(numBooks, _bookName, _authorName, true, 0x0000000000000000000000000000000000000000);
    }

    function removeBook (uint _bookID) public{
        for (uint i=_bookID+1; i <= numBooks; i++) {
            books[i-1] = books[i];
            books[i-1].id = i-1;
        }
        delete books[numBooks];
        --numBooks;
    }

    // function getBooksForUser () public{
    //     delete curUserBooks;
    //     numCurUserBooks = 0;
    //     uint[] memory curUserBookIds = checkedOutBooks[msg.sender];
    //     for (uint i=0; i<curUserBookIds.length; i++) {
    //         Book memory curBook = books[curUserBookIds[i]];
    //         curUserBooks.push(curBook);
    //         ++numCurUserBooks;
    //     }
    // }

    function checkout (uint _bookID) public{
        // make sure book is available
        require(books[_bookID].isAvailable);

        // // record that the current user has checked out the book
        // checkedOutBooks[msg.sender].push(_bookID);

        // // update status of book
        // books[_bookID].isAvailable = false;

        // // checkout complete
        // emit transactionEvent(_bookID);

        books[_bookID].isAvailable = false;
        books[_bookID].user = msg.sender;
    }

    function returnBook (uint _bookID) public{
        // // make sure book is checked out by user
        // uint i = findCheckedOutBook(_bookID, msg.sender);
        // require(i < checkedOutBooks[msg.sender].length);

        // // remove the book from user's book list
        // removeByIndex(i, msg.sender);

        // // set state of book as available
        // books[_bookID].isAvailable = true;

        // // checkout complete
        // emit transactionEvent(_bookID);

        require(!books[_bookID].isAvailable && books[_bookID].user == msg.sender);

        books[_bookID].isAvailable = true;
        books[_bookID].user = 0x0000000000000000000000000000000000000000;
    }

    // function findCheckedOutBook(uint _value, address user) private returns(uint){
    //     uint i = 0;
    //     while (checkedOutBooks[user][i] != _value) {
    //         i++;
    //     }
    //     return i;
    // }

    // function removeByIndex(uint i, address user) private {
    //     while (i<checkedOutBooks[user].length-1) {
    //         checkedOutBooks[user][i] = checkedOutBooks[user][i+1];
    //         i++;
    //     }
    //     delete curUserBooks[curUserBooks.length - 1];
    // }
}