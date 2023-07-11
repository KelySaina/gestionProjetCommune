import { Button } from "@react-native-material/core";
import { View, Text, Alert } from "react-native";

const Home = ({navigation})=>{
  return(
    <>
    <View>
        <Button onPress={() => navigation.navigate('Crud')} title="CRUD"/>
    </View>
      
    </>
  )
}

export default Home;