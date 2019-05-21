package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const maxUploadSize = 5 * 1024 * 1024 // 5MB
const uploadPath = "./data/"

func rootHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	message := "Hello"

	w.Write([]byte(message))
}

func profileHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	if r.Method == "POST" {
		uploadHandler(w, r)
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	uid := r.URL.Path[len("/camera/upload/"):]

	// valid file size
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
	err := r.ParseMultipartForm(maxUploadSize)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("uploadFile")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()

	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fileType := http.DetectContentType(fileBytes)
	if fileType != "image/jpeg" && fileType != "image/jpg" && fileType != "image/png" {
		http.Error(w, "INVALID_FILE_TYPE", http.StatusInternalServerError)
		return
	}

	fileName := time.Now().Format("20060102150405")

	fileEndings, err := mime.ExtensionsByType(fileType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create directory
	path := filepath.Join(uploadPath, uid)
	os.MkdirAll(path, os.ModePerm)

	absPath, err := filepath.Abs(uploadPath + uid + "/" + fileName + fileEndings[0])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = ioutil.WriteFile(absPath, fileBytes, 0600)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	message := "Save Successfully"
	w.Write([]byte(message))

	fmt.Printf("User %s saved image %s successfully\n", uid, fileName+fileEndings[0])
}

func cameraHandler(w http.ResponseWriter, r *http.Request) {
	// Get file
	fileName := r.URL.Path[len("/camera/test/"):]
	if len(fileName) == 0 {
		http.Redirect(w, r, "/camera/test/index.html", http.StatusFound)
	} else {
		data, err := ioutil.ReadFile(fileName)
		if err != nil {
			w.WriteHeader(404)
			return
		}

		var contentType string

		if strings.HasSuffix(fileName, ".css") {
			contentType = "text/css"
		} else if strings.HasSuffix(fileName, ".html") {
			contentType = "text/html"
		} else if strings.HasSuffix(fileName, ".js") {
			contentType = "application/javascript"
		} else {
			contentType = "text/plain"
		}

		w.Header().Add("Content-Type", contentType)
		w.Write(data)

		return
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func main() {
	http.HandleFunc("/camera", rootHandler)
	http.HandleFunc("/camera/upload/", profileHandler)
	http.HandleFunc("/camera/test/", cameraHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
