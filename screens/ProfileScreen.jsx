import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import React from "react";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { firebaseAuth, firebaseauth } from "../config/firebase.config";
import { SET_USER_NULL } from "../context/actions/userActions";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await firebaseauth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.replace("LoginScreen");
    });
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* icons */}
      <View className="w-full flex-row items-center justify-between px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={36} color={"#555"} />
        </TouchableOpacity>

        
      </View>
      {/* profile */}
      <View className="items-center justify-center">
        <View className="relative border-2 border-purple-500 p-1 rounded-full">
          <Image
            source={{ uri: user?.profilePic }}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        <Text className="text-xl font-semibold text-purple-500 pt-3">
          {user?.fullName}
        </Text>
        <Text className="text-base font-semibold text-primaryText">
          {user?.providerData.email}
        </Text>
      </View>

      {/* icons sections */}
      <View className="w-full flex-row items-center justify-evenly py-6">
        {/* <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <MaterialIcons name="messenger-outline" size={24} color={"#555"} />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">Message</Text>
        </View> */}

        {/* <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <Ionicons name="ios-videocam-outline" size={24} color="#555" />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">Video Call</Text>
        </View>

        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <Ionicons name="call-outline" size={24} color={"#555"} />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">Call</Text>
        </View>

        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <Entypo name="dots-three-horizontal" size={24} color="#555" />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">More</Text>
        </View> */}
      </View>

      {/* medias shared */}

      <View className="w-full px-6 space-y-3">
        {/* <View className="w-full flex-row items-center justify-between">
          <Text className="text-base font-semibold text-primaryText">
            Media Shared
          </Text>

          <TouchableOpacity>
            <Text className="text-base font-semibold uppercase text-primaryText ">
              View All
            </Text>
          </TouchableOpacity>
        </View> */}

        <View className="w-full flex-row items-center justify-between">

            <View className="absolute w-full h-full items-center justify-center bg-[#00000068]">
              <Text className="text-base text-white font-semibold">250+</Text>
            </View>
        </View>
      </View>

      {/* settings options */}
      <View className="w-full px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity
        onPress={() => navigation.navigate("date")}>
        <View className="flex-row items-center bg-red-500">
        <MaterialIcons name="person" size={24} color={"#555"} />
          <Text className="text-base font-semibold text-primaryText px-3">
          Account
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={32} color={"#555"} />
        </TouchableOpacity>
      </View>

      <View className="w-full px-6 py-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
        <MaterialIcons name="lock" size={24} color={"#555"} />
          <Text className="text-base font-semibold text-primaryText px-3">
          Password
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={32} color={"#555"} />
      </View>
      

      {/* logout */}
    <View className="w-full items-center">
      <TouchableOpacity
        onPress={handleLogout}
        className="w-20 top-28 flex-row items-center justify-center"
      >
        <Text className="text-lg font-semibold text-red-500 ">
          Logout
        </Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
