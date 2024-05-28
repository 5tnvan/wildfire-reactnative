import { Pressable } from 'react-native';
import { Text, Image } from 'react-native';
import { Avatar } from '../avatars/avatar';
import { useRouter } from 'expo-router';

type Props = {
  username: string;
  avatar_url: string;
};

export function PressableAvatarWithUsername({ username, avatar_url }: Props) {
  const router = useRouter();
  
  return (
    <Pressable
      className='flex-row items-center'
      onPress={() => router.push("/(profile)/" + username)}
    >
      <Avatar avatar_url={avatar_url} username={username} size={"md"} ring={true} />
      <Text className='font-semibold text-lg text-white ml-1'>{username}</Text>
    </Pressable>
  );
}