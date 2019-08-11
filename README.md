# Project Title

A RESTful API for NC News - a Reddit-style news website where readers can comment and vote on stories on given topics.

## Getting Started

These instructions will get you a copy of the NC News API up and running on your local machine.

### Prerequisites

Node.js

### Setup:

To test if Node.js is installed on your machine enter the following command in your command line:

```
npm -v
```

This should return a version number; if you still need to install Node.js please follow the instructions [here](https://nodejs.org/en/download/package-manager/#macos).

Once you have Node.js set up on your machine, you will need to clone this repository to a local directory.  
On the command line navigate to the parent directory where you would like to store the repository and run the following command:

```
git clone https://github.com/lukedavidjohn/be-nc-news.git
```

Navigate into the directory on the command line then run the following command to install all of the dependencies from the package.json:

```
npm install
```

To set up the database run the following commands in order:

```
npm run setup-dbs
npm run migrate-latest
npm run seed-test
npm run seed-dev
```

## Running tests

All utilities and API calls on this repository are fully tested. Tests can be found in the spec folder.

To test API calls run this command in the command line:

```
npm run test
```

To test utilities run:

```
npm run test-utils
```

## Author

Luke Rushworth

## Licence

This project is licensed under the MIT License - see the LICENSE.md file for details
