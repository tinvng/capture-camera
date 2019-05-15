package main

import (
	"log"
	"net/http"
)

type Photo struct {
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	message := "hello david"

	w.Write([]byte(message))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func main() {
	http.HandleFunc("/", rootHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
