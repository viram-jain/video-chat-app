package main

import (
	"log"
	"net/http"
	"os"

	"video-chat-app/server"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

func main() {
	server.AllRooms.Init()
	err := godotenv.Load()
	if err != nil {
		zap.L().Error("Error in loading env file",
			zap.Any("Error:", err))
	}

	http.HandleFunc("/create", server.CreateRoomRequestHandler)
	http.HandleFunc("/join", server.JoinRoomRequestHandler)

	port := os.Getenv("PORT")
	if !(port == "") {
		log.Println("Starting server on port" + port)
		err := http.ListenAndServe(":"+port, nil)
		if err != nil {
			zap.L().Error("Error in starting server",
				zap.Any("Error:", err))
		}
	} else {
		log.Println("Starting server on port 8000")
		err := http.ListenAndServe(":8000", nil)
		if err != nil {
			zap.L().Error("Error in starting server",
				zap.Any("Error:", err))
		}
	}
}
