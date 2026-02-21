# Overview

This is a expense tracker program using node.js in JavaScript. This program demonstrates the use of a SQL database and includes two aggregate functions (SUM and COUNT) to calculate total expenses and number of entries. I used this as a way to demonstrate both my JavaScript and SQL learning, programming in Visual Studio Code pushed via GitHub

[Software Demo Video](https://youtu.be/oUCPuSnVJw4)

# Relational Database

I am using SQLite, a file-based relational database. It stores everything in a single .db file

The database has one table called expenses with the following columns:
* id - INTEGER, primary key

* description - TEXT, this is the description of the expense

* amount - REAL, the cost of the expense
This table stores the expenses added by the user

# Development Environment

* Visual Studio Code

* Node.js v24.13.0

* npm 11.6.2

* SQLite 3.43.2

* Git / GitHub

# Useful Websites

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [SQLite Tutorial](https://www.sqlitetutorial.net/)

# Future Work

- Add expense categories
- Add dates to expenses to sort by month, year, etc.
- Allow the user to scan an external file to edit existing expenses