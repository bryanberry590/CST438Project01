CST438 Project 01

News App -

This app uses an API called 'mediastack' which is updated in real-time from news sources around the world. We are using this API to create a scrolling app where users can login/create an account and then view news of all kinds and stay updated on what is going on in the world.

This is a React Native project that uses expo. We are building the app by running a backend server that communicates with the frontend code to stay up to date with the API. The frontend database will communicate with the screens of the app to display the correct information to the user.


For running the app:

1. 'npm install' to install all dependencies and packages

2. If there are errors installing, run 'rm -rf node_modules package-lock.json' then 'npm install'

This will delete the package-lock and do a fresh install of all packages from the package.json

3. Run the emulator, then run 'npm run dev' to run both the backend and frontend through one command

To see other run commands check the package.json under 'scripts'
