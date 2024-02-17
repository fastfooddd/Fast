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
import React, { useLayoutEffect, useState, useEffect } from "react"; // เพิ่ม useEffect
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

    // Return the unsubscribe function to stop listening to the updates
    return unsubscribe;
  }, []);

  // เพิ่ม useEffect เพื่อทำการกรองข้อมูลเมื่อมีการเปลี่ยนแปลงใน searchText
  useEffect(() => {
    const searchChats = (text) => {
      setSearchText(text);
      const filteredChats = chats?.filter((chat) => // ใช้ optional chaining (?.) เพื่อตรวจสอบว่า chats มีค่าเป็น null หรือไม่
        chat.chatName.toLowerCase().includes(text.toLowerCase())
      );
      setChats(filteredChats || null); // ใช้ค่าที่กรองแล้วหรือ null ในกรณีที่ filteredChats คืนค่าเป็น null
    };
    
  }, [searchText]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 }}>
          <Image source={Logo} style={{ width: 60, height: 60 }} resizeMode="contain" />

          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <View style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#7e3ff2', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={{ uri: user?.profilePic }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10, marginTop: 10 }}
          onChangeText={(text) => setSearchText(text)} // แก้ไข onChangeText เพื่อเรียกใช้ setSearchText
          value={searchText}
          placeholder="Search"
          placeholderTextColor="#999"
        />

        {/* Add to chat */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          <View style={{ width: '100%' }}>
            {/* Message title and add */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
              <Text style={{ color: '#333', fontSize: 18, fontWeight: 'bold', paddingBottom: 10 }}>Message</Text>

              <TouchableOpacity onPress={() => navigation.navigate('AddToChat')}>
                <Ionicons name="chatbox" size={28} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Chat room cards */}
            {isLoading ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#43C651" />
              </View>
            ) : (
              <>
                {/* Chat room cards */}
                {chats && chats.length > 0 ? (
                  <>
                    {chats.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </>
                ) : (
                  <Text>No chats found</Text>
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
    <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { room: room })} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
      {/* Images */}
      <View style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#7e3ff2', justifyContent: 'center', alignItems: 'center' }}>
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>
      {/* Title */}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ color: '#333', fontSize: 16, fontWeight: 'bold' }}>{room.chatName}</Text>
      </View>

      {/* Timestamp */}
      <Text style={{ color: '#7e3ff2', fontSize: 12 }}>{room.createdDate}</Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;
