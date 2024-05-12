import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
} from "react-native";

import firebase from "../Config";
const database = firebase.database();

export default function Chat(props) {
  const currentid = props.route.params.currentId;
  const secondid = props.route.params.secondId;

  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [istypingVisible, setistypingVisible] = useState(false);

  const iddisc =
    currentid > secondid ? currentid + secondid : secondid + currentid;

  useEffect(() => {
    // create discussion if not exist

    const ref_discussion = database.ref("discussion");
    const ref_la_disc = ref_discussion.child(iddisc);

    ref_la_disc.on("value", (snapshot) => {
      //the json returned is like this:
      // {
      //   "key1": {
      //     "Time": "time",
      //     "Message": "message",
      //     "Sender": "id",
      //     "Receiver": "id"
      //   },
      //   "key2": {
      //     "Time": "time",...
      //   }
      // }
      //i want to convert it to an array of objects
      // [
      //   {
      //     "Time": "time",
      //     "Message": "message",
      //     "Sender": "id",
      //     "Receiver": "id"
      //   },
      //   {
      //     "Time": "time",...
      //   }
      // ]

      const dataArray = [];
      for (const key in snapshot.val()) {
        if (snapshot.val()[key].Time) dataArray.push(snapshot.val()[key]);
      }
      setData(dataArray);
    });

    return () => {
      ref_la_disc.off();
    };
  }, []);

  useEffect(() => {
    const ref_discussion = database.ref("discussion");
    const ref_la_disc = ref_discussion.child(iddisc);
    const ref_typing = ref_la_disc.child(secondid + "isTyping");
    ref_typing.on("value", (snapshot) => {
      setistypingVisible(snapshot.val());
    });

    return () => {
      ref_typing.off();
    };
  }, []);

  const renderItem = ({ item }) => {
    const isSender = item.Sender === currentid;

    const senderId = isSender ? currentid : secondid;
    const receiverId = isSender ? secondid : currentid;

    // get sender UrlImage
    const ref_users = database.ref("users");
    const ref_sender = ref_users.child(senderId);

    ref_sender.once("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        item.UrlImage = data.UrlImage;
      }
    });
    return (
      <View
        style={{
          margin: 5,
          backgroundColor: isSender ? "#0008" : "#fff4",
          borderRadius: 10,
          padding: 10,
          alignSelf: isSender ? "flex-end" : "flex-start",
          width: "80%",
          flexDirection: "row",
        }}
      >
        <Image
          source={{ uri: item.UrlImage }}
          style={{ width: 30, height: 30, marginRight: 10, borderRadius: 15 }}
        />
        <View>
          <Text style={{ color: isSender ? "white" : "black" }}>
            {item.Message}
          </Text>
          <Text style={{ color: isSender ? "white" : "black" }}>
            {item.Time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/profileBg.png")}
    >
      <View style={{ flexDirection: "row" }}>
        <TextInput
          value={msg}
          onFocus={() => {
            const ref_discussion = database.ref("discussion");
            const ref_la_disc = ref_discussion.child(iddisc);
            const ref_typing = ref_la_disc.child(currentid + "isTyping");
            ref_typing.set(true);
          }}
          onBlur={() => {
            const ref_discussion = database.ref("discussion");
            const ref_la_disc = ref_discussion.child(iddisc);
            const ref_typing = ref_la_disc.child(currentid + "isTyping");
            ref_typing.set(false);
          }}
          onChangeText={(ch) => {
            setMsg(ch);
          }}
          textColor="white"
          style={{
            margin: 5,
            width: "80%",
            height: 50,
            backgroundColor: "#0008",
            fontSize: 14,
            fontWeight: "bold",
            color: "white",
          }}
        ></TextInput>
        <Button
          onPress={() => {
            const iddisc =
              currentid > secondid
                ? currentid + secondid
                : secondid + currentid;
            const ref_discussion = database.ref("discussion");
            const ref_la_disc = ref_discussion.child(iddisc);
            const key = ref_la_disc.push().key;
            const ref_un_msg = ref_la_disc.child(key);

            const dataToPush = {
              Time: new Date().toLocaleString(),
              Message: msg,
              Sender: currentid,
              Receiver: secondid,
            };
            if (!dataToPush.Message) {
              alert("Message is empty");
              return;
            }
            ref_un_msg
              .set({
                Time: new Date().toLocaleString(),
                Message: msg,
                Sender: currentid,
                Receiver: secondid,
              })
              .then(() => {
                setMsg("");
              });
          }}
          textColor="white"
          style={{
            margin: 5,
            justifyContent: "center",
            backgroundColor: "#22f9",
          }}
          title="Send"
        ></Button>
      </View>
      {istypingVisible && <Text>istyping ...</Text>}
      <FlatList
        style={{ margin: 5, backgroundColor: "#0008", borderRadius: 10 }}
        data={data}
        renderItem={renderItem}
      ></FlatList>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
    paddingBottom: 10,
  },
});
