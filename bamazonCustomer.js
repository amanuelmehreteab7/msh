const
    inquirer = require("inquirer"),
    mysql = require("mysql");
let
    a,
    results1;
connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect();

askUser();

function askUser() {
    inquirer.prompt([{
            name: "action",
            message: "What is the ID of the product you would like to buy?"
        }])
        .then(function(request) {
            a = request.action;
            connection.query(`SELECT * From products WHERE item_id="${request.action}"`, function(error, results, fields) {
                if (error) throw error;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id == request.action) {
                        inquirer.prompt([{
                            name: "actions",
                            message: `How many ${results[0].product_name}(s) would you like?`
                            // return request.action;
                        }]).then(function(request) {
                            connection.query(`SELECT * From products where item_id="${a}"`, function(error, results, fields) {
                                results1 = results;
                                if (results[0].stock_quantity > request.actions) {
                                    connection.query(`UPDATE products SET stock_quantity= stock_quantity - ${request.actions} Where item_id="${a}" `, function(error, results, fields) {
                                        console.log('Total:', results1[0].price * request.actions);
                                        connection.end();
                                    })
                                } else {
                                    console.log('Insufficient quantity!')
                                    connection.end();
                                }
                            })
                        })
                    }
                }
            });
        })
}
