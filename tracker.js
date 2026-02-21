// sqlite and readline are both setup to create databases and read user input
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./expenses.db');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// user is welcomed and expense database is created
console.log("Welcome to the expense tracker! You can add expenses, view all expenses, summarize expenses, and exit program. Would you like to...");

displayMenu();

db.run('CREATE TABLE IF NOT EXISTS expenses(id INTEGER PRIMARY KEY, description TEXT, amount REAL)');

// function to add expense. Catches the error if a non-number is inputed for the expense amount
function addExpense() {
    rl.question('What was the expense? ', function(description) {
        askAmount();

        function askAmount() {
            rl.question('What was the amount? $', function(input) {
                const amount = parseFloat(input);
                if(isNaN(amount)) {
                    console.log("What you entered wasn't a valid number (ex. 4, 3.67) try again")
                    askAmount();
                }
                else {
                    db.run('INSERT INTO expenses (description, amount) VALUES (?,?)', [description, amount]);
                    console.log();
                    displayMenu();
                }
            });
        }
    });
}

// function to view expenses. Catches errors, and sorts id, description, and amount in a readable format
function viewExpenses() {
    db.all('SELECT * FROM expenses', function(err,rows) {
        if (err) {
            console.error("Database error:", err.message);
            rl.question("\nPress Enter to continue...", function() {
                console.log();
                displayMenu();
            });
        }
        rows.forEach(function(row) {
            console.log(`#${row.id}; ${row.description}; $${row.amount}`)
        })
        rl.question("\nPress Enter to continue...", function() {
            console.log();
            displayMenu();
        });
    })
}

// expenses are viewed in a readable format so that the user can select one to remove, if the id isn't found, the user is prompted to try again
function removeExpense() {
    db.all('SELECT * FROM expenses', function(err,rows) {
        if (err) {
            console.error("Database error:", err.message);
            rl.question("\nPress Enter to continue...", function() {
                console.log();
                displayMenu();
            });
        }
        rows.forEach(function(row) {
            console.log(`#${row.id}; ${row.description}; $${row.amount}`)
        })
        console.log();
        rl.question('What is the id of the expense you would like to remove? ', function(id) {
            db.run('DELETE FROM expenses WHERE id = ?', [id], function(err) {
            if (err) {
                console.error("Error with database: " + err.message);
            }
            else if (this.changes === 0) {
                console.log('No expenses found with that id');
            }
            else {
                console.log("Done!");
                console.log();
                displayMenu();
            }
            });
        });
    });
}

// expenses are viewed in a readable format so that the user can select one to modify. User is prompted to input the respective id and the new expense description and amount
function modifyExpense() {
    db.all('SELECT * FROM expenses', function(err,rows) {
        if (err) {
            console.error("Database error:", err.message);
            rl.question("\nPress Enter to continue...", function() {
                console.log();
                displayMenu();
            });
        }
        rows.forEach(function(row) {
            console.log(`#${row.id}; ${row.description}; $${row.amount}`)
        })
        console.log();
        rl.question('What is the id of the expense you would like to modify? ', function(id) {
            rl.question('What is the updated description? ', function(description) {
                askAmount();

                function askAmount() {
                    rl.question('What is the updated amount? ', function(input) {
                        const amount = parseFloat(input);
                        if(isNaN(amount)) {
                            console.log("What you entered wasn't a valid number (ex. 4, 3.67) try again")
                            askAmount();
                        }
                    
                        else {
                            db.run('UPDATE expenses SET description = ?, amount = ? WHERE id = ?', [description, amount, id], function (err) {
                                if (err) {
                                    console.error("Error with database: " + err.message);
                                }
                                else if (this.changes === 0) {
                                    console.log('No expenses found with that id');
                                }
                                else {
                                    console.log("Done!");
                                    console.log();
                                    displayMenu();
                                }
                            })
                        }
                    });    
                }
            });
        });
    });
}

// expense data is summarized. This includes the number of entries (expenses) as well as the total amount expensed so far
function summarizeExpenses() {
    db.get('SELECT SUM(amount) AS total, COUNT(id) AS count FROM expenses', function(err, result) {
        if (err) {
            console.error("Database error:", err.message);
            rl.question("\nPress Enter to continue...", function() {
                console.log();
                displayMenu();
            });
        }
        console.log('You have incurred ' + result.count + ' expenses so far');
        console.log('The total amount of expenses so far is $' + (result.total || 0));
        rl.question("\nPress Enter to continue...", function() {
            console.log();
            displayMenu();
        });
    })
}

// display menu function is created. This allows the user to choose from the functions above so that they can interact with the expense database
function displayMenu() {
    console.log("1. Add expense\n2. View expenses\n3. Remove expense\n4. Modify expense\n5. Summarize expenses\n6. Exit the program");
    rl.question(("Enter the number corresponding to the menu: "), function (input) {
        try {
            const choice = parseInt(input);
            console.log();            
            if (isNaN(choice) || choice < 1 || choice > 6) {
                throw new Error("This input is an invalid menu choice. Please enter a number between 1 and 6.");
            }
            if (choice === 1) 
            {
                addExpense();
            }
            else if (choice === 2)
            {
                viewExpenses();
            }
            else if (choice === 3)
            {
                removeExpense();
            }
            else if (choice === 4)
            {
                modifyExpense();
            }
            else if (choice === 5)
            {
                summarizeExpenses();
            }
            else if (choice === 6)
            {
                console.log("Thanks!")
                rl.close();
                return;
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