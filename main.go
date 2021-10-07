package main

import (
	"log"
	"net/http"

	"github.com/viramjainkaleyra/video-chat-app/server"
	"go.uber.org/zap"
)

func main() {
	server.AllRooms.Init()

	http.HandleFunc("/create", server.CreateRoomRequestHandler)
	http.HandleFunc("/join", server.JoinRoomRequestHandler)
	log.Println("Starting server on port 8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		zap.L().Error("Error in starting server", zap.Any("Error:", err))
	}
}
