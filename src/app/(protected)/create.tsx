import Colors from '@/src/constants/Colors';
import { useDailyPostLimit } from '@/src/hooks/useDailyPostLimit';
import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { CameraType, FlashMode } from 'expo-camera/build/legacy/Camera.types';
import { Link, Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PressableAnimated } from '@/src/components/pressables/PressableAnimated';
import { Video } from 'expo-av';
import { SetCountryModal } from '@/src/components/modals/SetCountryModal';
import { useIsFocused } from '@react-navigation/native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import axios from 'axios';
import RNFS from 'react-native-fs';
import BunnyAPI from '@/src/constants/BunnyAPI';
import { Buffer } from 'buffer';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/services/providers/AuthProvider';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

const CameraScreen = () => {

  

  const router = useRouter();
  const colorScheme = useColorScheme();
  const isFocused = useIsFocused();

  //CONSUME PROVIDERS
  const { user } = useAuth();

  // FETCH DIRECTLY
  const { limit } = useDailyPostLimit();

  // STATES
  //cam permissions
  const [camPerm, requestCam] = useCameraPermissions();
  const [micPerm, requestMic] = useMicrophonePermissions();

  //cam settings
  const [facingType, setFacingType] = useState(CameraType.back);

  //cam recording
  const cameraRef = useRef<CameraView>(null);
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState(0);
  
  //vid res
  const [recordedVideo, setRecordedVideo] = useState<any>(null); //video taken from camera
  const [cameraRollVideo, setCameraRollVideo] = useState<string>(); //video taken from camera roll

  //country modal
  const [modalVisible, setModalVisible] = useState(false); //location modal
  const [locationId, setLocationId] = useState<any>(null);
  const [locationName, setLocationName] = useState("Set location");

  //publishing
  const [isUploading, setIsUploading] = useState(false);

  async function requestPermission() {
    await requestCam();
    await requestMic();
  }

  function toggleCameraFacing() {
    setFacingType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  console.log("camerarollvid", cameraRollVideo);

  const handlePickCamRollVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ // No permissions request is necessary for launching the image library
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      selectionLimit: 1,
      videoMaxDuration: 3,
      exif: true,
    });

    console.log(result);

    if (!result.canceled) {
      const compressVidUri = await compressVideo(result.assets[0].uri)
      
      if (compressVidUri != null) {
        const convertedVidUri = await convertUriFormat(compressVidUri);
        if (convertedVidUri) setCameraRollVideo(convertedVidUri);
      }
    }
  };

  const handleStartRecording = async () => {
    if (!isRecording) {
      if (!cameraRef.current) return;
      setIsRecording(true);

      console.log("recording");

      const res = await cameraRef.current.recordAsync({
        maxDuration: 3,
        mirror: true,
      });

      if (res) {
        console.log("res?.uri", res?.uri);
        setRecordedVideo(res?.uri);
        setIsRecording(false);
      }
    }
  };

  //TIMER THAT COUNTS TO 3 SECS
  useEffect(() => {
    let startTime: number;
    let animationFrameId: number | undefined;
  
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      setCounter(elapsedTime);
      animationFrameId = requestAnimationFrame(animate);
    };
  
    if (isRecording) {
      startTime = Date.now();
      animationFrameId = requestAnimationFrame(animate);
    } else {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      setCounter(0);
    }
  
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRecording]);
  
  const formatCounter = (counter: number) => {
    const seconds = Math.floor(counter / 1000);
    const milliseconds = Math.floor(counter % 1000);
    return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  };

  const handleCountrySelect = (countryId: string, countryName: string) => {
    console.log("countryId", countryId);
    setLocationId(countryId);
    setLocationName(countryName);
    //setModalVisible(false);
  };

  const generateThumbnail = async (videoUri: any) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        videoUri,
        { time: 15000 }
      );
      return uri;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  const convertUriFormat = async (videoUri: string) => {
    try {
      // Get the file name from the original video URI
      const fileName = videoUri.split('/').pop();
      if (!fileName) return null;
  
      // Define the destination directory
      const destinationUri = `${FileSystem.cacheDirectory}ImagePicker/${fileName}`;
  
      // Copy the video file to the destination directory
      await FileSystem.copyAsync({
        from: videoUri,
        to: destinationUri,
      });
  
      return destinationUri;
    } catch (error) {
      console.error("Video format conversion error:", error);
      return null;
    }
  };

  const compressVideo = async (videoUri:any) => {
    const compressedVideoPath = `${RNFS.CachesDirectoryPath}/comp_video.mp4`;

    const compressedVideoExists = await RNFS.exists(compressedVideoPath);
    if (compressedVideoExists) await RNFS.unlink(compressedVideoPath);

    try {
      // const session = await FFmpegKit.execute(`-i "${videoUri}" -vf "scale=-2:720,setsar=1:1" -c:v h264 -b:v 20000k -c:a aac -b:a 128k -ac 2 "${compressedVideoPath}"`);

      const session = await FFmpegKit.execute(`-i "${videoUri}" -c:v h264 -b:v 8000k -c:a aac -b:a 128k -ac 2 -filter:a loudnorm "${compressedVideoPath}"`);

      const returnCode = await session.getReturnCode();
  
      if (ReturnCode.isSuccess(returnCode)) {
        // SUCCESS
        console.log("Compression success", compressedVideoPath);
        return compressedVideoPath;
      } else if (ReturnCode.isCancel(returnCode)) {
        // CANCEL
        console.log("Compression canceled");
        return null;
      } else {
        // ERROR
        console.log("Compression error");
        return null;
      }
    } catch (error) {
      // Catch any errors that occur during FFmpeg execution
      console.error("FFmpeg execution error:", error);
      return null;
    }
  };

  const handlePublishing = async () => {

    console.log("publishing");

    // if(limit) {
    //   alert("You've reached your 24hrs posting limit. Try again later.")
    //   return;
    // }

    setIsUploading(true);
    const now = new Date().getTime();

    // Set up video URI
    let videoUri = '';
    if (cameraRollVideo) videoUri = cameraRollVideo;
    else if (recordedVideo) videoUri = recordedVideo;

     // Generate thumbnail
    const thumbUri = await generateThumbnail(videoUri);
    if (!thumbUri) return;

    // Read the thumbnail file as binary
    let thumbBinary = await RNFS.readFile(thumbUri, 'base64');

    // Convert base64 encoded string to binary data
    const thumbBinaryData = Buffer.from(thumbBinary, 'base64');
    const thumbBunnyUrl = `https://${BunnyAPI.HOSTNAME}/${BunnyAPI.STORAGE_ZONE_NAME}/${user?.id}/${now}.jpg`;
    const pullZoneThumbUrl = `https://wildfire.b-cdn.net/${user?.id}/${now}.jpg`

    // Define the upload options for the thumbnail
    const thumbOptions = {
      method: 'PUT',
      url: thumbBunnyUrl,
      headers: {
        AccessKey: BunnyAPI.ACCESS_KEY,
        'Content-Type': 'image/jpeg',
      },
      data: thumbBinaryData,
      responseType: 'arraybuffer' as const,
    };

    // Perform the thumbnail upload
    try {
      await axios(thumbOptions);
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      return;
    }
  
    // Read the video file as binary
    let videoBinary = await RNFS.readFile(videoUri, 'base64');
  
    // Convert base64 encoded string to binary data
    const videoBinaryData = Buffer.from(videoBinary, 'base64');
    const bunnyVideoUrl = `https://${BunnyAPI.HOSTNAME}/${BunnyAPI.STORAGE_ZONE_NAME}/${user?.id}/${now}.mp4`;
    const pullZoneVideoUrl = `https://wildfire.b-cdn.net/${user?.id}/${now}.mp4`
    
    // Define the upload options
    const options = {
      method: 'PUT',
      url: bunnyVideoUrl,
      headers: {
        AccessKey: BunnyAPI.ACCESS_KEY,
        'Content-Type': 'video/mp4',
      },
      data: videoBinaryData, // Use binary data
      responseType: 'arraybuffer' as const, // Ensure the response is handled correctly and the type is compatible
    };
  
    // Perform the upload
    
    try {
      const response = await axios(options);
      console.log('Upload response:', response.data);
      const { error } = await supabase.from("3sec").insert({ 
        user_id: user?.id, 
        video_url: pullZoneVideoUrl,
        thumbnail_url: pullZoneThumbUrl,
        country_id: locationId,
      });
      if(!error) {
        console.log("uploaded!!");
        setRecordedVideo(undefined);
        setCameraRollVideo(undefined);
        router.push("/(protected)/profile");
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Re-fetch data when screen is focused 
  useEffect(() => {
    if (isFocused) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [isFocused]);

  //CAM MIC PERMISSIONS
  if (!camPerm && !micPerm) {
    return <View><Text>Loading...</Text></View>;
  }

  if (!camPerm?.granted && !micPerm?.granted) {
    return (
      <View className='flex-1 justify-center'>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permissions" />
      </View>
    );
  }

  return (
    <View className='flex-1'>
      {/* HEADER */}
      <Stack.Screen options={{
        headerShown: true, title: "Create", headerRight: () => (
          <Link href="/modals/tool-tip-create" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="info-circle"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
      }} />
      {/* CAMERA */}
      <CameraView
          mode='video'
          ref={cameraRef}
          style={styles.camera}
          facing={facingType}
          videoQuality='2160p'
        >
        </CameraView>

      {/* RECORDING MODE */}
      {isRecording && 
      <SafeAreaView className='absolute top-3 self-center'>
        <View className='flex-row justify-start items-center p-3 rounded-full bg-zinc-700/40 w-24'>
          <FontAwesome name="circle" size={16} color="red" />
          <Text className='ml-1 text-white font-semibold'>{formatCounter(counter)}s</Text>
        </View>
      </SafeAreaView>}
      {!recordedVideo && !cameraRollVideo && (
        <>
        {/* RIGHT CONTROLS */}
          <View
            style={{
              position: 'absolute',
              right: 10,
              top: 20,
              padding: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(0, 0, 0, 0.40)',
              gap: 30,
            }}
          >
            <MaterialIcons
              name="flip-camera-android"
              size={30}
              color="white"
              onPress={toggleCameraFacing}
            />
          </View>
          {/* CAM ROLL CONTROLS */}
          <PressableAnimated className='absolute bottom-10 left-10 w-14 h-16 bg-black/30 rounded-2xl justify-center items-center border border-zinc-400' onPress={handlePickCamRollVideo}>
              <Feather name="film" size={24} color="#CBCBCB" />
          </PressableAnimated>

          <Pressable
            onPress={handleStartRecording}
            onLongPress={handleStartRecording}
            className={`absolute bottom-10 self-center  rounded-full flex-1 justify-center items-center ${
              isRecording ? 'bg-red-500 w-24 h-24' : 'bg-white w-20 h-20'
            }`}
          >
            <View className='w-16 h-16 rounded-full bg-red-500'/>
          </Pressable>
        </>
      )}
      {/* CAM ROL VIDEO RESULT */}
      {cameraRollVideo && (
        <>
          <View className=''>
            <Video
              className='w-full h-full'
              source={{
                uri: cameraRollVideo,
              }}
              useNativeControls={false}
              isLooping
              shouldPlay
            />
            <Ionicons
              onPress={() => setCameraRollVideo(undefined)}
              name="chevron-back"
              size={28}
              color="white"
              style={{ position: 'absolute', top: 20, left: 10 }}
            />
            <View className='absolute bottom-3 flex-row w-full items-center px-3'>
              <Pressable className='flex-row justify-between grow py-3 px-3 items-center rounded-full bg-white mt-3 mr-3' onPress={() => setModalVisible(true)}>
                <View><FontAwesome name="location-arrow" size={14} color="white" /></View>
                <Text className='text-base font-semibold'>{locationName}</Text>
                <View></View>
              </Pressable>
              <Pressable className={`flex-row justify-center grow py-3 px-2 items-center rounded-full ${limit ? 'bg-primary' : 'bg-accent'}  mt-3`} onPress={handlePublishing}>
                <View></View>
                <Text className='text-base font-semibold'>Publish</Text>
                {/* <Ionicons name="chevron-forward" size={22} color="black" /> */}
                {isUploading && <ActivityIndicator size="small" color="#0000ff" className='ml-1' />}
              </Pressable>
            </View>
          </View>
        </>
      )}

      {/* RECORDED VIDEO RESULT */}
      {recordedVideo && (
        <>
          <View className='bg-black'>
            <Video
              className='w-full h-full'
              source={{
                uri: recordedVideo,
              }}
              useNativeControls={false}
              isLooping
              shouldPlay
            />
            <Ionicons
              onPress={() => setRecordedVideo(undefined)}
              name="chevron-back"
              size={28}
              color="white"
              style={{ position: 'absolute', top: 20, left: 10 }}
            />
            <View className='absolute bottom-3 flex-row w-full items-center px-3'>
              <Pressable className='flex-row justify-between grow py-3 px-3 items-center rounded-full bg-white mt-3 mr-3' onPress={() => setModalVisible(true)}>
                <View><FontAwesome name="location-arrow" size={14} color="black" /></View>
                <Text className='text-base font-semibold'>{locationName}</Text>
                <View></View>
              </Pressable>
              <Pressable className='flex-row justify-between grow py-3 px-2 items-center rounded-full bg-accent mt-3' onPress={handlePublishing}>
                <View></View>
                <Text className='text-base font-semibold'>Publish</Text>
                <Ionicons name="chevron-forward" size={22} color="black" />
                {/* {isUploading && <ActivityIndicator size="small" color="#0000ff" className='ml-1' />} */}
              </Pressable>
            </View>
          </View>
        </>
      )}

      {/* LOCATION MODAL */}
      <SetCountryModal visible={modalVisible} onClose={() => setModalVisible(false)} passBack={handleCountrySelect}/>
      
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CameraScreen;