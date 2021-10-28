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
    uint public numBooks;

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

    function checkout (uint _bookID) public{
        // make sure book is available
        require(books[_bookID].isAvailable);

        // update status of book
        books[_bookID].isAvailable = false;

        // record that the current user has checked out the book
        books[_bookID].user = msg.sender;
    }

    function returnBook (uint _bookID) public{
        // make sure book is checked out by user
        require(!books[_bookID].isAvailable && books[_bookID].user == msg.sender);

        // set state of book as available
        books[_bookID].isAvailable = true;

        // record that the current user has returned the book
        books[_bookID].user = 0x0000000000000000000000000000000000000000;
    }
}