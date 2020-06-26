# VisitorManagement
Name:
Project Visitor Management System

Description:

   Home Page:
    Background Animation.
    Image shape animation.
    Responsive Nav-bar.
    Register and login options for the user.

  User page:
    After logging/registering in the user will be directed to the userpage.
    This page contains information about different buildings in our Campus.
    After that, user have to give his/her visiting info(in a form) for the visit.
    We also added the email feature in which an email will also be sent to a university person(maybe incharge of visitor management) to verify and allow/disallow the visitor and also to provide visitor the entry gate no(if allowed) for his/her visit.  
    Gate-pass:
    An email will also be sent to the visitor regarding further details(Gate pass).
    Security guard’s name will be entered at the entry gate.
    There is an option provided for the visitor to download the gate pass in the email itself.
  Check-out page:
    After the visitor completes the campus tour, he will have to fill a small feedback form, which will be provided to him in the gate-pass itself.
    Also, exit gate no will be filled into the database.
  Admin page:
    Admin has access to all the user and visiting information along with entry and exit gate numbers and user feedbacks.
  Technologies used:
    Html,css,javascript.
    MongoDb.
    GoormIDE.
    Node and Express.
    Passport for authentication.
    Git and GitHub.
    Semantic Ui and Bootstrap(slight).
    Jquery.

Authors and acknowledgment

  1)Hriday-->hridaynagrani@gmail.com
  2)Kashish-->kashishshah1411@gmail.com
 
Installation :

      npm i -  "express": "^4.17.1"
                body-parser": "^1.19.0",
                "connect-flash": "^0.1.1",
                "downloadjs": "^1.4.7",
                "ejs": "^3.1.3",
                "express-flash": "0.0.2",
                "express-session": "^1.17.1",
                "file-saver": "^2.0.2",
                "filesaver": "0.0.13",
                "jquery": "^3.5.1",
                "jsdom": "^16.2.2",
                "method-override": "^3.0.0",
                "mongoose": "^5.9.19",
                "nodemailer": "^6.4.10",
                "passport": "^0.4.1",
                "passport-local": "^1.0.0",
                "passport-local-mongoose": "^6.0.1"

      
Usage:
   
   1)Apply for Registration.
   2)Apply for your campus Visit.
   3)Wait for a response , u will get a response soon regarding approval/rejection of your visit along with a gatepass in your email provided.
   4)Enter Gaurd name and go for campus visit.
   5)Give feedback after your visit ends.

Roadmap
  1)Currently working on GoormIDE,have plans to Deploy it on Heroku in future
  2)Deploying local database to Mongolab (Cureenlty using local mongo)
  3)Currenly using passport for authentication, plans to change that too
   
   
