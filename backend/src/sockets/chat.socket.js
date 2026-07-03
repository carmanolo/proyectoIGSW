import { Server } from "socket.io";

const chatHistory = []; // Memoria volátil para MVP

export const initializeSockets = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado al chat:", socket.id);

    // Enviar historial al conectarse
    socket.emit("chat_history", chatHistory);

    // Cuando un usuario envía un mensaje
    socket.on("send_message", (data) => {
      console.log("Mensaje recibido:", data);
      
      const messageData = {
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      chatHistory.push(messageData);

      if (chatHistory.length > 200) {
        chatHistory.shift();
      }

      // Reenviar a TODOS
      io.emit("receive_message", messageData);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado del chat:", socket.id);
    });
  });

  return io;
};
