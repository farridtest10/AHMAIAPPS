import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CommonActions } from '@react-navigation/native';
import { useTheme } from '@/theme';
import { Brand } from '@/components/molecules';
import { SafeScreen } from '@/components/template';

function Startup({ navigation }) {
	const { layout, gutters, fonts } = useTheme();
	const { t } = useTranslation(['startup']);
	const { isSuccess, isFetching, isError } = useQuery({
		queryKey: ['startup'],
		queryFn: () => {
			return Promise.resolve(true);
		},
	});
	useEffect(() => {
		if (isSuccess) {
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: 'Home' }],
				}),
			);
		}
	}, [isSuccess]);
	return (
		<SafeScreen>
			<View
				style={[
					layout.flex_1,
					layout.col,
					layout.itemsCenter,
					layout.justifyCenter,
					{ width: '100%', height: '100%' },
				]}
			>
				<Brand />
				{isFetching && (
					<ActivityIndicator size="large" style={[gutters.marginVertical_24]} />
				)}
				{isError && (
					<Text style={[fonts.size_16, fonts.red500]}>
						{t('startup:error')}
					</Text>
				)}
			</View>
		</SafeScreen>
	);
}

export default Startup;
