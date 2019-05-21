import React, { Component } from "react";
import { Container, Button, Row, Alert } from "react-bootstrap";

import { VIDEO_SIZE } from "./utils/configs";
import { uploadHandler } from "./utils/functions";

class App extends Component {
  state = {
		isCaptured: false,
		showAlert: false,
	};
	
	componentDidMount() {
		if (navigator.getUserMedia){
			navigator.getUserMedia({
				video: { ...VIDEO_SIZE },
				audio: false,
			}, stream => {
				this.video.srcObject = stream;
				this.video.play()
			}, err => {
				console.error(err);
			})
		}
		else {
			console.log(`User don't have media`);
		}
	}
	
	onCapture = () => {
		this.setState({ isCaptured: true })

		this.canvas.getContext('2d')
			.drawImage(this.video, 0, 0, VIDEO_SIZE.width, VIDEO_SIZE.height);
	}

  onSubmit = () => {
		if (this.state.isCaptured) {
			this.canvas.toBlob(blob => {
				if (blob) {
					uploadHandler(blob, "captured picture")
						.then(response => {
							if (response.status === 200) {
								this.showAlert()

								setTimeout(this.hideAlert, 3000)
							}
						})
						.catch(err => {
							console.error(err);
						})
				}
			}, "image/jpg")
		}
	};
	
	showAlert = () => this.setState({ showAlert: true });

	hideAlert = () => this.setState({ showAlert: false });

  render() {
    return (
      <Container>
				{/* Alert Success Upload */}
				<Row className="justify-content-center mt-1">
					<Alert
						variant='success'
						show={this.state.showAlert}
						style={{ position: 'fixed', cursor: 'pointer' }}
						onClick={this.hideAlert}
					>Upload Successfully</Alert>
				</Row>

				{/* Video */}
				<Row className="justify-content-center mt-2">
					<video
						ref={ref => this.video = ref}
						style={{
							margin: 0,
							padding: 0,
							...VIDEO_SIZE,
						}}
					/>
				</Row>

				{/* Capture Button */}
				<Row className="mt-2 justify-content-center">
					<Button
						variant="outline-success"
						size="sm"
						onClick={this.onCapture}
					>Capture</Button>
				</Row>

				{/* Image Display with Canvas tag */}
				<Row className='mt-2 justify-content-center'>
					<canvas
						ref={ref => this.canvas = ref}
						width={VIDEO_SIZE.width}
						height={VIDEO_SIZE.height}
						style={{
							display: this.state.isCaptured ? 'flex' : 'none',
							objectFit: 'contain'
						}}
					/>
				</Row>

				{/* Button Send Image to server */}
				<Row
					className="my-2 justify-content-center"
					style={{
						display: this.state.isCaptured ? 'flex' : 'none',
					}}
				>
					<Button
						variant="outline-info"
						size="sm"
						onClick={this.onSubmit}
					>Send To Server</Button>
				</Row>
      </Container>
    );
  }
}

export default App;
