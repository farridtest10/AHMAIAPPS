import { useEffect, useState } from 'react';
import {
	View,
	ActivityIndicator,
	Text,
	TouchableOpacity,
	ScrollView,
	Alert,
	Dimensions,
	Modal,
	TextInput,
} from 'react-native';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ImageVariant } from '@/components/atoms';
import { Brand } from '@/components/molecules';
import { SafeScreen } from '@/components/template';
import { useTheme } from '@/theme';
import { fetchOne } from '@/services/users';
import { isImageSourcePropType } from '@/types/guards/image';
import SendImage from '@/theme/assets/images/send.png';
import ColorsWatchImage from '@/theme/assets/images/colorswatch.png';
import TranslateImage from '@/theme/assets/images/translate.png';
import { Camera } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { MMKV } from 'react-native-mmkv';

const { height } = Dimensions.get('window');

function Home() {
	const { t } = useTranslation(['example', 'welcome']);
	const {
		colors,
		// variant,
		// changeTheme,
		layout,
		gutters,
		fonts,
		components,
		backgrounds,
	} = useTheme();
	const navigation = useNavigation();
	const storage = new MMKV();

	const [currentId, setCurrentId] = useState(-1);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modelNumber, setModelNumber] = useState('');
	const { isSuccess, data, isFetching } = useQuery({
		queryKey: ['example', currentId],
		queryFn: () => {
			return fetchOne(currentId);
		},
		enabled: currentId >= 0,
	});
	useEffect(() => {
		if (isSuccess) {
			Alert.alert(t('example:welcome', data.name));
		}
	}, [isSuccess, data]);
	// const onChangeTheme = () => {
	// 	changeTheme(variant === 'default' ? 'dark' : 'default');
	// };
	const openCamera = async () => {
		const cameraPermission = await Camera.requestCameraPermission();
		if (cameraPermission === 'granted') {
			navigation.navigate('Camera');
		} else {
			Alert.alert('Camera permission denied');
		}
	};

	const onHitUpdate = async () => {
		storage.set('authToken', modelNumber);
		// const response = await fetch('https://ahm-beta-services.onrender.com/start-model', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({
		// 		projectName: 'ahmbaruu',
		// 		modelVersion: modelNumber,
		// 		minInferenceUnits: 1,
		// 	}),
		// });

		// const result = await response.json();
		// console.log("🚀 ~ onHitUpdate ~ result:", result)

		// Alert.alert('Model Updated to version ' + modelNumber);
		setIsModalVisible(false);
	};

	return (
		<SafeScreen>
			<ScrollView>
				<View
					style={[
						layout.justifyCenter,
						layout.itemsCenter,
						gutters.marginTop_80,
						{ height: height * 0.4 },
					]}
				>
					<View style={[layout.relative, components.circle250]} />
					<View style={[layout.absolute, gutters.paddingTop_80]}>
						<Brand height={300} width={300} />
					</View>
				</View>
				<View style={[gutters.paddingHorizontal_32, gutters.marginTop_40]}>
					<View style={[gutters.marginTop_40]}>
						<Text style={[fonts.size_40, fonts.gray800, fonts.bold]}>
							AHM AI - Quality Check
						</Text>
						<Text
							style={[
								fonts.gray400,
								fonts.bold,
								fonts.size_24,
								gutters.marginBottom_32,
							]}
						>
							Check the quality of spare parts
						</Text>
						<Text
							style={[fonts.size_16, fonts.gray200, gutters.marginBottom_40]}
						>
							Sampling of development AHM AI - Quality Check Super Apps to check
							the quality of spare parts
						</Text>
					</View>
					<View
						style={[
							layout.row,
							layout.justifyBetween,
							layout.fullWidth,
							gutters.marginTop_16,
						]}
					>
						<TouchableOpacity
							testID="change-theme-button"
							style={[components.buttonCircle, gutters.marginBottom_16]}
							onPress={openCamera}
						>
							<ImageVariant
								source={ColorsWatchImage}
								style={{ tintColor: colors.red500 }}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							testID="change-theme-button"
							style={[components.buttonCircle, gutters.marginBottom_16]}
							onPress={() => setIsModalVisible(true)}
						>
							<Text>Update</Text>
						</TouchableOpacity>
					</View>
				</View>

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
								style={[
									gutters.marginTop_16,
									gutters.marginHorizontal_16,
									fonts.size_16,
									fonts.gray800,
								]}
								placeholder="Enter Model Number"
								onChangeText={text => setModelNumber(text)}
								keyboardType="number-pad"
							/>

							<TouchableOpacity
								style={{
									backgroundColor: 'red',
									borderRadius: 5,
									padding: 10,
									marginTop: 24,
									width: '90%',
								}}
								onPress={onHitUpdate}
							>
								<Text
									style={{
										color: 'white',
										textAlign: 'center',
									}}
								>Grant</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									backgroundColor: 'gray',
									borderRadius: 5,
									padding: 10,
									marginTop: 8,
									width: '90%',
								}}
								onPress={() => setIsModalVisible(false)}
							>
								<Text
									style={{
										color: 'white',
										textAlign: 'center',
									}}
								>Close</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</ScrollView>
		</SafeScreen>
	);
}
export default Home;
