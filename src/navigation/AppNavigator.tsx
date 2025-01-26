import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import { useAuth } from "../context/AuthContext";
import TodoScreen from "../screens/TodoScreen";
import TodoFormScreen from "../screens/TodoFormScreen";

export type RootStackParamList = {
    Login: undefined;
    Todo: undefined;
    TodoForm: { id?: string }; 
  };

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Todo" component={TodoScreen} />
            <Stack.Screen
              name="TodoForm"
              component={TodoFormScreen}
              options={({ route }: any) => ({
                title: route.params?.id ? "Edit Todo" : "Add Todo",
              })}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
