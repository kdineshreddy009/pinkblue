FullStack Assignment:

Design and implement the frontend and backend for a basic inventory management
application.

Context:
1. There are 2 roles: Store Assistant, Store Manager
2. A user record consists of username, password and email
3. One user can map to multiple roles and vice versa
4. An inventory record consists of the following details: Product Id, Product Name,
Vendor, MRP, Batch Num, Batch Date, Quantity (Stock on Hand) and Status
(Approved/Pending)
5. A user mapped as Store Assistant needs the approval of Store Manager for
adding/changing/removing inventory record
6. A user mapped as Store Manager can:
  a. Add/change/remove inventory record without any approval (auto-approved)
  b. Fetch the list of all inventory items pending for approval and approve them


Folders: Public

Files: server.js & connectToDB.js
