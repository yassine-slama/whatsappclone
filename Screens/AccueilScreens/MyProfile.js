import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import firebase from "../../Config";
const database = firebase.database();
const storage = firebase.storage();

export default function MyProfil(props) {
  // get the current user id from the initial parameters
  const currentId = props.route.params.currentId;

  const [Nom, setNom] = useState("");
  const [Prenom, setPrenom] = useState("");
  const [Telephone, setTelephone] = useState("");
  const [Pseudo, setPseudo] = useState("");
  const [UrlImage, setUrlImage] = useState("");

  useEffect(() => {
    // get currentUser using currentId
    const ref_users = database.ref("users");
    const user = ref_users.child(currentId);

    // just one time
    user
      .once("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setNom(data.Nom);
          setPrenom(data.Prenom);
          setTelephone(data.Telephone);
          setPseudo(data.Pseudo);
          setUrlImage(data.UrlImage);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setUrlImage(result.assets[0].uri);
    }
  };
  const imageToBlob = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob"; //bufferArray
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    return blob;
  };

  const uploadImage = async (uri) => {
    const blob = await imageToBlob(uri);
    const ref = storage.ref("images");
    const childRef = ref.child("image");

    await childRef.put(blob);
    const url = await childRef.getDownloadURL();
    return url;
  };

  return (
    <ImageBackground
      source={require("../../assets/profileBg.png")}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <Text style={styles.textstyle}>My profile</Text>
      <TouchableOpacity
        onPress={() => {
          pickImage();
        }}
      >
        <Image
          source={
            UrlImage
              ? { uri: UrlImage }
              : require("../../assets/profileIcon.png")
          }
          style={{
            height: 150,
            width: 150,
            borderRadius: 75,
            borderWidth: 2,
            borderColor: "#fff",
            marginVertical: 5,
          }}
        ></Image>
      </TouchableOpacity>

      <TextInput
        onChangeText={(text) => {
          setNom(text);
        }}
        textAlign="center"
        placeholderTextColor="#0005"
        placeholder="Nom"
        keyboardType="name-phone-pad"
        style={styles.textinputstyle}
        value={Nom}
      ></TextInput>
      <TextInput
        onChangeText={(text) => {
          setPrenom(text);
        }}
        textAlign="center"
        placeholderTextColor="#0005"
        placeholder="Prenom"
        keyboardType="name-phone-pad"
        style={styles.textinputstyle}
        value={Prenom}
      ></TextInput>
      <TextInput
        onChangeText={(text) => {
          setTelephone(text);
        }}
        placeholderTextColor="#0005"
        textAlign="center"
        placeholder="Telephone"
        keyboardType="phone-pad"
        style={styles.textinputstyle}
        value={Telephone}
      ></TextInput>
      <TextInput
        onChangeText={(text) => {
          setPseudo(text);
        }}
        placeholderTextColor="#0005"
        textAlign="center"
        placeholder="Pseudo"
        style={styles.textinputstyle}
        value={Pseudo}
      ></TextInput>

      <TouchableOpacity
        onPress={async () => {
          const url = await uploadImage(UrlImage);

          const ref_users = database.ref("users");
          const user = ref_users.child(currentId);

          if (
            !url ||
            Nom.length === 0 ||
            Prenom.length === 0 ||
            Telephone.length === 0 ||
            Pseudo.length === 0
          ) {
            alert("Please fill all the fields");
            return;
          }

          user
            .set({
              Nom,
              Prenom,
              Telephone,
              Pseudo,
              UrlImage: url,
              Id: currentId,
            })
            .then(() => {
              alert("Profil enregistré");
              // clear the input fields
              setNom("");
              setPrenom("");
              setTelephone("");
              setPseudo("");
            })
            .catch((error) => {
              alert(error);
            });
        }}
        disabled={false}
        activeOpacity={0.5}
        underlayColor="#DDDDDD"
        style={{
          marginBottom: 10,
          backgroundColor: "#4682a0",
          textstyle: "italic",
          fontSize: 24,
          height: 40,
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Save
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  textinputstyle: {
    fontStyle: "italic",
    backgroundColor: "#0002",
    fontSize: 13,
    width: "70%",
    height: 40,
    borderRadius: 5,
    margin: 5,
  },
  textstyle: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    paddingTop: 20,
    color: "blue",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
