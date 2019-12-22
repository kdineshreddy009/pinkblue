function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function newRequest() {
    // document.getElementById("signin").disabled = true;
    let uname = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    url = "/login/" + uname + "," + password;
    // window.location= url;   
    $.ajax({
        type: 'get',
        url: url,
        contentType: 'application/x-www-form-urlencoded',
        success: function(data) {
            console.log("data received in newRequest()--", data);
            setCookie("pinkBlueUser", data, 1);

            if (data.toString() === "Store Manager") {
                window.location = "/storemanager_view/" + uname;
            } else if (data.toString() === "Store Assistant") {
                window.location = "/staff_view/" + uname;
            } else {
                let logDiv = document.getElementById("login_div");
                logDiv.innerHTML = "wrong user credentials";    
            }
        },
        timeout: 75000,
        error: function(data) {
            console.log("errored", data.toString());
            // $('#loaderid').hide();
        }
    });
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
    let th = document.createElement("th");
    let text = document.createTextNode("Approval Status");
    th.appendChild(text);
    row.appendChild(th);
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
        let cell = row.insertCell();
        cell.id = "cell-" + element.ProductId;
        let buton = document.createElement("BUTTON");
        buton.id = "button-" + element.ProductId;
        buton.onclick = sendForApproval;
        let disp = document.createTextNode("Approve it");
        buton.appendChild(disp);
        cell.appendChild(buton);
    }
}

function sendForApproval() {
    console.log("sendForApproval");
    let productId = this.id && this.id.split("-")[1];
    $.ajax({
        type: 'get',
        url: "/sendForApproval/" + productId,
        contentType: 'application/x-www-form-urlencoded',
        success: function(data) {
            $("#button-" + productId).hide();
            var msg = document.createTextNode("Sent For Approval");
            $("#cell-" + productId).append(msg);
            $("#cell-" + productId).show();
        },
        timeout: 75000,
        error: function(data) {
            // fetchInvDiv append a para of error as failed
            console.log("errored", data.toString());
        }
    });
}

function fetchInventory() {
    document.getElementById("FetchInventory").disabled = true;
    $.ajax({
        type: 'get',
        url: "/fetchInventory",
        contentType: 'application/x-www-form-urlencoded',
        success: function(data) {
            console.log("SQL output", data);
            let msg = document.getElementById("PendingProducts");
            if (data.error) {
                msg.innerHTML = "Failed to retrieve rows";
            } else if (data.length === 0) {
                console.log("No Pending Requests");
                msg.innerHTML = "No Pending Requests!";
            } else {
                let table = document.getElementById("PendingProducts");
                let sampleRow = Object.keys(data[0]);
                generateTableHead(table, sampleRow);
                generateTable(table, data);
            }
        },
        timeout: 75000,
        error: function(data) {
            // fetchInvDiv append a para of error as failed
            console.log("errored", data.toString());
        }
    });
}

function displayForm() {
    $("#add_inv_form").toggle();
}

function submitProduct() {
    $("#submitSuccess").show();
}

function newForm() {
    $("#submitSuccess").hide();
    // $('.add_inv_div').find('input:text').val('');
    $('.add_inv_div').find(':input').val('');
    document.getElementById("submit_back").value = "submit product";
}

function onLogOut() {
    console.log("logging out", document);
    document.cookie = "pinkBlueUser= ; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    console.log("cleared cookie");
    window.location = "/";
}

// newRequest("staff", "1234");


//On same webpage : use Ajax
//To switch web pages: use window location