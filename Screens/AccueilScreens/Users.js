import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import firebase from "../../Config";
import { Dialog } from "react-native-paper";

const database = firebase.database();

const Users = (props) => {
  const currentId = props.route.params.currentId;

  const [users, setUsers] = useState([]);

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const [itemPressed, setItemPressed] = useState({}); // [pseudo, telephone, nom, prenom]

  // Fetch users from Firebase
  useEffect(() => {
    database.ref("users").on("value", (snapshot) => {
      const data = snapshot.val();
      const users = Object.values(data);
      let usersData = [];
      users.forEach((el) => {
        if (el.Id !== currentId) {
          usersData.push(el);
        }
      });
      setUsers(usersData);
    });

    return () => {
      database.ref("users").off();
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      {/* an image at the left, than the pseudo and a button */}
      <TouchableOpacity
        onPress={() => {
          setItemPressed(item);
          setIsDialogVisible(true);
        }}
      >
        <Image
          // source is an url item.UrlImage
          source={{ uri: item.UrlImage }}
          style={{
            height: 70,
            width: 70,
            borderRadius: 35,
          }}
        ></Image>
      </TouchableOpacity>
      <Text style={styles.userText}>{item.Pseudo}</Text>

      <Button
        title="Chat"
        onPress={() => {
          props.navigation.navigate("Chat", {
            currentId,
            secondId: item.Id, // ici
          });
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Dialog visible={isDialogVisible}>
        <Dialog.Title>Details et options</Dialog.Title>
        <Dialog.Content>
          <View style={styles.dialogContentContainer}>
            {/* image */}
            <Image
              source={{ uri: itemPressed.UrlImage }}
              style={{
                height: 110,
                width: 110,
                borderRadius: 55,
              }}
            ></Image>

            {/* display info int the form Nom: $Nom */}
            <View
              style={{
                marginTop: 10,
                gap: 10,
              }}
            >
              <Text>Nom: {itemPressed.Nom}</Text>
              <Text>Prenom: {itemPressed.Prenom}</Text>
              <Text>Telephone: {itemPressed.Telephone}</Text>
              <Text>Pseudo: {itemPressed.Pseudo}</Text>
            </View>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            title="Call"
            onPress={() => {
              // Call the user
              if (Platform.OS === "android") {
                Linking.openURL(`tel:${itemPressed.Telephone}`);
              } else {
                Linking.openURL(`telprompt:${itemPressed.Telephone}`);
              }
            }}
          ></Button>
          <Button
            title="Chat"
            onPress={() => {
              props.navigation.navigate("Chat", {
                currentId,
                secondId: itemPressed.Id,
              });
            }}
          ></Button>
          <Button
            title="Cancel"
            onPress={() => {
              setIsDialogVisible(false);
            }}
          ></Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userContainer: {
    backgroundColor: "#FFF",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    height: 120,
    justifyContent: "space-between",
  },
  userText: {
    fontSize: 16,
    marginLeft: 10,
  },
  dialogContentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Users;
