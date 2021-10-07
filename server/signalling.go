package server

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/websocket"
	"go.uber.org/zap"
)

// AllRooms global hashmap for the server
var AllRooms RoomMap

// CreateRoomRequestHandler Create a room and return room ID
func CreateRoomRequestHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	roomID := AllRooms.CreateRoom()

	type resp struct {
		RoomID string `json:"room_id"`
	}

	err := json.NewEncoder(w).Encode(resp{RoomID: roomID})
	if err != nil {
		zap.L().Error("CreateRoomRequestHandler error",
			zap.Any("Error in encoding", err.Error()))
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type broadcastMsg struct {
	Message map[string]interface{}
	RoomID  string
	Client  *websocket.Conn
}

var broadcast = make(chan broadcastMsg)

func broadcaster() {
	for {
		msg := <-broadcast

		for _, client := range AllRooms.Map[msg.RoomID] {
			if client.Conn != msg.Client {
				err := client.Conn.WriteJSON(msg.Message)

				if err != nil {
					zap.L().Error("broadcaster error",
						zap.Any("WriteJSON error", err.Error()))
					client.Conn.Close()
				}
			}
		}
	}
}

// JoinRoomRequestHandler Join in a particular room
func JoinRoomRequestHandler(w http.ResponseWriter, r *http.Request) {
	roomID, ok := r.URL.Query()["roomID"]

	if !ok {
		zap.L().Error("JoinRoomRequestHandler error : roomID missing in URL Parameters")
		return
	}

	ws, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		zap.L().Error("JoinRoomRequestHandler error",
			zap.Any("Upgrade error:", err))
		return
	}
	AllRooms.InsertIntoRoom(roomID[0], false, ws)

	go broadcaster()

	for {
		var msg broadcastMsg

		err := ws.ReadJSON(&msg.Message)
		if err != nil {
			zap.L().Error("JoinRoomRequestHandler error",
				zap.Any("ReadJSON error", err.Error()))
		}

		msg.Client = ws
		msg.RoomID = roomID[0]

		broadcast <- msg
	}

}
