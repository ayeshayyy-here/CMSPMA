import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';

const Assignedviewdetail = ({ navigation, route }) => {
  const { item } = route.params;
  console.log('Task:', item);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, [sound]);

  const toggleSound = (audioUrl) => {
    if (isPlaying) {
      if (sound) {
        sound.stop(() => {
          console.log('Sound has been stopped');
          setIsPlaying(false);
        });
      }
    } else {
      const newSound = new Sound(audioUrl, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        setSound(newSound);
        newSound.play((success) => {
          if (success) {
            console.log('Successfully finished playing');
            setIsPlaying(false);
          } else {
            console.log('Playback failed due to audio decoding errors');
            setIsPlaying(false);
          }
        });
        setIsPlaying(true);
      });
    }
  };

  const handleFileDownload = (fileUrl) => {
    Linking.openURL(fileUrl).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A00000', '#EA2027']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              size={20}
              color="#fff"
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Assigned Task Details</Text>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, padding: '5%', paddingBottom: '15%' }}>
      <Text style={styles.text}>Assigned To:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              editable={false}
              placeholderTextColor="grey"
              value={item.name}
            />
          </View>
          <Text style={styles.text}>Task Title:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              editable={false}
              value={item.taskTitle}
            />
          </View>
          <Text style={styles.text}>Task Description:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              editable={false}
              value={item.description}
            />
          </View>
          <Text style={styles.text}>Task Priority:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              editable={false}
              value={item.priority}
            />
          </View>
          <Text style={styles.text}>Assign Date:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              editable={false}
              value={item.dateTime}
            />
          </View>
          <Text style={styles.text}>End Date:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              editable={false}
              placeholderTextColor="grey"
              value={item.timeLeft}
            />
          </View>
          <Text style={styles.text}>Task File:</Text>
          
          <View style={styles.buttonContainer}>
            {item.fattach ? (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleFileDownload(`https://complaint-pma.punjab.gov.pk/pics/${item.fattach}`)}
              >
                <Text style={styles.buttonText}>Download File</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noAudioText}>No file available</Text>
            )}
          </View>
          <Text style={styles.text}>Task Audio:</Text>
          <View style={styles.buttonContainer}>
            {item.complaint_audio ? (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => toggleSound(`https://complaint-pma.punjab.gov.pk/audio/${item.complaint_audio}`)}
              >
                <Text style={styles.buttonText}>{isPlaying ? "Stop Audio" : "Play Audio"}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noAudioText}>No audio available</Text>
            )}
          </View>
          <Text style={styles.text}>Resolved Task File:</Text>
          <View style={styles.buttonContainer}>
            {item.resolvefile ? (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleFileDownload(`https://complaint-pma.punjab.gov.pk/pics/${item.resolvefile}`)}
              >
                <Text style={styles.buttonText}>Download Resolved File</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noAudioText}>No resolved file available</Text>
            )}
          </View>
          <Text style={styles.text}>Resolved Task Audio:</Text>
          <View style={styles.buttonContainer}>
            {item.resolveaudio ? (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => toggleSound(`https://complaint-pma.punjab.gov.pk/audio/${item.resolveaudio}`)}
              >
                <Text style={styles.buttonText}>{isPlaying ? "Stop Audio" : "Play Resolved Audio"}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noAudioText}>No resolved audio available</Text>
            )}
          </View>
          <Text style={styles.text}>Status:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              editable={false}
              value={item.status}
            />
          </View>
          <Text style={styles.text}>Remarks:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              editable={false}
              value={item.remarks}
            />
          </View>
          <Text style={styles.text}>Verify Status:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              editable={false}
              value={item.status}
            />
          </View>
          <Text style={styles.text}>Remarks:</Text>
          <View style={styles.verify}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              value={item.verifyremarks}
            />
          </View>
    
      

  
     

       
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  containerview: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
  },
  headText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
  },
  queryButton: {
    backgroundColor: 'maroon',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  queryButtonText: {
    color: '#FFF',
    fontSize: 10,
  },
  textInputContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    height: 45,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#000',
  },
  text: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  audioContainer: {
    marginTop: 10,
  },
  noAudioText: {
    color: 'grey',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
     width: '100%'
  },
  downloadButton: {
    backgroundColor: '#A00000',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
  
    width: '100%'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  verify: {
    marginBottom: '30%',
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default Assignedviewdetail;
