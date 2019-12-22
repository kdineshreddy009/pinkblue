const express = require("express");
const app = express();
const path = require("path");
var connection = require("./connectToDB.js");
const port = process.env.port || 9443;
const sess_time = 1000 * 60 * 60 * 2; //2hours
const router = express.Router();
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

//Set view engine to ejs
// app.set("view engine", "pug");

//Tell Express where we keep our index.ejs
// app.set("views", __dirname + "/views");

// app.use(express.static(__dirname ));
app.use(express.static('Public'));

app.use(express.static(__dirname + '/Public', {
    index: false,
    maxAge: 600000
}));


//Use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

router.get("/", function(req, res) {
    console.log("in route/");
    if (req.cookies.pinkBlueUser === "Store Manager") {
        res.redirect("/storemanager_view/logged_user");
    } else if (req.cookies.pinkBlueUser === "Store Assistant") {
        res.redirect("/staff_view/logged_user");
    } else {
        res.sendFile(path.join(__dirname, './Public', 'login.html'));
    }
});

router.post("/addInventory", function(req, res) {
    if (req.cookies.pinkBlueUser === "Store Manager" || req.cookies.pinkBlueUser === "Store Assistant") {
        console.log("req.body-", req.body);
        console.log("req.body.product_name-", req.body.product_name);
        var item = req.body;

        var status = (req.cookies.pinkBlueUser === "Store Manager") ? "approved" : "pending";
        insertProduct = `INSERT INTO InventoryRecord(ProductId,ProductName,Vendor,MRP,BatchNum,BatchDate,Quantity,Status) 
        VALUES ("` + item.product_id + `","` + item.product_name + `","` + item.vendor + `","` + item.mrp + `","` + item.batch_num + `",
        "` + item.batch_date + `","` + item.quantity + `","` + status + `");`

        try {
            connection.query(insertProduct, function(error, results, fields) {
                if (error) throw new Error('failed to submit detail');
            });
        } catch (err) {
            next(err)
        }
        res.status(204).send();
    } else {
        res.sendFile(path.join(__dirname, './Public', 'login.html'));
    }
});

router.get("/fetchInventory", function(req, res) {
    fetchInvFromDB(function(rows) {
        res.send(rows);
    });
});

router.get("/staff_view/:user", function(req, res) {
    if (req.cookies.pinkBlueUser === "Store Assistant") {
        res.sendFile(path.join(__dirname, './Public', 'staff.html'));
    } else {
        throw new Error('wrong access to staff_view URL');
    }
});


router.get("/storemanager_view/:user", function(req, res) {
    if (req.cookies.pinkBlueUser === "Store Manager") {
        res.sendFile(path.join(__dirname, './Public', 'storemanager.html')); //res.render('abc'); also works with pug
    } else {
        throw new Error('wrong access to storemanager_view URL');
    }
});

router.get("/login/:credentials", (req, res) => {
    // res.writeHead(200, { "Content-Type": "text/html" });// res.render('storemanager.html')//, { title: 'Hey', message: 'Hello there DINESH!' }
    uname = req.params.credentials.split(",")[0];
    password = req.params.credentials.split(",")[1];
    findUser(uname, password, function(useris) {
        res.send(useris);
    });
});


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function fetchInvFromDB(callback){
     try {
        await connection.query(`select * from pinkblue.InventoryRecord where Status="pending";`, function(error, results, fields) {
            if (error) throw error;
            results=JSON.stringify(results);
            results=JSON.parse(results);
            console.log("RoWs--",results);
            if (results.length != 0) {
                callback(results);
            } else {
                callback("");
            }
        });
    } catch (err) {
        console.log(err);
        callback({error:"Failed retrieval"});
    }
}

async function findUser(usern, pass, callback) {
    try {
        await connection.query(`select * from pinkblue.users where username = '` + usern + `'and password = '` + pass + `';`, function(error, results, fields) {
            if (error) throw error;
            if (results.length != 0) {
                isUserStoreManager(results[0].username, function(isSM) {
                    if (usern === results[0].username && pass === results[0].password) {
                        if (isSM) {
                            callback("Store Manager");
                        } else {
                            callback("Store Assistant");
                        }
                    }
                });
            } else {
                callback("Not exists");
            }
        });
    } catch (err) {
        console.log(err);
        callback("Not exists");
    }
}


async function isUserStoreManager(usern, callback) {
    try {
        await connection.query(`select * from pinkblue.roles where user = '` + usern + `';`, function(error, results, fields) {
            if (error) return "Not exists";
            results = JSON.parse(results[0].role);
            roles = results.roles;

            for (i = 0; i < roles.length; i++) {
                if (roles[i] === "Store Manager") {
                    callback(true);
                    return;
                }
            }
            callback(false);
        });
    } catch (error) {
        console.log("NOT EXISTS")
        return "Not exists"
    }
}

app.get(["/ping", "/sping"], function(req, res) {
    res.status(200).end('Ping OK');
});


app.use(function(err, req, res, next) {
    console.log("Entered default error handler of express")
    console.error(err.message); // Logs error message in our server's console
    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
    res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

const host = process.env.NODE_ENV === 'production' ? 'localhost' : '0.0.0.0';
app.listen(port, host);
console.log(`Node server started on ${port}`);