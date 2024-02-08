import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons

export default function App() {
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  async function saveNotes(notesArray) {
    try {
      const jsonValue = JSON.stringify(notesArray);
      await AsyncStorage.setItem('notes', jsonValue);
    } catch (e) {
      console.log(e); // Log saving error
    }
  }

  async function loadNotes() {
    try {
      const jsonValue = await AsyncStorage.getItem('notes');
      return jsonValue != null ? setNotes(JSON.parse(jsonValue)) : null;
    } catch(e) {
      console.log(e); // Log reading value error
    }
  }

  function pressMe() {
    if (input.trim().length > 0) {
      const newNotes = [...notes, input];
      setNotes(newNotes);
      setInput("");
      saveNotes(newNotes);
    }
  }

  function deleteNote(index) {
    const newNotes = notes.filter((_, noteIndex) => noteIndex !== index);
    setNotes(newNotes);
    saveNotes(newNotes);
  }

  return (
    <View style={styles.container}>
      <Text>Notebook</Text>
      <TextInput 
        title="input" 
        value={input} 
        onChangeText={setInput} 
        style={styles.TextInput}
        placeholder="Type your note here"
      />
      <Button title="Enter" onPress={pressMe} />
      <FlatList 
        data={notes}
        renderItem={({ item, index }) => (
          <View style={styles.noteItem}>
            <Text style={styles.noteText}>{item}</Text>
            <TouchableOpacity onPress={() => deleteNote(index)} style={styles.deleteButton}>
              <MaterialIcons name="delete" size={24} color="red" /> {/* Using the icon as a delete button */}
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  TextInput: {
    width: '90%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 10,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9', // Slight background for each note for better UI
    borderRadius: 5, // Rounded corners for the note item
  },
  noteText: {
    flex: 1, // Ensure text takes up the maximum space
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5, // Padding for easier tapping
  },
});
