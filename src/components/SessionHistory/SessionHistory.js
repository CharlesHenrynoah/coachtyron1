import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Search, Play, RotateCcw } from 'lucide-react'
import NavigationBar from '../Navigation/NavigationBar';

const mockSessions = [
  { id: '1', name: 'Morning Workout', date: '2023-06-01', time: '08:30', status: 'completed' },
  { id: '2', name: 'Lunch Break Exercise', date: '2023-06-02', time: '12:15', status: 'paused' },
  { id: '3', name: 'Evening Cardio', date: '2023-06-03', time: '18:45', status: 'completed' },
  { id: '4', name: 'Weekend HIIT', date: '2023-06-04', time: '10:00', status: 'paused' },
  { id: '5', name: 'Strength Training', date: '2023-06-05', time: '14:30', status: 'completed' },
]

export default function SessionHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sessions] = useState(mockSessions)

  const filteredSessions = sessions.filter(session => 
    session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.date.includes(searchTerm) ||
    session.time.includes(searchTerm)
  )

  const handleResume = (sessionId) => {
    console.log(`Resuming session ${sessionId}`)
    // Implement resume logic here
  }

  const handleRestart = (sessionId) => {
    console.log(`Restarting session ${sessionId}`)
    // Implement restart logic here
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session History</Text>
      
      <View style={styles.searchContainer}>
        <Search style={styles.searchIcon} size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search sessions..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView style={styles.sessionList}>
        {filteredSessions.map(session => (
          <View key={session.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{session.name}</Text>
            </View>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.dateText}>{session.date} at {session.time}</Text>
                <Text style={[
                  styles.statusText,
                  session.status === 'completed' ? styles.statusCompleted : styles.statusPaused
                ]}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                {session.status === 'paused' && (
                  <TouchableOpacity
                    style={[styles.button, styles.resumeButton]}
                    onPress={() => handleResume(session.id)}
                  >
                    <Play size={16} color="#fff" />
                    <Text style={styles.buttonText}>Resume</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.button, styles.restartButton]}
                  onPress={() => handleRestart(session.id)}
                >
                  <RotateCcw size={16} color="#f97316" />
                  <Text style={[styles.buttonText, styles.restartButtonText]}>Restart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <NavigationBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#09090b',
    height: '100vh',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    fontFamily: 'Orbitron',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 24,
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  sessionList: {
    flex: 1,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Orbitron',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusCompleted: {
    color: '#22c55e',
  },
  statusPaused: {
    color: '#f5a524',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
    height: 32,
    minWidth: 90,
  },
  resumeButton: {
    backgroundColor: '#f97316',
    borderWidth: 0,
  },
  restartButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f97316',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 2,
  },
  restartButtonText: {
    color: '#f97316',
  },
});
