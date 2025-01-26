import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { TodoProvider } from "./src/context/TodoContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TodoProvider>
        <AppNavigator />
      </TodoProvider>
    </AuthProvider>
  );
};

export default App;
