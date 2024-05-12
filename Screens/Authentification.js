import { StatusBar } from "expo-status-bar";
import {
  BackHandler,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "react-native";

import firebase from "../Config";

const auth = firebase.auth();

export default function Authentification(props) {
  var email, pwd;
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.container}
    >
      <View
        style={{
          width: "95%",
          alignItems: "center",
          backgroundColor: "#5553",
          borderRadius: 10,
          borderColor: "cyan",
          borderWidth: 1,
          paddingVertical: 20,
        }}
      >
        <Text
          style={{
            fontSize: 40,
            fontStyle: "italic",
            fontWeight: "bold",
            color: "white",
            borderRadius: 5,
          }}
        >
          Bienvenue
        </Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Login"
          onChangeText={(ch) => (email = ch)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          style={styles.inputStyle}
          placeholder="Mot de passe"
          onChangeText={(ch) => (pwd = ch)}
        ></TextInput>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Button
            title="Se connecter"
            onPress={() => {
              auth
                .signInWithEmailAndPassword(email, pwd)
                .then((userCredential) => {
                  // Signed in
                  var user = userCredential.user;
                  // ...
                  const currentId = auth.currentUser.uid;
                  props.navigation.replace("Accueil", {
                    currentId,
                  });
                  // props.navigation.navigate("Accueil", {
                  //   currentId,
                  // });
                })
                .catch((error) => {
                  var errorCode = error.code;
                  if (errorCode === "auth/invalid-credential") {
                    alert("Email ou mot de passe incorrect");
                  } else {
                    var errorMessage = error.message;
                    alert(errorMessage);
                  }
                });
            }}
          ></Button>
          <Button
            title="Annuler"
            onPress={() => {
              BackHandler.exitApp();
            }}
          ></Button>
        </View>

        <Text
          style={{
            width: "100%",
            color: "white",
            textAlign: "right",
            marginTop: 15,
            marginRight: 35,
          }}
          onPress={() => {
            // navigate to NewUser screen
            props.navigation.navigate("NewUser");
          }}
        >
          Créer un compte
        </Text>
      </View>

      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0004",
    alignItems: "center",
    justifyContent: "center",
  },
  inputStyle: {
    borderWidth: 1,
    borderRadius: 5,
    width: "90%",
    height: 50,
    marginVertical: 5,
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 18,
  },
});
