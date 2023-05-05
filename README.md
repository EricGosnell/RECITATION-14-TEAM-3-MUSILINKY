# RECITATION-14-TEAM-3-MUSILINKY
**CSCI 3308 Final Group Project**

1. This application is named Musalinky. It is a music app that allows users to search for songs via
albums, genres, artists, or tracks. Users can then add and delete these songs in a playlist. Users are also capable of creating, joining, and leaving communities. The unique feature of this app is that it allows users to generate links to songs on other platforms. This is ideal for users who receive links to songs on platforms that they do not have.

For more information please see the instructions in the app

**2. Contributors**

Name | Github Username | CU Boulder Email
-----|:---------------:|:---------------:
Alex Burch | aburch280 | brbu3004@colorado.edu
Silas Khan | SKhan6571 | sikh2008@colorado.edu
Eric Gosnell | EricGosnell | eric.gosnell@colorado.edu
Patrick Fleming | PFActual | pafl9686@colorado.edu
Tyler Chung | tylertchung | tych9812@colorado.edu
Cade Williams | CadeBW | cawi6141@colorado.edu

**3. Technology Stack**
  - Postgres SQL (Database)
  - EJS (User Interface)
  - NodeJS (Application Server)
  - GitHub (VCS Repository)
  - Visual Studio Code (IDE)
  - EJS, CSS, and Bootstrap (UI tools)
  - Microsoft Azure (Deployment Environment)
  - Mocha and Chai (Testing Tools)
  - MusicAPI, DuckDuckGo API, Deezer, and Soundcloud Downloader (External APIs)

**4. Software Prerequisites**
  - Docker is the only software prequisite for this app. Since the application is built and managed within Docker containers, the user will need to have this software installed in order to run the app.

**5. How to Run Musalink Locally**
  - If accessing the app using localhost:
      1. Run docker-compose up in the directory with the docker compose file.
      2. Go to http://localhost:3000/ in your preferred web browser.
      3. You will be now be directed to the sign in page. Once you sign into the app, you will be able to use it. For more information about how to use Musalinky, please refer the above app description and in-app instructions.

  - If accessing the app using Microsoft Azure:
      1. Run sudo docker-compose up -d in the directory with the docker compose file.
      2. Go to http://recitation-14-team-03.eastus.cloudapp.azure.com:3000/login in your preferred web browser.
      3. You will be now be directed to the sign in page. Once you sign into the app, you will be able to use it. For more information about how to use Musalinky, please refer the above app description and in-app instructions.

**6. How to Run the Tests**
  1. First copy the following into the package.json file in the app:
  
              {
                "name": "project-3308",
                "main": "index.js",
                "dependencies": {
                  "ejs": "^3.1.8",
                  "ejs-lint": "^0.3.0",
                  "express": "^4.6.1",
                  "pg-promise": "^10.11.1",
                  "body-parser": "1.20.0",
                  "express-session": "1.17.3"
                },
                "devDependencies": {
                  "nodemon": "^2.0.7",
                  "chai": "^4.2.0",
                  "chai-http": "^4.3.0",
                  "mocha": "^6.2.2",
                  "npm-run-all": "^4.1.5"
                },
                "scripts": {
                  "prestart": "npm install",
                  "start": "node index.js",
                  "dev": "nodemon server.js",
                  "test": "mocha",
                  "testandrun": "npm run prestart && npm run test"
                }
              }
                        
  2. Change the command at the bottom of the docker compose file to 'npm run testandrun'.
  
  3. Run docker-compose up. The unit test cases using mocha and chai should already be present in the server.spec.js file. Once docker has started, you should be able to see the results of the test cases on the terminal.

**7. Link to the Deployed Application**
  - http://recitation-14-team-03.eastus.cloudapp.azure.com:3000/login
