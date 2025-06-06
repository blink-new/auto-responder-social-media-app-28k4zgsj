import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, MessageCircle, Users, TrendingUp, Clock } from 'lucide-react-native';
import { useState } from 'react';

export default function Dashboard() {
  const [isActive, setIsActive] = useState(true);

  const stats = [
    { label: 'Messages envoyés', value: '247', icon: MessageCircle, color: '#10B981' },
    { label: 'Flammes maintenues', value: '12', icon: TrendingUp, color: '#F59E0B' },
    { label: 'Comptes connectés', value: '3', icon: Users, color: '#8B5CF6' },
    { label: 'Temps économisé', value: '2h 15m', icon: Clock, color: '#EF4444' },
  ];

  return (
    <LinearGradient
      colors={['#8B5CF6', '#3B82F6']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          style={styles.header}
          entering={FadeInDown.duration(400)}
        >
          <Text style={styles.greeting}>Bonjour ! 👋</Text>
          <Text style={styles.title}>Auto Responder</Text>
          <Text style={styles.subtitle}>Gérez vos réseaux sociaux automatiquement</Text>
        </Animated.View>

        {/* Status Card */}
        <Animated.View 
          style={styles.statusCard}
          entering={FadeInDown.duration(400).delay(100)}
        >
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Status du Bot</Text>
              <Text style={[styles.statusText, { color: isActive ? '#10B981' : '#EF4444' }]}>
                {isActive ? '🟢 Actif' : '🔴 Inactif'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleButton, { backgroundColor: isActive ? '#EF4444' : '#10B981' }]}
              onPress={() => setIsActive(!isActive)}
            >
              {isActive ? (
                <Pause size={20} color="#FFFFFF" />
              ) : (
                <Play size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.statusDescription}>
            {isActive 
              ? 'Votre assistant automatique répond activement à vos messages'
              : 'Cliquez sur play pour activer les réponses automatiques'
            }
          </Text>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View 
          style={styles.statsContainer}
          entering={FadeInDown.duration(400).delay(200)}
        >
          <Text style={styles.sectionTitle}>Statistiques d'aujourd'hui</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Animated.View 
                key={stat.label}
                style={styles.statCard}
                entering={FadeInRight.duration(400).delay(300 + index * 100)}
              >
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View 
          style={styles.activityCard}
          entering={FadeInDown.duration(400).delay(400)}
        >
          <Text style={styles.sectionTitle}>Activité récente</Text>
          <View style={styles.activityList}>
            {[
              { app: 'Instagram', action: 'Réponse à @sarah_music', time: 'Il y a 2 min', color: '#E4405F' },
              { app: 'Snapchat', action: 'Flamme envoyée à Alex', time: 'Il y a 5 min', color: '#FFFC00' },
              { app: 'TikTok', action: 'Commentaire aimé', time: 'Il y a 8 min', color: '#000000' },
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityDot, { backgroundColor: activity.color }]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <Text style={styles.activityApp}>{activity.app}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityApp: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
    backgroundColor: '#8B5CF620',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});