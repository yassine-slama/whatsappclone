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

export default function NewUser(props) {
  var email, pwd, confirmPwd;
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
          Créer un compte
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
        <TextInput
          secureTextEntry={true}
          style={styles.inputStyle}
          placeholder="Confirmer le mot de passe"
          onChangeText={(ch) => (confirmPwd = ch)}
        ></TextInput>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Button
            title="Créer un compte"
            onPress={() => {
              if (pwd !== confirmPwd) {
                alert("Les mots de passe ne correspondent pas");
                return;
              }

              if (pwd.length < 6) {
                alert("Le mot de passe doit contenir au moins 6 caractères");
                return;
              }

              const emailRegex =
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
              if (!emailRegex.test(email)) {
                alert("Adresse e-mail invalide");
                return;
              }

              auth
                .createUserWithEmailAndPassword(email, pwd)
                .then(() => {
                  alert("Compte créé avec succès");
                  // go to Accueil
                  const currentId = auth.currentUser.uid;
                  props.navigation.navigate("Accueil", {
                    currentId,
                  });
                })
                .catch((error) => {
                  alert(error.message);
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
            // go back to Authentification
            props.navigation.goBack();
          }}
        >
          Page de connexion
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
