import { View } from 'react-native';
import LogoLight from '@/theme/assets/images/ahm_logo.png';
import LogoDark from '@/theme/assets/images/ahm_logo.png';
import { ImageVariant } from '@/components/atoms';
import { useTheme } from '@/theme';
import { isImageSourcePropType } from '@/types/guards/image';

function Brand({ height = 200, width = 200, mode = 'contain' }) {
	const { layout } = useTheme();
	if (!isImageSourcePropType(LogoLight) || !isImageSourcePropType(LogoDark)) {
		throw new Error('Image source is not valid');
	}
	return (
		<View testID="brand-img-wrapper" style={{ height, width }}>
			<ImageVariant
				testID="brand-img"
				style={[layout.fullHeight, layout.fullWidth]}
				source={LogoLight}
				sourceDark={LogoDark}
				resizeMode={mode}
			/>
		</View>
	);
}
export default Brand;
