import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Logo } from "../assets";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB, firestoredb } from "../config/firebase.config";


const HomeScreen = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState(null);
  const [searchText, setSearchText] = useState('');

  const navigation = useNavigation();

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestoredb, "chats"),
      orderBy("_id", "desc")
    );

    const unsubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });

    // Resturn the unsubscribe function to stop listening to the updates
    return unsubscribe;
  }, []);
  // Search function
  const searchChats = (text) => {
    setSearchText(text);
    if (!text.trim()) {
      // ถ้า text เป็นค่าว่าง ให้กำหนดค่า chats กลับมาเป็นข้อมูลเริ่มต้น
      setChats(null); // ลบข้อมูลที่ถูกกรองไว้
      setIsLoading(true); // เซ็ตให้โหลดข้อมูลอีกครั้ง
      const chatQuery = query(
        collection(firestoredb, "chats"),
        orderBy("_id", "desc")
      );
    
      onSnapshot(chatQuery, (querySnapShot) => {
        const chatRooms = querySnapShot.docs.map((doc) => doc.data());
        setChats(chatRooms);
        setIsLoading(false);
      });
    } else {
      // ถ้า text ไม่เป็นค่าว่าง
      const filteredChats = chats.filter((chat) =>
        chat.chatName.toLowerCase().includes(text.toLowerCase())
      );
      setChats(filteredChats);
    }
  };
//   // ฟังก์ชันเพื่อลบข้อมูล
// const deleteData = () => {
//   // ทำการลบข้อมูลที่คุณต้องการที่นี่
//   firestoredb.collection("chats").doc("room?._id").delete();
//   console.log("ลบข้อมูลอัตโนมัติ");
// };

// // ฟังก์ชันเริ่มต้นการลบข้อมูลอัตโนมัติหลังจากที่ผ่านไป 1 สัปดาห์
// const startAutoDelete = () => {
//   setTimeout(deleteData, 7 * 24 * 60 * 60 * 1000); // 1 สัปดาห์มี 7 วัน * 24 ชั่วโมง * 60 นาที * 60 วินาที * 1000 มิลลิวินาที
// };

// // เรียกใช้ฟังก์ชันเพื่อเริ่มต้นการลบข้อมูลอัตโนมัติ
// startAutoDelete();

  return (
    <View className="flex-1">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen', { key: Math.random() })}>
          <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileScreen")}
            className="w-12 h-12 rounded-full border border-purple-500 flex items-center justify-center"
          >
            <Image
              source={{ uri: user?.profilePic }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <TextInput
                  style={{ width:'90%', height: 40, borderColor: 'gray',marginLeft:10, borderWidth: 1, paddingHorizontal: 10, marginTop: 10 }}
                  onChangeText={searchChats}
                  value={searchText}
                  placeholder=" หาสิ่งที่คุณสนใจ . . . "
                  placeholderTextColor="#999"
                />

        {/* add to chat */}
        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full">
            {/* message title and add */}
            <View className="w-full flex-row items-center justify-between px-2">
              <Text className="text-primaryText text-base font-extrabold pb-2">
                Message
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("AddToChat")}
              >
                <Ionicons name="chatbox" size={28} color="#555" />
              </TouchableOpacity>
            </View>

            {/* chat room card */}
            {isLoading ? (
              <>
                <View className="w-full flex items-center justify-center">
                  <ActivityIndicator size={"large"} color={"#43C651"} />
                </View>
              </>
            ) : (
              <>
                {chats && chats?.length > 0 ? (
                  <>
                    {chats?.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MessageCard = ({ room }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatScreen", { room: room })}
      className="w-full flex-row items-center justify-start py-2"
    >
      {/* images */}
      <View className="w-16 h-16 rounded-full flex items-center border-2 border-purple-500 p-1 justify-center">
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>
      {/* title */}
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">
          {room.chatName}
        </Text>
        {/* <Text className="text-primaryText text-sm">
          ddddd
        </Text> */}
      </View>

      {/* timestamp */}
      
      
      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#AA63B0' }}> {room.createdDate} </Text>
    </TouchableOpacity>
    
  );
};



export default HomeScreen;
