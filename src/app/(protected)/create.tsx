import { Link, Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import {
  useCameraPermission,
  useMicrophonePermission,
  useCameraDevice,
  Camera,
  TakePhotoOptions,
  VideoFile,
} from 'react-native-vision-camera';
import { useFocusEffect } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/services/providers/AuthProvider';
import axios from 'axios';
import RNFS from 'react-native-fs';
import BunnyAPI from '@/src/constants/BunnyAPI';
import { Buffer } from 'buffer';
import * as VideoThumbnails from 'expo-video-thumbnails';
import Colors from '@/src/constants/Colors';
import { SetCountryModal } from '@/src/components/modals/SetCountryModal';
import { useDailyPostLimit } from '@/src/hooks/useDailyPostLimit';

const CameraScreen = () => {

  const router = useRouter();
  const colorScheme = useColorScheme();

  // FETCH DIRECTLY
  const { limit } = useDailyPostLimit();

  //STATES
  const [modalVisible, setModalVisible] = useState(false); //location modal
  const [video, setVideo] = useState<VideoFile>(); //video taken from camera
  const [cameraRollVideo, setCameraRollVideo] = useState<string>(); //video taken from camera roll
  const [locationId, setLocationId] = useState<any>(null);
  const [locationName, setLocationName] = useState("Set location");

  //CONSUME PROVIDERS
  const { user } = useAuth();

  //SET CAM AND MIC PERMISSIONS
  const { hasPermission: hasCam, requestPermission: requestCam } = useCameraPermission();
  const { hasPermission: hasMic, requestPermission: requestMic } = useMicrophonePermission();

  useEffect(() => {
    if (!hasCam) requestCam();
    if (!hasMic) requestMic();
  }, [hasCam, hasMic]);

  //SET CAMERA SETTINGS
  const [position, setPosition] = useState<'front' | 'back'>('back');
  const device = useCameraDevice(position);
  const camera = useRef<Camera>(null);
  const [flash, setFlash] = useState<TakePhotoOptions['flash']>('off');
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
      };
    }, [])
  );

  //TIMER THAT COUNTS TO 3 SECS
  const [counter, setCounter] = useState(0);

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
  

  //HANDLE RECORDING
  const handleStartRecording = async () => {
    if (!camera.current) return;
    setIsRecording(true);

    camera.current.startRecording({
      flash: flash === 'on' ? 'on' : 'off',
      videoBitRate: 'high',
      onRecordingFinished: async (video) => {
        console.log("on recording finish", video);
        setIsRecording(false);
        setVideo(video);
      },
      onRecordingError: (error) => {
        console.error(error);
        setIsRecording(false);
      }
    })
    setTimeout(() => {
      camera.current?.stopRecording()
    }, 3000)
  };

  // const onStopRecording = async () => {
  //   if (!camera.current) return;
  //   camera.current?.stopRecording();
  // };

  //HANDLE PICKING VIDEO FROM CAMERA ROLL
  const handlePickVideo = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
      selectionLimit: 1,
      videoMaxDuration: 3,
      exif: true,
    });

    console.log(result);

    if (!result.canceled) {
      setCameraRollVideo(result.assets[0].uri);
    }
  };

  //HANDLE COUNTRY SELECT
  const handleCountrySelect = (countryId: string, countryName: string) => {
    console.log("countryId", countryId);
    setLocationId(countryId);
    setLocationName(countryName);
    //setModalVisible(false);
  };

  //HANDLE PUBLISHING
  const [isUploading, setIsUploading] = useState(false);
  const generateThumbnail = async (video_url: any) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        video_url,
        { time: 15000 }
      );
      return uri;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };
  const handlePublishing = async () => {

    if(limit) {
      alert("You've reached your 24hrs posting limit. Try again later.")
      return;
    }

    setIsUploading(true);
    const now = new Date().getTime();

    // Set up video URI
    let videoUri = '';
    if (cameraRollVideo) videoUri = cameraRollVideo;
    else if (video) videoUri = video.path;

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
        setVideo(undefined);
        setCameraRollVideo(undefined);
        router.push("/(protected)/profile");
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  //ERROR SETTINGS
  if (!hasCam || !hasMic) return <SafeAreaView><Text>You need to grant camera or microphone access.</Text></SafeAreaView>;
  if (!device) return <SafeAreaView><Text>Camera device not found</Text></SafeAreaView>;

  return (
    <View style={{ flex: 1 }}>

      {/* HEADER */}
      <Stack.Screen options={{ headerShown: true, title: "Create", headerRight: () => (
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
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive && !video}
        video
        audio
      />

      {/* RECORDING */}
      {isRecording && <SafeAreaView className='absolute self-center'><Text className='bg-gray-700 text-white p-3 rounded-full'>{formatCounter(counter)}s</Text></SafeAreaView>}
      {!video && !cameraRollVideo && (
        <>
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
              onPress={() => {
                if (position === 'back') setFlash('off');
                setPosition(prev => (prev === 'back' ? 'front' : 'back'));
                
              }}
            />
            <Ionicons
              name={flash === 'off' ? 'flash-off' : 'flash'}
              onPress={() => {
                if (position === 'back') {
                  setFlash((curValue) => (curValue === 'off' ? 'on' : 'off'));
                }
              }}
              size={30}
              color="white"
            />

          </View>

          <Pressable className='absolute bottom-10 left-10' onPress={handlePickVideo}>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)'}} className='w-14 h-16 bg-black rounded-2xl justify-center items-center border border-zinc-400'>
              <Feather name="film" size={24} color="#CBCBCB" />
            </View>
          </Pressable>

          <Pressable
            onLongPress={handleStartRecording}
            className={`absolute bottom-10 self-center  rounded-full flex-1 justify-center items-center ${
              isRecording ? 'bg-red-500 w-24 h-24' : 'bg-white w-20 h-20'
            }`}
          >
            <View className='w-16 h-16 rounded-full bg-red-500'/>
          </Pressable>
        </>
      )}

      {/* LOCATION MODAL */}
      <SetCountryModal visible={modalVisible} onClose={() => setModalVisible(false)} passBack={handleCountrySelect}/>

      {/* VIDEO RESULT */}
      {video && (
        <>
          <View className='bg-black'>
            <Video
              className='w-full h-full'
              source={{
                uri: video.path,
              }}
              useNativeControls={false}
              isLooping
              shouldPlay
            />
            <Ionicons
              onPress={() => setVideo(undefined)}
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
              <Pressable className='flex-row justify-between grow py-3 px-2 items-center rounded-full bg-accent mt-3' onPress={() => console.log("yaya")}>
                <View></View>
                <Text className='text-base font-semibold'>Publish</Text>
                <Ionicons name="chevron-forward" size={22} color="black" />
                {isUploading && <ActivityIndicator size="small" color="#0000ff" className='ml-1' />}
              </Pressable>
            </View>
          </View>
        </>
      )}

      {cameraRollVideo && (
        <>
          <View className='bg-black'>
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
                <View><FontAwesome name="location-arrow" size={14} color="black" /></View>
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
    </View>
  );
};

export default CameraScreen;