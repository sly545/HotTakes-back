const http = require('http');

//j'importe l'application 
const app = require('./app');


const normalizePort = val => {
const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};



const port = normalizePort(process.env.PORT);
app.set('port', port);

//la fonction errorHandler recherche les ereures et les enregistre sur le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//creation du server 
const server = http.createServer(app);
//errorHanddler pour gerer les erreurs comme pour le port 3000
server.on('error', errorHandler);
//ecouter d'evenement qui ecoute le port 3000 et ensuite il indique çe qui si il est bien sur le bon port.
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});   

server.listen(port);
