import React, {useState, useRef, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, View , Modal, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EncryptedStorage from 'react-native-encrypted-storage';
import syncStorage from 'react-native-sync-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import Login from './src/Auth/login';
import Register from './src/Auth/Register';
import SplashScreen from 'react-native-splash-screen';
import Dashboard from './src/Auth/Dashboard';
import Otp from './src/Auth/Otp';
import Mddash from './src/Auth/Mddash';
import SystemWiseComplaint from './src/Auth/SystemWiseComplaint';
import NewTaskmddash from './src/Auth/NewTaskmddash';
import AssignedTaskmddash from './src/Auth/AssignedTaskmddash';
import Assignedviewdetail from './src/Auth/Assignedviewdetail';
import Queryforassiss from './src/Auth/Queryforassiss';
import Progressreport from './src/Auth/Progressreport';
import Allstaffreport from './src/Auth/Allstaffreport';
import Networknew from './src/Auth/Networknew';
import Regcomplain from './src/Auth/Regcomplain';
import Cat from './src/Auth/Cat';
import SubCat from './src/Auth/SubCat';
import SubCatComplaints from './src/Auth/SubCatComplaints';
import Cities from './src/Auth/Cities';
import Complaint from './src/Complaint/Complaint';
import Main from './src/Auth/Main';
import ListComplaint from './src/Complaint/ListCompalints';
import ArchivedComplaintsScreen from './src/Complaint/ArchivedComplaintsScreen';
import ArchivedComplaintsource from './src/Complaint/ArchivedComplaintsource';
import UserListComplaint from './src/Complaint/UserListComplaint';
import OTPScreen from './src/Auth/OTPScreen';
import Contact from './src/Auth/Contact';
import Taskdetailscreenmddash from './src/Auth/Taskdetailscreenmddash';
import SystemScreen from './src/Auth/Systems';
import Sourcedetail from './src/Auth/Sourcedetail';
import TrackComplaint from './src/Auth/TrackComplaint';
import CitiesComplaint from './src/Complaint/CitiesComplaint';
import CitiesComplaintresolved from './src/Complaint/CitiesComplaintresolved';
import Queries from './src/Auth/Queries';
import QueryDetails from './src/Auth/QueryDetails';
import PfiMDdash from './src/Auth/PfiMDdash';
import InprocessComplaint from './src/Network/InprocessComplaint';
import ResolvedComplaint from './src/Network/ResolvedComplaints';
import DownloadPdf from './src/Network/DownloadPdf';
import NetworkViewDetails from './src/Network/NetworkViewDetails';
import ResolvedNetworkViewDetails from './src/Network/ResolvedNetworkViewDetails';
import PFIdashboard from './src/PFI/PFIdashboard';
import PFIComplain from './src/PFI/PFIComplain';
import PFILodgecomplaint from './src/PFI/PFILodgeComplaint';
import PFINewTask from './src/PFI/PFINewTask';
import YourTask from './src/Network/YourTask';
import MiddleManViewDetails from './src/Auth/MiddleManViewDetails';
import PFIViewDetails from './src/PFI/PFIViewDetails';
import PFIAssignedTask from './src/PFI/PFIAssignedTask';
import PFIYourTask from './src/PFI/PFIYourTask';
import ProgressCircleDetails from './src/PFI/ProgressCircleDetails';
import YourAssignedComplaints from './src/Network/YourAssignedComplaints';
import Networkassignedquery from './src/Network/Networkassignedquery';
import Networkqueries from './src/Network/Networkqueries';
import Getalltask from './src/Network/Getalltask';
import NewTaskCCC from './src/CCC/NewTaskCCC';
import Assignedtasksccc   from './src/CCC/Assignedtasksccc';
import Yourtasksccc   from './src/CCC/Yourtasksccc';
import QueryforassissCCC from './src/CCC/QueryforassissCCC';
import ComplaintsCCC from './src/CCC/ComplaintsCCC';
import Ccc from './src/CCC/Ccc';
import Cccveco from './src/CCC/Cccveco';
import Cccacat from './src/CCC/Cccacat';
import Cccverified from './src/CCC/Cccverified';
import Cccaction from './src/CCC/Cccaction';
import SystemScreenCCC from './src/CCC/SystemScreenCCC';
import FloatingButton from './src/CCC/FloatingButton';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SignOutButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      await EncryptedStorage.clear();
      console.log('User data cleared from encrypted storage');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };
  
  const handle = async () => {
    try {
      // Clear user details from sync storage
      syncStorage.remove('user_detail');

      // Reset navigation stack to navigate back to Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.error('Error during logout:', e);
      // Handle logout error if needed
    }
  };

  const RenderModal = () => (
<Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.iconWrapper}>
              <View style={styles.iconContainer}>
                <Icon name="power-off" size={40} color="green" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleLogout}
              >
                <Text style={styles.modalOptionText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  );

  return (
    <>
      <View style={styles.signOutButton}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Animatable.View
  animation={{
    from: { translateX: 4 }, // Starting position on the right
    to: { translateX: 0 }, // Ending position on the left
  }}
  duration={3000}
  iterationCount="infinite"
  easing="ease-in-out"
  useNativeDriver>
  <Icon name="sign-out" size={20} color="white" />
</Animatable.View>


        </TouchableOpacity>
      </View>
      {RenderModal()}
    </>
  );
};


const CCCTabs = () => (
  <View style={{ flex: 1 }}>
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#CD1D0C',
        inactiveTintColor: 'grey',
        labelStyle: {
          fontSize: 10,
          marginBottom: 5,
        },
        activeBackgroundColor: '#fadadd',
      }}>
      <Tab.Screen
        name="NewTaskCCC"
        component={NewTaskCCC}
        options={{
          headerShown: false,
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <Icon name="tasks" size={22} color="#A00000" />
          ),
        }}
      />
      <Tab.Screen
        name="Ccc"
        component={Ccc}
        options={{
          headerShown: false,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard" size={25} color="#A00000" />
          ),
        }}
      />
      <Tab.Screen
        name="ComplaintsCCC"
        component={ComplaintsCCC}
        options={{
          headerShown: false,
          tabBarLabel: 'Complaints',
          tabBarIcon: ({ color, size }) => (
            <Icon name="building" size={25} color="#A00000" />
          ),
        }}
      />
      <Tab.Screen
        name="QueryforassissCCC"
        component={QueryforassissCCC}
        options={{
          headerShown: false,
          tabBarLabel: 'Queries',
          tabBarIcon: ({ color, size }) => (
            <Icon name="comment" size={25} color="#A00000" />
          ),
        }}
      />
      <Tab.Screen
        name="SystemScreenCCC"
        component={SystemScreenCCC}
        options={{
          headerShown: false,
          tabBarLabel: 'Systems',
          tabBarIcon: ({ color, size }) => (
            <Icon name="sliders" size={25} color="#A00000" />
          ),
        }}
      />
    </Tab.Navigator>
    <SignOutButton onPress={() => console.log('Sign Out')} />
  </View>
);

const MainTabs = () => (
  <View style={{ flex: 1 }}>
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#CD1D0C',
        inactiveTintColor: 'grey',
        labelStyle: {
          fontSize: 10,
          marginBottom: 5,
        },
        activeBackgroundColor: '#fadadd',
      }}>
      <Tab.Screen
        name="NewTaskmddash"
        component={NewTaskmddash}
        options={{
          headerShown: false,
          tabBarLabel: 'Assign Task',
          tabBarIcon: ({ color, size }) => (
            <Icon name="tasks" size={22} color="#CD1D0C" />
          ),
        }}
      />
      <Tab.Screen
        name="Mddash"
        component={Mddash}
        options={{
          headerShown: false,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard" size={25} color="#CD1D0C" />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Queryforassiss"
        component={Queryforassiss}
        options={{
          headerShown: false,
          tabBarLabel: 'Queries',
          tabBarIcon: ({ color, size }) => (
            <Icon name="comment" size={25} color="#CD1D0C" />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Cities"
        component={Cities}
        options={{
          headerShown: false,
          tabBarLabel: 'Cities',
          tabBarIcon: ({ color, size }) => (
            <Icon name="building" size={22} color="#CD1D0C" />
          ),
        }}
      />
      <Tab.Screen
        name="SystemScreen"
        component={SystemScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Systems',
          tabBarIcon: ({ color, size }) => (
            <Icon name="sliders" size={25} color="#CD1D0C" />
          ),
        }}
      />
    </Tab.Navigator>
    <SignOutButton onPress={() => console.log('Sign Out')} />
  </View>
);

const PFITabs = () => (
  <View style={{ flex: 1 }}>
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#006400',
        inactiveTintColor: 'grey',
        labelStyle: {
          fontSize: 10,
          marginBottom: 5,
        },
        activeBackgroundColor: '#90EE90',
      }}>
              <Tab.Screen
        name="PFINewTask"
        component={PFINewTask}
        options={{
          headerShown: false,
          tabBarLabel: 'New Task',
          tabBarIcon: ({ color, size }) => (
            <Icon name="tasks" size={22} color={color} />
          ),
        }}
      />
        <Tab.Screen
      name="PFIdashboard"
      component={PFIdashboard}
      options={{
        headerShown: false,
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({color, size}) => (
          <Icon name="dashboard" size={25} color="#006400" />
         
        ),
      }}
    />

      <Tab.Screen
        name="PFIComplain"
        component={PFIComplain}
        options={{
          headerShown: false,
          tabBarLabel: 'Complaints',
          tabBarIcon: ({ color, size }) => (
            <Icon name="exclamation-circle" size={22} color={color} />
          ),
        }}
      />

      {/* <Tab.Screen
        name="PFIYourTask"
        component={PFIYourTask}
        options={{
          headerShown: false,
          tabBarLabel: 'Your Task',
          tabBarIcon: ({ color, size }) => (
            <Icon name="tasks" size={22} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="PFILodgecomplaint"
        component={PFILodgecomplaint}
        options={{
          headerShown: false,
          tabBarLabel: 'Lodge Complaint',
          tabBarIcon: ({ color, size }) => (
            <Icon name="comment" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    <SignOutButton onPress={() => console.log('Sign Out')} />
  </View>
);

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#CD1D0C'},
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#CD1D0C'},
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#CD1D0C'},
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="AssignedTaskmddash" component={AssignedTaskmddash}/>
      <Stack.Screen name="Assignedviewdetail" component={Assignedviewdetail}/>
      <Stack.Screen name="Sourcedetail" component={Sourcedetail}/>
      <Stack.Screen name="SystemWiseComplaint" component={SystemWiseComplaint}/>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="PFITabs" component={PFITabs} />
      <Stack.Screen name="CCCTabs" component={CCCTabs} />
      <Stack.Screen name="Networknew" component={Networknew} />
      <Stack.Screen name="InprocessComplaint" component={InprocessComplaint}/>
      <Stack.Screen name="ResolvedComplaint" component={ResolvedComplaint}/>
      <Stack.Screen name="NetworkViewDetails" component={NetworkViewDetails}/>
      <Stack.Screen name="ResolvedNetworkViewDetails" component={ResolvedNetworkViewDetails}/>
      <Stack.Screen name="Regcomplain" component={Regcomplain} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Cat" component={Cat} />
      <Stack.Screen name="SubCat" component={SubCat}/>
      <Stack.Screen name="ArchivedComplaintsScreen" component={ArchivedComplaintsScreen}/>
      <Stack.Screen name="ArchivedComplaintsource" component={ArchivedComplaintsource}/>
      <Stack.Screen name="SubCatComplaints" component={SubCatComplaints}/>
      <Stack.Screen name="Progressreport" component={Progressreport}/>
      <Stack.Screen name="Allstaffreport" component={Allstaffreport} options={{orientation:'landscape_right'}}/>
      <Stack.Screen name='CitiesComplaint' component={CitiesComplaint}/>
      <Stack.Screen name='CitiesComplaintresolved' component={CitiesComplaintresolved}/>
      <Stack.Screen name="Queries" component={Queries}/>
      <Stack.Screen name="QueryDetails" component={QueryDetails}/>
      <Stack.Screen name="YourTask" component={YourTask}/>
      <Stack.Screen name="MiddleManViewDetails" component={MiddleManViewDetails}/>
      <Stack.Screen name="PFIViewDetails" component={PFIViewDetails}/>
      <Stack.Screen name="PFIAssignedTask" component={PFIAssignedTask}/>
      <Stack.Screen name="PFIYourTask" component={PFIYourTask}/>
      <Stack.Screen name="DownloadPdf" component={DownloadPdf}/>
      <Stack.Screen name="YourAssignedComplaints" component={YourAssignedComplaints}/>
      <Stack.Screen name="Networkassignedquery" component={Networkassignedquery}/>
      <Stack.Screen name="Networkqueries" component={Networkqueries}/>
      <Stack.Screen name="Getalltask" component={Getalltask}/>
      <Stack.Screen name="NewTaskCCC" component={NewTaskCCC}/>
      <Stack.Screen name="Assignedtasksccc" component={Assignedtasksccc}/>
      <Stack.Screen name="Yourtasksccc" component={Yourtasksccc}/>
      <Stack.Screen name="QueryforassissCCC" component={QueryforassissCCC}/>
      <Stack.Screen name="ComplaintsCCC" component={ComplaintsCCC}/>
      <Stack.Screen name="SystemScreenCCC" component={SystemScreenCCC}/>
      <Stack.Screen name="Ccc" component={Ccc}/>
      <Stack.Screen name="Cccveco" component={Cccveco}/>
      <Stack.Screen name="Cccacat" component={Cccacat}/>
      <Stack.Screen name="Cccverified" component={Cccverified}/>
      <Stack.Screen name="Cccaction" component={Cccaction}/>
      <Stack.Screen name="ProgressCircleDetails" component={ProgressCircleDetails}/>
      <Stack.Screen name="PfiMDdash" component={PfiMDdash}/>
      <Stack.Screen name="FloatingButton" component={FloatingButton}/>
      <Stack.Screen name="TrackComplaint" component={TrackComplaint}/>
      <Stack.Screen
        name="Complaint"
        component={Complaint}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="List"
        component={ListComplaint}
        options={{headerShown: false, orientation: 'landscape_right'}}
      />
      <Stack.Screen
        name="UserList"
        component={UserListComplaint}
        options={{headerShown: false, orientation: 'landscape_right'}}
      />
      <Stack.Screen name="SystemScreen" component={SystemScreen} />
      <Stack.Screen
        name="Taskdetailscreenmddash"
        component={Taskdetailscreenmddash}
      />
    </Stack.Navigator>
  </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  signOutButton: {
    position: 'absolute',
    bottom: 70, // Adjust as needed to position above the tab bar
    right: 20, // Adjust as needed for your desired horizontal position
    backgroundColor: '#03A9F4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  iconWrapper: {
    position: 'absolute',
    top: -30,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  iconContainer: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 30,
    color: 'black',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  buttonRow: {
    width: '100%',
  },
  modalOption: {
    alignItems: 'center',
    backgroundColor: 'green',
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  modalOptionText: {
    fontSize: 16,
    color: 'white',
  },
  modalCancel: {
    alignItems: 'center',
    backgroundColor: 'gray',
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  modalCancelText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
