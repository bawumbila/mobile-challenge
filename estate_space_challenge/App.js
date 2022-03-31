import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import {useState, useEffect} from 'react';

// Constants for constructing API URL
const BASE_URL = "https://my.api.mockaroo.com/users.json?";  
const API_KEY = "930279b0";
const ITEM_COUNT_PER_PAGE = "100";
const PAGE_PARAM = "page=";
const COUNT_PARAM = "count=";
const KEY_PARAM = "key=";
const AND_PARAM = "&";

export default function App() {
  const [state, setState] = useState({
    users: [],
    currentPage: 0
  });

  // Load first page of data
  async function loadInitialUserData() { 
    try {
      //construct URL for first page
      const URL = BASE_URL+PAGE_PARAM+"1"+AND_PARAM+COUNT_PARAM+ITEM_COUNT_PER_PAGE+AND_PARAM+KEY_PARAM+API_KEY;
      
      // Debug start 
      console.log("Initial API CALL URL: "); 
      console.log(URL);
      // Debug end

      // Make syncronous API call
      const users = await fetch(URL).then((res) => res.json());

      // Debug start 
      console.log("Initial users on page load: "); 
      console.log(users);
      // Debug end

      // Update page state with results and current page
      setState((prevState) => ({
        ...prevState,
        users: users.entries,
        currentPAGE: 1
      }));
    } catch (error) {
      console.log(error);
    }

  }

  // On page load, load the first page of user data
  useEffect(() => {
    loadInitialUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Estate Space Single Page App{"\n"}{"\n"}</Text>
      <StatusBar style="auto" />

      <FlatList style={{margin:5}}
        data={state.users}
        renderItem={({item}) => 
        <Text style={styles.item}>
          ID: {item.id}{"\n"}
          Name: {item.name.firstName} {item.name.lastName}{"\n"}
          Email: {item.email}{"\n"}
          Gender: {item.gender}{"\n"}
          Role: {item.role} {"\n"}
          ----------- {"\n"}
        </Text>}
      />
    </View>

    

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
