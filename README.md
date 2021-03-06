# Platform Architecture

## Backend
For the backend as the application it will be a lightweight service we can go with nodejs with express.
Express will help us a bit on managing the routes and save us some time there. It's quick to set-up too. I would also go for a serveless solution as the app is not necessary to consume resources constantly and it could be scaled as more users use it at a specific time. 


## Databese Schema

For this kind of simple application I decided to go with a document type database as Mongo. Firstly we will get 
a small gain on the reduced overhead that a traditional RDB will give but the main reason was the simplicity and
effectiveness of defining the schema and querying our data inside our code without the need to write SQL queries.
Also the fact that I can save the used names as an array of strings is quite handy as on a SQL db this is not an optimum way of storing the data and we might need to create a seperate table for the used names, ending up querying two tables in the end.


```json
    "username": { type: String },
    "password": { type: String },
    "name": { type: String },
    "previousNames": [String],
    "last_updated": { type: Date }
```

## Frontend

For the Frontend I would choose a solution like react or vue. Even through the application is not big it could help us create some simple reusable components or use components code from other apps (buttons, links, lists, etc). 
Furthermore it could help on managing some states of our app, for example not having to send a new request for checking the list of the used names for a user or with the error handling.


## Code

For the sake of only demonstrating a usable ui with the requirements of the task I went the easy way on 
using pug templating and not separating the routes on their own directory(in case of more routes). :D


# Conclusion

As we discussed previously another framework or DB solution could be used as well with the necessary adjustments. To be honest I would ask my teammates to see with what technologies they are more comfortable to work with and base part of my final decision on that as well. :)


# Running with Docker
 
 Use the following commands for running the app using Docker:
 - Create a local network:
   **docker network create hrtest**
 - Run mongo:
   **docker run --name=mongo --rm --network=hrtest mongo**
 - Run hrtest app:
   **docker run --name=hrtest --rm --network=hrtest -p 5000:5000 -e MONGO_URL=mongodb://mongo:27017/hrtest pavanas/hrtest:1.0.0**
   