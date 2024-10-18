import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import NetworkLogger from 'react-native-network-logger';

function LoggerButton() {
	const [isVisible, setIsVisible] = React.useState(false);

	const handlePress = () => {
		setIsVisible(!isVisible);
	};

	if (isVisible) {
		return (
			<>
				<TouchableOpacity style={[styles.button, { bottom: '50%' }]} onPress={handlePress}>
					<Text style={styles.buttonText}>__L(X)G__</Text>
				</TouchableOpacity>
				<NetworkLogger />
			</>
		);
	}

	return (
		<TouchableOpacity style={styles.button} onPress={handlePress}>
			<Text style={styles.buttonText}>__LOG__</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		position: 'absolute',
		bottom: '20%',
		right: 20,
		backgroundColor: 'red',
		paddingHorizontal: 20,
		paddingVertical: 40,
		borderRadius: 50,
		elevation: 5,
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
	},
});

export default LoggerButton;
