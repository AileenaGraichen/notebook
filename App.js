import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { app, database } from './firebase';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Details' component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Home = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [notesSnapshot, loading, error] = useCollection(collection(database, "notes"));

  const addNote = async () => {
    if (input.trim().length > 0) {
      await addDoc(collection(database, "notes"), { text: input });
      setInput("");
    }
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(database, "notes", id));
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const notes = notesSnapshot?.docs.map(doc => ({ id: doc.id, text: doc.data().text })) || [];

  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Notebook</Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        style={styles.TextInput}
        placeholder="Type your note here"
      />
      <TouchableOpacity onPress={addNote} style={styles.button}>
        <Text style={{ color: '#FFFFFF' }}>Add Note</Text>
      </TouchableOpacity>
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <TouchableOpacity onPress={() => navigation.navigate('Details', { message: item.text, id: item.id })}>
              <Text style={styles.noteText}>{item.text.length > 30 ? item.text.substring(0, 30) + '...' : item.text}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.deleteButton}>
              <MaterialIcons name="delete" size={24} color="#F9DBF0" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const Details = ({ navigation, route }) => {
  const [editableText, setEditableText] = useState(route.params?.message);
  const noteId = route.params?.id; // Capture the note ID passed from the Home component

  const saveText = async () => {
    if (noteId && editableText.trim().length > 0) {
      const noteRef = doc(database, "notes", noteId);
      await updateDoc(noteRef, { text: editableText });
      navigation.goBack(); // Navigate back to the Home screen after saving
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={editableText}
        onChangeText={setEditableText}
        style={styles.TextInput}
        multiline
      />
      <TouchableOpacity onPress={saveText} style={styles.button}>
        <Text style={{ color: '#FFFFFF' }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#feeef7',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  Text: {
    color: '#644255',
    fontSize: 20,
    fontWeight: 'bold',
  },
  TextInput: {
    width: '80%', // Adjusted for better usability
    height: 40,
    backgroundColor: '#FDD6EC',
    borderColor: '#644255',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    color: '#644255',
    padding: 10, // Added padding for better text visibility
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#EEFEF5',
    borderColor: '#644255',
    borderRadius: 5,
    borderWidth: 1,
  },
  noteText: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  button: {
    backgroundColor: '#644255',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

