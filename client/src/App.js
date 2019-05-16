import React, { Component } from "react";
import { Container, Button, Image, Row } from "react-bootstrap";
import axios from "axios";

const uid = "david";
const addr = "http://localhost:8080/profile/" + uid;

const size = {
	width: 500,
	height: 375,
}

class App extends Component {
  state = {
    src: null,
		selectedFile: null,
		usingFileInput: false,
		isCaptured: false,
	};
	
	componentDidMount() {
		if (navigator.getUserMedia){
			navigator.getUserMedia({
				video: {
					...size,
				},
				audio: false,
			}, stream => {
				this.video.srcObject = stream;
				this.video.play()
			}, err => {
				console.error(err);
			})
			console.log('true');
		}
		else {
			console.log(false)
		}
	}

  handleChangeInputFile = event => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        selectedFile: event.target.files[0],
        src: URL.createObjectURL(event.target.files[0])
      });
    }
	};
	
	onCapture = () => {
		this.setState({ isCaptured: true })

		console.log(this.video.videoWidth)
		console.log(this.video.videoHeight)


		this.canvas.getContext('2d').drawImage(this.video, 0, 0, size.width, size.height);
	}

  onSubmit = () => {
    if (this.state.selectedFile) {
      this.uploadHandler(this.state.selectedFile, this.state.selectedFile.FileName);
		}
		else if (this.state.isCaptured) {
			this.canvas.toBlob(blob => {
				if (blob) {
					this.uploadHandler(blob, "captured picture");
				}
			}, "image/jpg")
		}
  };

  uploadHandler = (file, fileName) => {
    const formData = new FormData();

    formData.append(
      "uploadFile",
      file,
      fileName,
    );

    axios
      .post(addr, formData)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log("error");
      });
  };

  render() {
    return (
      <Container>
				{
					this.state.usingFileInput
					?
					<div>
						<input
							className="mt-2"
							type="file"
							accept="image/*;capture=camera"
							onChange={this.handleChangeInputFile}
							/>
		
						<div>
							{this.state.selectedFile ? (
								<Row className="justify-content-center mt-2">
									<Image
										fluid
										src={this.state.src}
										alt=""
										style={{
											objectFit: "contain",
											...size
										}}
									/>
								</Row>
							) : null}
						</div>
					</div>
					:
					<div>
						<Row className="justify-content-center mt-2">
							<video
								ref={ref => this.video = ref}
								style={{
									margin: 0,
									padding: 0,
									...size,
								}}
							/>
						</Row>
						<Row className="mt-2 justify-content-center">
							<Button variant="outline-success" onClick={this.onCapture} size="sm">
								Capture
							</Button>
						</Row>
					</div>
				}

				{/* Image Display */}
				<Row className='mt-2 justify-content-center'>
					<canvas
						ref={ref => this.canvas = ref}
						width={size.width}
						height={size.height}
						style={{
							display: this.state.isCaptured ? 'flex' : 'none',
							objectFit: 'contain'
						}}
					/>
				</Row>

				{/* Send image to server */}
				<Row className="my-2 justify-content-center"
							style={{
								display: this.state.isCaptured ? 'flex' : 'none',
							}}
						>
							<Button
								variant="outline-info"
								onClick={this.onSubmit}
								size="sm"
							>
								Send To Server
							</Button>
						</Row>
      </Container>
    );
  }
}

export default App;
