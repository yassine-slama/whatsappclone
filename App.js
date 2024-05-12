import Accueil from "./Screens/Accueil";
import Authentification from "./Screens/Authentification";
import NewUser from "./Screens/NewUser";
import Chat from "./Screens/Chat";
// navigationContainer is a component that manages the navigation tree and contains the navigation state.
// It's usually added to the root component of the app.
import { NavigationContainer } from "@react-navigation/native";
// createNativeStackNavigator is a function that returns a component that renders a native stack navigator.
// A native stack navigator is a navigator that provides a way for your app to transition between screens where each new screen is placed on top of a stack.
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// The Stack Navigator is a stack of screens where each new screen is placed on top of a stack.
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* The Stack.Screen component is used to define a new screen in the stack navigator. */}
        {/* The name prop is used to specify the name of the screen. */}
        {/* The component prop is used to specify the component that should be rendered when the screen is active. */}
        <Stack.Screen name="Authentification" component={Authentification} />
        <Stack.Screen name="NewUser" component={NewUser} />
        <Stack.Screen name="Accueil" component={Accueil} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
