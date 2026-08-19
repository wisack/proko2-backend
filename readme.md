PROKO is an application initially developed for the use of the Faculty of Information and Electrical Engineering of the University of Oulu. The idea is to unify and streamline the faculty's group guidance by digitizing the guidance cards and reporting tools. The application allows users to perform guidance sessions and return the cards used in them, in digital format. In addition to this, higher hierachy users can monitor students progress in tutoring.

Frontend bundled in /build. Designed to be deployed on a server so the services point to '/api/...' directly. If you wish to run separate front locally to make changes, clone the separate proko-frontend repository and make sure the services point to 'http://localhost:3001/api/...'

.env values required to run

MONGODB_URI=

TEST_MONGODB_URI=

PORT=3001

SECRET=

PALAUTETOKENSECRET=

FEEDBACKLIMIT=15

RATELIMITERS=on

TOKENMINUTES=10080

PALAUTETOKENMINUTES=2880

BASEPASSWORD=

SLOWDOWNAFTER=500


The .env values should be added before starting to use the application as the program seeds some initial values required to run the program without having to touch the code.

$ npm run dev - uses the test database collection referred in TEST_MONGODB_URI
$ npm run start - uses the production database referred in MONGODB_URI
