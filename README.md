# The emarket web app (client)

This project is a simple e-commerce web app with core features are posting product, real-time chating which are built using popular technologies such as ReactJS, NodeJS, SocketIo, PostgreSQL, etc.

Source:
- [Client](https://github.com/hieu-22/client-online-market-app.git)
- [Server](https://github.com/hieu-22/server-online-market-app.git)

## Installation
Clone the repository
```sh
$git clone https://github.com/hieu-22/server-online-market-app.git
```
Install dependencies by running npm install
```sh
npm install
```
For more information: [React documentation](https://reactjs.org/).
## Usage
### 1. Set .env file
```sh
PORT=3000
NODE_ENV=development
REACT_APP_BACKEND_URL=http://localhost:3001/api
REACT_APP_IS_LOCALHOST=1

# CLOUDINARY config, default: 
REACT_APP_CLOUDINARY_NAME="duhbzyhtj" 
REACT_APP_CLOUDINARY_UNSIGNED_UPLOAD_PRESET="qtfrqrsg"
```
If you want to use your own Cloudinary for image storage, read [React SDK](https://cloudinary.com/documentation/react_integration) for more information.
### 2. Run app
```sh
npm start
```
## Features
- Product Posting: Users can create their product information such as (images, title, prices, etc.). Other users can view, save, search, create chats with posts.
- Realtime Chating: Users can chat to each other within or without a specific post.

## Technologies Used
- ReactJS
- Redux/@toolkit
- SocketIO
- Tailwind CSS

## Contributing
### 1. Folder structure
```sh
- public
- src
  - app
  - components
  - features
    - Chat
      - chatPage.jsx
      - chatSlice.js
      - chatApi.js
    - Other features
  - utils
    - DateUtils.js
  - App.js
  - axios.js
  - cloudinary.js
  - index.js
  - socket.js
- .env
- tailwind.config.js
```
## License
I'm happy that someone appreciates my project and use it for their studying or any purposes. It's free to use this project.
