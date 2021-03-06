# Project Description:
- There are 2 roles: Store Assistant, Store Manager
- A user record consists of username, password and email
- One user can map to multiple roles and vice versa
- An inventory record consists of the following details: Product Id, Product Name,
Vendor, MRP, Batch Num, Batch Date, Quantity (Stock on Hand) and Status
(Approved/Pending)
- A user mapped as Store Assistant needs the approval of Store Manager for
adding/changing/removing inventory record
- A user mapped as Store Manager can:
   - Add/change/remove inventory record without any approval (auto-approved)
   - Fetch the list of all inventory items pending for approval and approve them

# How To Install & Test:

- Pull this package & run command "npm install".

- Install MySQL server(make sure its running) & insert rows for testing.
      #change DB credentials accordingly here https://github.com/kdineshreddy009/pinkblue/blob/master/connectToDB.js

- Create 3 tables under DB name:pinkblue. For simplicity, i inserted all of them as VARCHAR.
     - Table name:InventoryRecord 

           coloumns: ProductId(PK),ProductName,Vendor,MRP,BatchNum, BatchDate,Quantity,Status
           
           Example record:
           ProductId, ProductName, Vendor,      MRP,  BatchNum,   BatchDate,   Quantity, Status
                 '1', 'vix',      'Dr.Reddys', '1.5', '1994',     '21/08/94',   '1',     'approved'
                 '2', 'Halls',    'Plabs',     '1111', '1122121', '2019-12-02', '12',    'pending'   
         
           Query:
            REPLACE INTO InventoryRecord(ProductId,ProductName,Vendor,MRP,BatchNum,BatchDate,Quantity,Status) VALUES (6,"vix","Dr.Reddys","1.5","1994","2InventoryRecordroles1/08/94",1,"pending");


     - Table name:users
       
           coloumns: username(PK),password,mail(PK)
          
           Example record:
           username, password, mail
           'owner',  '123',   'owner@pinkblue.com'
           'staff', '1234', 'staff@pinkblue.com'
       
           Query:
           INSERT INTO users(username, password,mail) VALUES ('staff', '1234',"staff@pinkblue.com");
           INSERT INTO users(username, password,mail) VALUES ('owner', '123',"owner@pinkblue.com");

            NOTE:
            Best Practise-DB passwords requires encryption on server side & then inserting into DB. Which is not implemented yet

   - Table name:roles
         
         coloumns:user(PK),role {role is set as JSON here}

         Example record:
         user,   role
         owner	   {"roles": ["Store Manager"]}
         staff	   {"roles": ["Store Assistant"]}

         Queries:      
         REPLACE INTO roles(user, role) VALUES ('owner','{"roles":["Store Manager"]}');
         REPLACE INTO roles(user, role) VALUES ('staff','{"roles":["Store Assistant"]}');
      
      
- To make server Up,run command : 
                  
                  nodemon server.js 

- Now login with the username & password you inserted into DB
            
            http://localhost:9443/

- If you login with staff, you will be able to only add inventory & status will be pending. If logged as owner, you can add without approval and owner can fetch pending inventory & approve it
