import Crud from "./pages/Crud"
import Home from "./pages/Home";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Container, Button, Text } from 'native-base';




const App = ()=>{

  const Stack = createNativeStackNavigator();


  return(
    <>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Crud" component={Crud} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  )
}

export default App;