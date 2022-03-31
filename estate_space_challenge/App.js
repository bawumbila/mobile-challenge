import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator,TouchableOpacity, FlatList, StyleSheet, Text, View } from 'react-native';
import {useState, useEffect} from 'react';

// Constants for constructing API URL
const BASE_URL = "https://my.api.mockaroo.com/users.json?";  
const API_KEY = "930279b0";
const ITEM_COUNT_PER_PAGE = "20";
const PAGE_PARAM = "page=";
const COUNT_PARAM = "count=";
const KEY_PARAM = "key=";
const AND_PARAM = "&";

export default function App() {

  // Set up state variables 
  const [pageLoading, setPageLoading] = useState(true); // Keep track of loading indicator
  const [users, setUsers] = useState([]); // Keep track of users from API calls
  const [currentPage, setCurrentPage] = useState(1); // Keep track of current page number

  // Helper element for user page element separator
  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  // Load first page of data
  async function loadUserData() { 
    try {
      setPageLoading(true);
      //construct URL for the current page
      // Note that on page load, the current page is initialized to 1 and then incremented for each next page press/click
      const URL = BASE_URL+PAGE_PARAM+currentPage+AND_PARAM+COUNT_PARAM+ITEM_COUNT_PER_PAGE+AND_PARAM+KEY_PARAM+API_KEY;
      
      // Debug start 
      console.log("API CALL URL: "); 
      console.log(URL);
      // Debug end

      // Make syncronous API call
      const newPageUsers = await fetch(URL).then((res) => res.json());

      // Debug start 
      console.log("Users for page " + currentPage + ": "); 
      console.log(newPageUsers);
      // Debug end

      // Update page state with results and current page
      setUsers([...users, ...newPageUsers.entries]);
      setCurrentPage(currentPage+1);
      setPageLoading(false);
    } catch (error) {
      console.log(error);
    }

  }

  // Helper function to render a page footer with pagination button
  const renderFooter = () => {
    return (
      //Footer View with Load next page button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={loadUserData}
          //On Press of button call loadUserData function to load the next page of user data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More Users</Text>
          {pageLoading ? (
            <ActivityIndicator color="white" style={{marginLeft: 10}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  // On page load, load the first page of user data
  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>EstateSpace Single Page App{"\n"}{"\n"}</Text>
      <StatusBar style="auto" />

      <FlatList style={{margin:5}}
        data={users}
        keyExtractor={(item, index) => item.id}
        ItemSeparatorComponent={ItemSeparatorView}
        ListFooterComponent={renderFooter}
        renderItem={({item}) => 
        <Text style={styles.item}>
          {"\n"}ID: {item.id}{"\n"}
          Name: {item.name.firstName} {item.name.lastName}{"\n"}
          Email: {item.email}{"\n"}
          Gender: {item.gender}{"\n"}
          Role: {item.role} {"\n"}
        </Text>}
      />
    </View>

    

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7ac8f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#c1c4c7",
    width: "100%",
    textAlign: 'center',
    paddingTop: 50,
    paddingBottom: 0,
    borderRadius: 10,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity:0.2,
    shadowRadius: 5
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
