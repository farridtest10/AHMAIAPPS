/* eslint-disable no-console */
/* eslint-disable react/jsx-boolean-value */

/* eslint-disable no-use-before-define */
import { useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	Image,
	Dimensions,
	Alert,
	Modal,
	TextInput,
	Platform,
} from 'react-native';
import {
	Camera,
	useCameraDevice,
	useCameraPermission,
} from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
// import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { instanceGCP, setAuthToken } from '@/services/instance';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const getAccessToken = async () => {
	const token = storage.getString('authToken');
	return token;
	// return 'ya29.a0AcM612wN96Rk1RsalTliJQvg9udFQmIrgVbfzxHeVo4eg9IqETGIdWfeXHNz7UBElR7HM1bZpKF1XXmsaL-4fZi8J5ixtJYNSQBo5qj1lSKyzZnNLGaaVf7N8lWSnIC5aTnuhOlgsss3QZo2I40w2-foy3ymXAI7o2dEkwpt6rlfHbUaCgYKAcYSARMSFQHGX2MifU-SWXevXim7WI_u46uSZA0182';
};

function CameraScreen() {
	// const device = useCameraDevice('front');
	const device = useCameraDevice('back', {
		physicalDevices: ['wide-angle-camera'],
	});
	const { hasPermission } = useCameraPermission();
	const navigation = useNavigation();
	const cameraRef = useRef(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modelNumber, setModelNumber] = useState('');
	const [photo, setPhoto] = useState(null);
	const [anomalyOverlayUrl, setAnomalyOverlayUrl] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const takePhoto = async () => {
		if (cameraRef.current) {
			let photoData = await cameraRef.current.takePhoto({
				flash: 'off',
			});

			if (Platform.OS === 'android') {
				photoData.path = `file://${photoData.path}`;
			}

			setPhoto(photoData);
		}
	};

	const handleRetake = () => {
		setPhoto(null);
	};

	const handleAccept = () => {
		setIsModalVisible(true);
	};

	const handleProcessing = async () => {
		setIsLoaded(true);
		if (!photo) return;

		try {
			const resizedPhoto = await ImageResizer.createResizedImage(
				photo.path, // Image path
				2268, // Max width
				4032, // Max height
				'JPEG', // Output format
				35, // Quality (you can lower it to reduce size)
				0, // Rotation (0 means no rotation)
				true,
			);
			console.log("🚀 ~ handleProcessing ~ resizedPhoto:", resizedPhoto)

			// Fetch the resized image and convert it to base64
			const response = await fetch(resizedPhoto.uri);
			const blob = await response.blob();

			// Convert the resized image to a Base64 string
			const reader = new FileReader();
			reader.readAsDataURL(blob);

			reader.onloadend = async () => {
				const base64data = reader.result.split(',')[1]; // Base64 image data

				// Prepare the JSON payload
				const payload = {
					instances: [{ content: base64data }],
					parameters: {
						confidenceThreshold: 0.4,
						maxPredictions: 5,
					},
				};

				// Make the request to the AI platform
				try {
					const token = await getAccessToken();
					setAuthToken(token);

					const result = await instanceGCP
						.post(
							'projects/192727520777/locations/us-central1/endpoints/8422823118229209088:predict',
							{ json: payload },
						)
						.json();

					console.log('Prediction result:', result.predictions);

					const { confidences, displayNames } = result.predictions[0];
					let isConfident = false;
					let predictionMessage = 'Model Spare Parts is not confident';
					let detailsMessage = '';

					for (let i = 0; i < confidences.length; i++) {
						if (confidences[i] > 0.45) {
							isConfident = true;
						}
						detailsMessage += `${displayNames[i]}: ${(confidences[i] * 100).toFixed(
							2,
						)}%\n`;
					}

					if (isConfident) {
						predictionMessage = 'Model Spare Parts is Confident';
					}

					Alert.alert(
						`Prediction result: ${predictionMessage}`,
						`Details:\n${detailsMessage}`,
					);
				} catch (error) {
					console.error('Error making prediction:', error);
				}
			};

			// const formData = new FormData();
			// formData.append('image', {
			// 	uri: photo.path,
			// 	// uri: resizedPhoto.uri,
			// 	type: 'image/jpeg',
			// 	name: 'image.jpg',
			// });
			// // formData.append('projectName', 'ahmbaruu');
			// // formData.append('modelVersion', modelNumber ?? '1');
			// formData.append('projectName', 'ahmatuhlah');
			// formData.append('modelVersion', modelNumber ?? '1');
			// formData.append('contentType', 'image/jpeg');

			// // Send request
			// const response = await fetch(
			// 	'http://192.168.0.97:3000/detect-anomalies',
			// 	// 'https://ahm-beta-services.onrender.com/detect-anomalies',
			// 	{
			// 		method: 'POST',
			// 		headers: {
			// 			'Content-Type': 'multipart/form-data',
			// 		},
			// 		body: formData,
			// 	},
			// );

			// const result = await response.json();

			// console.log('Prediction result:', result);
			// console.log('Prediction X:', result?.DetectAnomalyResult ?? 'No result');

			// const { confidences, displayNames } = result.predictions[0];
			// let isConfident = false;
			// let predictionMessage = 'Model Spare Parts is not confident';
			// let detailsMessage = '';

			// for (let i = 0; i < confidences.length; i++) {
			// 	if (confidences[i] > 0.8) {
			// 		isConfident = true;
			// 	}
			// 	detailsMessage += `${displayNames[i]}: ${confidences[i].toFixed(2)}\n`;
			// }

			// if (isConfident) {
			// 	predictionMessage = 'Model Spare Parts is Confident';
			// }

			// Alert.alert(
			// 	`Prediction result: ${predictionMessage}`,
			// 	`Details:\n${detailsMessage}`
			// );
			// const confidence = (result?.DetectAnomalyResult.Confidence * 100).toFixed(2);
			// Alert.alert(
            //     `Prediction result: ${result?.DetectAnomalyResult.IsAnomalous ? 'Not Confident' : 'Confident'}`,
            //     `Details:\n${confidence}%`,
            //     [
            //         {
            //             text: 'OK',
            //             onPress: () => setAnomalyOverlayUrl(result?.DetectAnomalyResult.AnomalyOverlayUrl),
            //         },
            //     ],
            // );
		} catch (error) {
			console.error('Error processing image:', error);
		} finally {
			setIsLoaded(false);
		}

		// navigation.goBack();
	};

	if (!hasPermission) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Camera permission denied</Text>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.goBack()}
				>
					<Text style={styles.buttonText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	if (device == null) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#ffffff" />
				<Text style={styles.text}>Loading camera...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{photo ? (
				<View style={styles.previewContainer}>
					{anomalyOverlayUrl ? (
						<Image
							source={{ uri: anomalyOverlayUrl }}
							style={styles.preview}
						/>
					) : (
						<Image source={{ uri: photo.path }} style={styles.preview} />
					)}
					<View style={styles.buttonContainer}>
						{anomalyOverlayUrl ? (
						<TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
							<Text style={styles.buttonText}>Go Back</Text>
						</TouchableOpacity>
						) : (
							<>
							<TouchableOpacity style={styles.button} onPress={handleRetake}>
								<Text style={styles.buttonText}>Retake</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.button} onPress={handleProcessing} disabled={isLoaded}>
							{/* <TouchableOpacity style={styles.button} onPress={handleAccept} disabled={isLoaded}> */}
								<Text style={styles.buttonText}>Accept</Text>
							</TouchableOpacity>
							</>
						)}
					</View>
				</View>
			) : (
				<>
					<Camera
						style={StyleSheet.absoluteFill}
						device={device}
						isActive
						ref={cameraRef}
						photo={true}
						// format={format}
					/>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={takePhoto}>
							<Text style={styles.buttonText}>Take Photo</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.button}
							onPress={() => navigation.goBack()}
						>
							<Text style={styles.buttonText}>Go Back</Text>
						</TouchableOpacity>
					</View>
				</>
			)}

			{isLoaded && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="large" color="#ffffff" />
					<Text style={styles.text}>Processing image...</Text>
				</View>
			)}


			<Modal
				animationType="slide"
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => {
					setIsModalVisible(false);
				}}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'rgba(0,0,0,0.5)',
					}}
				>
					<View
						style={{
							backgroundColor: 'white',
							borderRadius: 10,
							width: 250,
							height: 180,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<TextInput
							style={{
								marginTop: 16,
								marginHorizontal: 16,
								borderWidth: 1,
								padding: 8,
								borderRadius: 5,
								width: '90%',
							}}
							placeholder="Model Number"
							value={modelNumber}
							onChangeText={setModelNumber}
							keyboardType="number-pad"
							maxLength={1}
						/>
						<TouchableOpacity
							style={{
								backgroundColor: 'red',
								borderRadius: 5,
								padding: 10,
								marginTop: 24,
								width: '90%',
							}}
							onPress={() => {
								setIsModalVisible(false);
								handleProcessing();
							}}
							disabled={!modelNumber}
						>
							<Text>Submit</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	text: {
		color: 'white',
		fontSize: 18,
		marginBottom: 20,
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 40,
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 20,
	},
	button: {
		backgroundColor: 'white',
		padding: 10,
		borderRadius: 5,
		marginHorizontal: 10,
	},
	buttonText: {
		color: 'black',
		fontSize: 16,
	},
	previewContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	preview: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CameraScreen;
