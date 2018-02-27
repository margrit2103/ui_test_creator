package main

import (
	"encoding/json"
	"fmt"
	"log"
	"reflect"

	"golang.org/x/net/websocket"
)

type Data struct {
	DataType string `json:"type"`
	Name     string `json:"name"`
}

func api() {
	origin := "http://localhost/"
	url := "ws://localhost:9000/remote_ws"
	fmt.Println("Connecting to WebSocket:", url)
	ws, err := websocket.Dial(url, "", origin)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to WebSocket:", ws)

	var msg = make([]byte, 128)
	var n int
	for {
		if n, err = ws.Read(msg); err != nil {
			log.Fatal(err)
		}
		newMsg := msg[:n]
		fmt.Printf("Received: %s\n%s\n", newMsg, reflect.TypeOf(newMsg))

		var dat []Data
		if err := json.Unmarshal(newMsg, &dat); err != nil {
			panic(err)
		}
		fmt.Println(dat)

		handleRead(dat, ws)

		if _, err := ws.Write([]byte(`{"testing": "Running", "value": "jou ma"}`)); err != nil {
			log.Fatal(err)
		}
	}
}

func handleRead(dat []Data, ws *websocket.Conn) {
	for obj := range dat {
		fmt.Printf("dataType = %v, name = %v\n", dat[obj].DataType, dat[obj].Name)
		switch dat[obj].DataType {
		case "test":
			TCase(dat[obj].Name)
		case "suite":
			TSuite(dat[obj].Name)
		default:
			if _, err := ws.Write([]byte("Unknow")); err != nil {
				log.Fatal("handleRead Error: ", err)
			}
		}
	}
}
