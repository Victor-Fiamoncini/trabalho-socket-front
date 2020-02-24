import io from 'socket.io-client'

export default io(process.env.REACT_APP_WS_URI || 'http://localhost:3001')
