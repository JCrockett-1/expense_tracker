const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./expenses.db');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

displayMenu();

db.run('CREATE TABLE IF NOT EXISTS expenses(id INTEGER PRIMARY KEY, description TEXT, amount REAL)');

function addExpense() {
    rl.question('What was the expense? ', function(description) {
        rl.question('What was the amount? ', function(amount) {
            db.run('INSERT INTO expenses (description, amount) VALUES (?,?)', [description, amount]);
            rl.close();
        });
    });
}

function viewExpenses() {
    db.all('SELECT * FROM expenses', function(err,rows) {
        console.log(rows);
    })
}



function displayMenu() {
    console.log("Welcome to the expense tracker! You can add expenses, view all expenses, summarize expenses, and exit program. Would you like to...");
    console.log("1. Add expense\n2. View expenses\n3. Summarize expenses\n4. Exit the program");
    rl.question(("Enter the number corresponding to the menu: "), function (input) {
        try {
            const choice = parseInt(input);
            console.log();
            if (isNaN(choice) || choice < 1 || choice > 5) {
                throw new Error("This input is an invalid menu choice. Please enter a number between 1 and 5.");
            }
            if (choice ===1) 
            {
                console.log();
                addExpense();
            }
            else if (choice ===2)
            {
                console.log();
                viewExpenses();
            }
            else if (choice ===3)
            {
                console.log();
                summarizeExpenses();
            }
            else if (choice ===4)
            {
                console.log();
                console.log("Thanks!")
                rl.close();
            }
        } catch (error) {
            console.log(error.message);
            console.log("Please try again. Press enter to continue... ");
            process.stdin.once("data", function () {
                displayMenu();
            });
        }
    });
}