
# Arane, a decentralized social network.

Arcane is a decentralized social network that allows users to sign up to a particular server. Users can follow any user on that server and any user on any server that is "friends" with the server that they signed up on. Each server is identified with its url.

A server admin can add a server as a friend by generating a unique key for them and requesting a key from them. If the server accepts, a key will be sent to the admin.

Another unique feature of Arcane is that user posts are stored on IPFS and users can move their accounts (posts and user info) to another server of their choosing.
## Run Locally


1. Install IPFS kubo.

2. Clone the project

```bash
  git clone https://github.com/furqanulaalam/arcane.git
```

3. Go to the project directory

```bash
  cd arcane
```

4. Install dependencies

Setting up client side

```bash
  cd frontend
  npm install
```

Setting up server side

```bash
  cd backend
  npm install
```

5. Specify these environment variables in server and client directories in a .env file

&nbsp;&nbsp;&nbsp;&nbsp;ACCESS_TOKEN_SECRET

&nbsp;&nbsp;&nbsp;&nbsp;DB_URL

&nbsp;&nbsp;&nbsp;&nbsp;SERVER_URL

&nbsp;&nbsp;&nbsp;&nbsp;REACT_APP_SERVER_URL

6. Start backend server from the server directory by running:

```bash
  node app.js
```

7. Start frontend server from the client directory by running:

```bash
  npm start
```

## Thank you!