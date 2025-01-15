import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, History, BarChart2, User } from 'lucide-react';

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: History, label: 'History', path: '/session-history' },
    { icon: BarChart2, label: 'Stats', path: '/stats' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <View style={styles.container}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          key={item.path}
          style={[
            styles.navItem,
            isActive(item.path) && styles.activeNavItem
          ]}
          onPress={() => navigate(item.path)}
        >
          <item.icon
            size={24}
            color={isActive(item.path) ? '#f97316' : '#666'}
          />
          <Text
            style={[
              styles.navLabel,
              isActive(item.path) && styles.activeNavLabel
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#18181b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeNavItem: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#f97316',
  },
});
