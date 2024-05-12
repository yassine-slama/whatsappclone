import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Users from "./AccueilScreens/Users";
import MyGroups from "./AccueilScreens/MyGroups";
import MyProfile from "./AccueilScreens/MyProfile";

const Tab = createMaterialBottomTabNavigator();

export default function Accueil(props) {
  const currentId = props.route.params.currentId;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Users"
        component={Users}
        initialParams={{
          currentId,
        }}
      />
      <Tab.Screen
        name="MyGroups"
        component={MyGroups}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfile}
        initialParams={{
          currentId,
        }}
      />
    </Tab.Navigator>
  );
}
