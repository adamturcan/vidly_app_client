
This project is a client/server web app build in react.js/node.js. Purpose of this project was for me to test and learn React and Node.

This is a client side part of my app, which is build with react.js

to make this whole app work you will need also the "vidly_app_backend" part

after cloning this repo. download all needed packages using "npm i" command
when done to start the app type "npm start" command


if you would like to preview or test my app without cloning repo you can easily check it out on my heroku link:

//link will be added soon



How to Use:
 <Movies> - shows a list of all movies in database, to be rented, (user custom like button to point out your favorite movies), when clicking on the movies title, you will be redirected to the movies info or if Admin, you can edit the movie, if you are not logged in you will be redirected to the login page,if Admin you can also delete the movie or add new movie
 <Customers> - shows a list of each customer who ever rented a movie and how many movies they did rent, if Admin, shows a phone number also
 <Rental> - redirects you to a form to rent a movie , if not customer you will be asked to enter a name and phone number
 <Name> - redirects you to your profile page, where you can modify your nickname, view your current rents and also return them, you can allso view all your ever made rents and your favorite movies,
 <Login> - redirects you to a login form page
 <Register> - redirects you to a register form, when register automaticaly logs you in
 <log out> - logs you out
