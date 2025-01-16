import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Flame, Clock, Trophy } from 'lucide-react'
import NavigationBar from '../Navigation/NavigationBar';

const data = [
  { day: "Mon", duration: 0.5, xp: 10, calories: 200 },
  { day: "Tue", duration: 1.0, xp: 20, calories: 400 },
  { day: "Wed", duration: 1.0, xp: 20, calories: 400 },
  { day: "Thu", duration: 0.5, xp: 10, calories: 200 },
  { day: "Fri", duration: 0.0, xp: 0, calories: 0 },
  { day: "Sat", duration: 1.5, xp: 30, calories: 600 },
  { day: "Sun", duration: 0.0, xp: 0, calories: 0 },
]

const superAthleteLevel = (xp) => {
  if (xp >= 500) return "Legendary";
  if (xp >= 300) return "Elite";
  if (xp >= 100) return "Pro";
  return "Rookie";
}

export default function Stats() {
  const totalXP = data.reduce((acc, curr) => acc + curr.xp, 0)
  const totalDuration = data.reduce((acc, curr) => acc + curr.duration, 0)
  const totalCalories = data.reduce((acc, curr) => acc + curr.calories, 0)

  return (
    <View style={styles.container}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Training Statistics</Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Total Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Clock style={styles.icon} />
            <View>
              <Text style={styles.statLabel}>Total Time</Text>
              <Text style={styles.statValue}>{totalDuration} hours</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Activity style={styles.icon} />
            <View>
              <Text style={styles.statLabel}>Total XP</Text>
              <Text style={styles.statValue}>{totalXP} XP</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Flame style={styles.icon} />
            <View>
              <Text style={styles.statLabel}>Total Calories</Text>
              <Text style={styles.statValue}>{totalCalories} kcal</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Trophy style={styles.icon} />
            <View>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>{superAthleteLevel(totalXP)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.chartsGrid}>
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Session Duration</Text>
            <Clock style={styles.chartIcon} />
          </View>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" tick={{fill: '#ffffff'}} />
              <YAxis tick={{fill: '#ffffff'}} />
              <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none'}} />
              <Bar dataKey="duration" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Experience Points (XP)</Text>
            <Activity style={styles.chartIcon} />
          </View>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" tick={{fill: '#ffffff'}} />
              <YAxis tick={{fill: '#ffffff'}} />
              <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none'}} />
              <Line type="monotone" dataKey="xp" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Calories Burned</Text>
            <Flame style={styles.chartIcon} />
          </View>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" tick={{fill: '#ffffff'}} />
              <YAxis tick={{fill: '#ffffff'}} />
              <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none'}} />
              <Bar dataKey="calories" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </View>
      </View>
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
  statsHeader: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fb923c',
    fontFamily: 'Orbitron',
    width: '100%',
  },
  summaryContainer: {
    backgroundColor: '#18181b',
    padding: 20,
    borderRadius: 8,
    boxShadow: 3, 
    width: '90%',
    maxWidth: 1000,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fb923c',
    fontFamily: 'Orbitron',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    '@media (max-width: 768px)': {
      width: '100%',
    },
  },
  icon: {
    width: 28,
    height: 28,
    color: '#f97316',
    marginRight: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Orbitron',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f97316',
    fontFamily: 'Orbitron',
  },
  chartsGrid: {
    marginTop: 24,
    flexDirection: 'column',
    width: '90%',
    maxWidth: 1000,
    alignSelf: 'center',
    paddingBottom: 24,
  },
  chartContainer: {
    backgroundColor: '#18181b',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    boxShadow: 3, 
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fb923c',
    fontFamily: 'Orbitron',
  },
  chartIcon: {
    width: 24,
    height: 24,
    color: '#fb923c',
  },
});
