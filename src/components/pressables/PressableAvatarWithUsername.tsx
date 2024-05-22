import { Pressable } from 'react-native';
import { Text, Image } from 'react-native';
import { Avatar } from '../avatars/avatar';

type Props = {
  username: string;
  avatar_url: string;
};

export function PressableAvatarWithUsername({ username, avatar_url }: Props) {
  return (
    <Pressable
      className='flex-row items-center'
      onPress={() => {
        alert("avatar");
      }}
    >
      <Avatar avatar_url={avatar_url} username={username} size={"md"} ring={true} />
      <Text className='font-semibold text-lg text-white ml-1'>{username}</Text>
    </Pressable>
  );
}