import React, { Component } from "react";
import { Row, Container, Image, Button } from "react-bootstrap";

import { uploadHandler } from "../utils/functions";
import { VIDEO_SIZE } from "../utils/configs";

class FileInputVersion extends Component {
  state = {
    selectedFile: null,
    src: null,
  }

  handleChangeInputFile = event => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        selectedFile: event.target.files[0],
        src: URL.createObjectURL(event.target.files[0]),
      });
    }
  };
  
  onSubmit = () => {
    const { selectedFile } = this.state;

    if (selectedFile) {
      uploadHandler(selectedFile, selectedFile.FileName);
		}
  }

  render() {
    return (
      <Container>
        <Row className='justify-content-center mt-2'>
          <input
            type="file"
            accept="image/*;capture=camera"
            onChange={this.handleChangeInputFile}
          />
        </Row>

        {this.state.selectedFile ? (
          <Container>
            {/* Image Display */}
            <Row className="justify-content-center mt-2">
              <Image
                fluid
                src={this.state.src}
                alt=""
                style={{
                  objectFit: "contain",
                  ...VIDEO_SIZE,
                }}
              />
            </Row>

            {/* Button Send Image to server */}
            <Row className="my-2 justify-content-center">
              <Button
                variant="outline-info"
                size="sm"
                onClick={this.onSubmit}
              >Send To Server</Button>
            </Row>
          </Container>
        ) : null}
      </Container>
    );
  }
}

export default FileInputVersion;
