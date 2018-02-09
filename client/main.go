package main

import (
	"log"
	"net/http"
)

// main function to boot up everything
func main() {
	router := NewRouter()
	log.Fatal(http.ListenAndServe(":8000", router))
}
