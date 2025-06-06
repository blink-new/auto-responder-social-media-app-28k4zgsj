import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Instagram, MessageCircle, Video, Flame, Heart, Share, Users, Zap } from 'lucide-react-native';
import { useState } from 'react';
import { ExclusionModal } from '@/components/ExclusionModal';

export default function Social() {
  const [platforms, setPlatforms] = useState([
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: MessageCircle,
      color: '#FFFC00',
      colorDark: '#000000',
      connected: true,
      features: {
        flames: true,
        messages: true,
        stories: false
      },
      stats: {
        flames: 12,
        messages: 34,
        friends: 156
      },
      excludedContacts: ['Alice', 'Bob']
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: '#E4405F',
      colorDark: '#C13584',
      connected: true,
      features: {
        comments: true,
        messages: true,
        likes: true
      },
      stats: {
        comments: 89,
        likes: 245,
        followers: 1240
      },
      excludedContacts: ['Charlie']
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Video,
      color: '#000000',
      colorDark: '#FE2C55',
      connected: false,
      features: {
        comments: false,
        likes: false,
        shares: false
      },
      stats: {
        comments: 0,
        likes: 0,
        views: 0
      },
      excludedContacts: []
    }
  ]);

  const [showExclusionModal, setShowExclusionModal] = useState(false);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);

  const togglePlatform = (platformId: string) => {
    setPlatforms(prev =>
      prev.map(p =>
        p.id === platformId
          ? { ...p, connected: !p.connected }
          : p
      )
    );
  };

  const toggleFeature = (platformId: string, feature: string) => {
    setPlatforms(prev =>
      prev.map(p =>
        p.id === platformId
          ? {
              ...p,
              features: {
                ...p.features,
                [feature]: !p.features[feature as keyof typeof p.features]
              }
            }
          : p
      )
    );
  };

  const openExclusionModal = (platformId: string) => {
    setSelectedPlatformId(platformId);
    setShowExclusionModal(true);
  };

  const closeExclusionModal = () => {
    setShowExclusionModal(false);
    setSelectedPlatformId(null);
  };

  const handleAddContactExclusion = (contact: string) => {
    if (!selectedPlatformId) return;
    setPlatforms(prev =>
      prev.map(p =>
        p.id === selectedPlatformId
          ? { ...p, excludedContacts: [...p.excludedContacts, contact] }
          : p
      )
    );
  };

  const handleRemoveContactExclusion = (contact: string) => {
    if (!selectedPlatformId) return;
    setPlatforms(prev =>
      prev.map(p =>
        p.id === selectedPlatformId
          ? { ...p, excludedContacts: p.excludedContacts.filter(c => c !== contact) }
          : p
      )
    );
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'flames': return Flame;
      case 'messages': return MessageCircle;
      case 'comments': return MessageCircle;
      case 'likes': return Heart;
      case 'shares': return Share;
      case 'stories': return Users;
      default: return Zap;
    }
  };

  const getFeatureLabel = (feature: string) => {
    switch (feature) {
      case 'flames': return 'Flammes auto';
      case 'messages': return 'Messages auto';
      case 'comments': return 'Réponses commentaires';
      case 'likes': return 'Likes auto';
      case 'shares': return 'Partages auto';
      case 'stories': return 'Stories auto';
      default: return feature;
    }
  };

  return (
    <LinearGradient
      colors={['#FF6B6B', '#4ECDC4']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={styles.header}
          entering={FadeInDown.duration(400)}
        >
          <Text style={styles.title}>Réseaux Sociaux</Text>
          <Text style={styles.subtitle}>Gérez vos plateformes connectées</Text>
        </Animated.View>

        <Animated.View
          style={styles.overviewCard}
          entering={FadeInDown.duration(400).delay(100)}
        >
          <Text style={styles.overviewTitle}>Vue d'ensemble</Text>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>
                {platforms.filter(p => p.connected).length}
              </Text>
              <Text style={styles.overviewLabel}>Connectées</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>
                {platforms.reduce((sum, p) =>
                  sum + Object.values(p.features).filter(Boolean).length, 0
                )}
              </Text>
              <Text style={styles.overviewLabel}>Fonctions actives</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>368</Text>
              <Text style={styles.overviewLabel}>Actions aujourd'hui</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={styles.platformsContainer}
          entering={FadeInDown.duration(400).delay(200)}
        >
          <Text style={styles.sectionTitle}>Vos plateformes</Text>
          {platforms.map((platform, index) => (
            <Animated.View
              key={platform.id}
              style={styles.platformCard}
              entering={FadeInLeft.duration(400).delay(300 + index * 100)}
            >
              <View style={styles.platformHeader}>
                <View style={styles.platformInfo}>
                  <View style={[styles.platformIcon, { backgroundColor: `${platform.color}20` }]}>
                    <platform.icon size={24} color={platform.color} />
                  </View>
                  <View>
                    <Text style={styles.platformName}>{platform.name}</Text>
                    <Text style={[
                      styles.platformStatus,
                      { color: platform.connected ? '#10B981' : '#EF4444' }
                    ]}>
                      {platform.connected ? '● Connecté' : '● Déconnecté'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={platform.connected}
                  onValueChange={() => togglePlatform(platform.id)}
                  trackColor={{ false: '#D1D5DB', true: platform.color + '40' }}
                  thumbColor={platform.connected ? platform.color : '#9CA3AF'}
                />
              </View>

              {platform.connected && (
                <>
                  <View style={styles.platformStats}>
                    {Object.entries(platform.stats).map(([key, value]) => (
                      <View key={key} style={styles.statItem}>
                        <Text style={styles.statValue}>{value}</Text>
                        <Text style={styles.statKey}>{key}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.featuresContainer}>
                    <Text style={styles.featuresTitle}>Fonctionnalités</Text>
                    <View style={styles.featuresList}>
                      {Object.entries(platform.features).map(([feature, enabled]) => {
                        const FeatureIcon = getFeatureIcon(feature);
                        return (
                          <View key={feature} style={styles.featureItem}>
                            <View style={styles.featureInfo}>
                              <FeatureIcon size={16} color={enabled ? platform.color : '#9CA3AF'} />
                              <Text style={[
                                styles.featureLabel,
                                { color: enabled ? '#1F2937' : '#9CA3AF' }
                              ]}>
                                {getFeatureLabel(feature)}
                              </Text>
                            </View>
                            <Switch
                              value={enabled}
                              onValueChange={() => toggleFeature(platform.id, feature)}
                              trackColor={{ false: '#D1D5DB', true: platform.color + '40' }}
                              thumbColor={enabled ? platform.color : '#9CA3AF'}
                              style={styles.featureSwitch}
                            />
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.exclusionsContainer}>
                    <Text style={styles.exclusionsTitle}>Exclusions</Text>
                    <TouchableOpacity
                      style={styles.manageExclusionsButton}
                      onPress={() => openExclusionModal(platform.id)}
                    >
                      <Text style={styles.manageExclusionsButtonText}>Gérer les exclusions ({platform.excludedContacts.length})</Text>
                    </TouchableOpacity>
                    {platform.excludedContacts.map((contact, contactIndex) => (
                      <View key={contactIndex} style={styles.excludedContactItem}>
                        <Text style={styles.excludedContactName}>{contact}</Text>
                        <TouchableOpacity>
                          <Text style={styles.removeExclusionButton}>X</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {!platform.connected && (
                <TouchableOpacity
                  style={[styles.connectButton, { backgroundColor: platform.color }]}
                  onPress={() => togglePlatform(platform.id)}
                >
                  <Text style={styles.connectButtonText}>Se connecter</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View
          style={styles.quickActions}
          entering={FadeInDown.duration(400).delay(600)}
        >
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Flame size={24} color="#F59E0B" />
              <Text style={styles.actionTitle}>Envoyer toutes les flammes</Text>
              <Text style={styles.actionSubtitle}>Maintenir vos streaks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.actionTitle}>Like en masse</Text>
              <Text style={styles.actionSubtitle}>Booster l'engagement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <MessageCircle size={24} color="#8B5CF6" />
              <Text style={styles.actionTitle}>Répondre aux DM</Text>
              <Text style={styles.actionSubtitle}>Messages en attente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Users size={24} color="#10B981" />
              <Text style={styles.actionTitle}>Follow back</Text>
              <Text style={styles.actionSubtitle}>Nouveaux followers</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {showExclusionModal && selectedPlatformId && (
        <ExclusionModal
          visible={showExclusionModal}
          onClose={closeExclusionModal}
          platformName={platforms.find(p => p.id === selectedPlatformId)?.name || ''}
          excludedContacts={platforms.find(p => p.id === selectedPlatformId)?.excludedContacts || []}
          onAddContact={handleAddContactExclusion}
          onRemoveContact={handleRemoveContactExclusion}
        />
      )}
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
    marginBottom: 25,
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
  overviewCard: {
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
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  platformsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  platformCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  platformName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  platformStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  platformStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statKey: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  featuresContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  featureSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  connectButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  exclusionsContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 15,
  },
  exclusionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  manageExclusionsButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageExclusionsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  excludedContactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  excludedContactName: {
    fontSize: 14,
    color: '#374151',
  },
  removeExclusionButton: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: 'bold',
  },
});