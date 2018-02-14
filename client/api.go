package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"golang.org/x/net/websocket"
)

func api() {
	origin := "http://localhost/"
	url := "ws://localhost:12345/ws"
	fmt.Println("Connecting to WebSocket:", url)
	ws, err := websocket.Dial(url, "", origin)
	if err != nil {
		log.Fatal(err)
	}
	if _, err := ws.Write([]byte("hello, world!\n")); err != nil {
		log.Fatal(err)
	}
	var msg = make([]byte, 30)
	var n int
	ws.SetReadDeadline(time.Now().Add(30 * time.Second))
	n, err = ws.Read(msg)
	if err != nil {
		fmt.Println("Initial read got nothing")
	}
	for {
		ws.SetReadDeadline(time.Now().Add(45 * time.Minute))
		if n, err = ws.Read(msg); err != nil {
			log.Fatal(err)
		}
		str := string(msg[:n])
		handleRead(str, ws)
		fmt.Printf("Received: %s\n", str)
	}

}

func handleRead(str string, ws *websocket.Conn) {
	newArray := strings.Split(str, ",")
	switch newArray[0] {
	case "test_case":
		intvar, err := strconv.Atoi(newArray[1])
		TCase(intvar)
	case "test_sutie":
		intvar, err := strconv.Atoi(newArray[1])
		TSuite(intvar)
	default:
		if _, err := ws.Write([]byte("Unknow")); err != nil {
			log.Fatal(err)
		}
	}
}
