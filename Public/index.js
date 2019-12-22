function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function newRequest() { 
    document.getElementById("signin").disabled = true;
    let uname = document.getElementById("username").value;
    let password = document.getElementById("password").value;

   	url= "/login/"+uname+","+password;
    // window.location= url;   
    $.ajax({
        type: 'get',
        url: url,
        contentType: 'application/x-www-form-urlencoded',
        success: function(data) {
            console.log("data received in newRequest()--",data);
            setCookie("pinkBlueUser",data,1);

            if(data.toString()==="Store Manager"){
                window.location= "/storemanager_view/"+uname;
            }else if(data.toString()==="Store Assistant"){
                window.location= "/staff_view/"+uname;
            }else{
                console.log("bad user");
            }
        },
        timeout: 75000,
        error: function(data) {
           console.log("errored",data.toString());
            // $('#loaderid').hide();
        }
    });
}

function onLogOut(){
    console.log("logging out",document);
    document.cookie = "pinkBlueUser= ; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    console.log("cleared cookie");
    window.location = "/";
}

// newRequest("staff", "1234");


//On same webpage : use Ajax
//To switch web pages: use window location  