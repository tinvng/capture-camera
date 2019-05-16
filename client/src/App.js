import React, { Component } from 'react';
import { Container, Button, Image, Row } from 'react-bootstrap'
import axios from 'axios';

const uid = "133135350005"
const addr = "http://localhost:8080/profile/" + uid

class App extends Component {
    state = {
        src: null,
        selectedFile: null,
    }

    handleChangeInputFile = event => {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                selectedFile: event.target.files[0],
                src: URL.createObjectURL(event.target.files[0]),
            })
        }
    }

    onSubmit = () => {
        if (this.state.selectedFile){
            this.uploadHandler();
        }
    }

    uploadHandler = () => {
        const formData = new FormData()

        formData.append("uploadFile", this.state.selectedFile, this.state.selectedFile.name)

        axios.post(addr, formData)
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log('error');
            })
    }

    uploadImage = function(src, type){
        console.log('run uploadImage')

        this.convertToBase64(src, type, function(data){
            this.sendBase64ToServer( data);
        });
    };

    convertToBase64 = function (url, imagetype, callback) {
        console.log('run converToBase64')

        var img = document.createElement('IMG'),
            canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            data = '';

        // Set the crossOrigin property of the image element to 'Anonymous',
        // allowing us to load images from other domains so long as that domain 
        // has cross-origin headers properly set

        img.crossOrigin = 'Anonymous'

        // Because image loading is asynchronous, we define an event listening function that will be called when the image has been loaded
        img.onLoad = function () {
            // When the image is loaded, this function is called with the image object as its context or 'this' value
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            data = canvas.toDataURL(imagetype);
            callback(data);
        };

        // We set the source of the image tag to start loading its data. We define 
        // the event listener first, so that if the image has already been loaded 
        // on the page or is cached the event listener will still fire

        img.src = url;
    };

    sendBase64ToServer = function(base64){
        console.log('run sendBase64ToSerVer')

        const httpPost = new XMLHttpRequest();
        const path = "http://localhost:8080/";
        const data = JSON.stringify({image: base64});
        
        httpPost.onreadystatechange = function(err) {
            if (httpPost.readyState === 4 && httpPost.status === 200){
                console.log(httpPost.responseText);
            } else {
                console.log(err);
            }
        };

        // Set the content type of the request to json since that's what's being sent
        httpPost.setHeader('Content-Type', 'application/json');
        httpPost.open("POST", path, true);
        httpPost.send(data);
    };

    render() {
        return (
            <Container>
                <input
                    className="mt-2"
                    type="file"
                    accept="image/*;capture=camera"
                    onChange={this.handleChangeInputFile}
                />

                {
                    this.state.selectedFile
                    ?
                    <Row className="justify-content-center mt-2">
                        <Image
                            fluid
                            src={this.state.src}
                            alt=""
                            style={{
                                objectFit: "contain",
                                width: 500,
                                height: 300,
                            }}
                        />
                    </Row>
                    : null
                }

                <Row className="mt-2 justify-content-center">
                    <Button
                        variant="outline-info"
                        onClick={this.onSubmit}
                    >Send to server</Button>
                </Row>
            </Container>
        );
    }
}

export default App;
