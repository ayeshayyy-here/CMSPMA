import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';

const QueryDetails = ({ navigation, route }) => {
  const { query } = route.params;
  const [queryTo, setQueryTo] = useState('');
  const [queryy, setQueryy] = useState('');
  const [queryFile, setQueryFile] = useState('');
  const [queryAudio, setQueryAudio] = useState('');
  const [reply, setReply] = useState('');
  const [replyFile, setReplyFile] = useState('');
  const [replyAudio, setReplyAudio] = useState('');
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replySound, setReplySound] = useState(null);
  const [isReplyPlaying, setIsReplyPlaying] = useState(false);

  useEffect(() => {
    if (query) {
      console.log("Query Data:", query);
      setQueryTo(query.name);
      setQueryy(query.description);
      setQueryFile(query.attachfile);
      setQueryAudio(query.audio);
      setReply(query.reply);
      setReplyFile(query.reply_file);
      setReplyAudio(query.reply_audio);
    }

    return () => {
      if (sound) {
        sound.release();
      }
      if (replySound) {
        replySound.release();
      }
    };
  }, [query]);

  const toggleSound = () => {
    if (isPlaying) {
      if (sound) {
        sound.stop(() => {
          console.log('Sound has been stopped');
          setIsPlaying(false);
        });
      }
    } else {
      if (sound) {
        sound.play(success => {
          if (success) {
            console.log('Successfully finished playing');
            setIsPlaying(false);
          } else {
            console.log('Playback failed due to audio decoding errors');
            setIsPlaying(false);
          }
        });
        setIsPlaying(true);
      } else {
        const newSound = new Sound(`https://complaint-pma.punjab.gov.pk/audio/${queryAudio}`, Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          setSound(newSound);
          newSound.play(success => {
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
    }
  };

  const toggleReplySound = () => {
    if (isReplyPlaying) {
      if (replySound) {
        replySound.stop(() => {
          console.log('Reply sound has been stopped');
          setIsReplyPlaying(false);
        });
      }
    } else {
      if (replySound) {
        replySound.play(success => {
          if (success) {
            console.log('Successfully finished playing reply audio');
            setIsReplyPlaying(false);
          } else {
            console.log('Reply playback failed due to audio decoding errors');
            setIsReplyPlaying(false);
          }
        });
        setIsReplyPlaying(true);
      } else {
        const newReplySound = new Sound(`https://complaint-pma.punjab.gov.pk/audio/${replyAudio}`, Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.log('Failed to load the reply sound', error);
            return;
          }
          setReplySound(newReplySound);
          newReplySound.play(success => {
            if (success) {
              console.log('Successfully finished playing reply audio');
              setIsReplyPlaying(false);
            } else {
              console.log('Reply playback failed due to audio decoding errors');
              setIsReplyPlaying(false);
            }
          });
          setIsReplyPlaying(true);
        });
      }
    }
  };
  const handleFileDownload = (fileUrl) => {
    Linking.openURL(fileUrl).catch((err) => console.error("Couldn't load page", err));
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
          <Text style={styles.headerText}>Query Details</Text>
        </View>
      </LinearGradient>
        <View style={{ flex: 1, padding: '5%' }}>
          <Text style={styles.text}>Query To:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              value={queryTo}
              onChangeText={text => setQueryTo(text)}
              editable={false}
            />
          </View>
          <Text style={styles.text}>Query:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              value={queryy}
              onChangeText={text => setQueryy(text)}
              multiline={true}
            />
          </View>
          <Text style={styles.text}>Query File:</Text>
          <View>
            {queryFile ? (
              <Button
                title="Download File"
                onPress={() => handleFileDownload(`https://complaint-pma.punjab.gov.pk/pics/${queryFile}`)}
                color="#A00000"
              />
            ) : (
              <Text style={styles.noAudioText}>No file available</Text>
            )}
          </View>
          <Text style={styles.text}>Query Audio:</Text>
          <View>
            {queryAudio ? (
              <Button
                title={isPlaying ? "Stop Audio" : "Play Audio"}
                onPress={toggleSound}
                color="#A00000"
              />
            ) : (
              <Text style={styles.noAudioText}>No audio available</Text>
            )}
          </View>
          <Text style={styles.text}>Reply:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              value={reply}
              onChangeText={text => setReply(text)}
              multiline={true}
            />
          </View>
          <Text style={styles.text}>Reply File:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="grey"
              value={replyFile}
              onChangeText={text => setReplyFile(text)}
              multiline={true}
            />
          </View>
          <Text style={styles.text}>Reply Audio:</Text>
          <View>
            {replyAudio ? (
              <Button
                title={isReplyPlaying ? "Stop Audio" : "Play Audio"}
                onPress={toggleReplySound}
                color="#A00000"
              />
            ) : (
              <Text style={styles.noAudioText}>No reply audio available</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
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
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  additionalText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: '35%',
  },
  icon: {
    marginRight: 10,
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
});

export default QueryDetails;
