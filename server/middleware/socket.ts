import { Server } from 'socket.io'

export default defineEventHandler((event) => {
  if (!event.context.io) {
    // @ts-expect-error: Missing server property in socket
    const server = event.res.socket?.server
    const io = new Server(server);

    // Access to connected clients on all routes
    event.context.connections = new Set()
    // Access to io on all routes
    event.context.io = io

    io.on('connection', (socket) => {
        socket.on('message', (data) => {
            const newData = {
                userId: data.userId,
                message: data.message,
                date: new Date().getTime()
            }

            io.emit("newMessage", newData);
        })
  
        /*socket.on('joinRoom', (roomName) => { //Change room and announce it
            socket.join(roomName);
            io.to(socket.id).emit("joinedRoom", roomName);
  
            io.to(roomName).emit("receivedMessage", `New user joined the ${roomName} room!`);
  
            if(roomName === "Default") {
                let i = 0;
                socket.rooms.forEach(room => {
                    if(i > 0) {
                        socket.leave(room);
                    }
                    i++;
                });
            }
        })*/
        
        //User disconnected
        socket.on("disconnect", () => {
            console.log("User disconnected")
        })
    })
  }
})