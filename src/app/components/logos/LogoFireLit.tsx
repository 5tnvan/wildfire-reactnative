import { Image } from 'react-native';

export function LogoWildfireLit() {
    return (
      <Image
        source={require('@/assets/images/wildfire-logo-lit.png')}
        className='w-[68px] h-[24px]'
      />
    );
  }