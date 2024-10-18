import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, Startup, CameraScreen } from '@/screens';
import { useTheme } from '@/theme';
import LoggerButton from '@/components/general/LoggerButton';

const Stack = createStackNavigator();
function ApplicationNavigator() {
	const { variant, navigationTheme } = useTheme();
	return (
		<SafeAreaProvider>
			<NavigationContainer theme={navigationTheme}>
				<Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Startup" component={Startup} />
					<Stack.Screen name="Home" component={Home} />
					<Stack.Screen name="Camera" component={CameraScreen} />
				</Stack.Navigator>
				{/* <LoggerButton /> */}
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
export default ApplicationNavigator;
