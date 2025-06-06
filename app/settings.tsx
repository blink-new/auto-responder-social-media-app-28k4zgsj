import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bell, Shield, Clock, Smartphone, Globe, HelpCircle, 
  LogOut, User, Lock, Moon, Zap, Download, Trash2 
} from 'lucide-react-native';
import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoStart: true,
    smartDelay: true,
    secureMode: true,
    offlineMode: false,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const settingsGroups = [
    {
      title: 'Général',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          subtitle: 'Recevoir les alertes d\'activité',
          type: 'toggle',
          key: 'notifications',
          color: '#8B5CF6'
        },
        {
          icon: Moon,
          label: 'Mode sombre',
          subtitle: 'Interface en thème sombre',
          type: 'toggle',
          key: 'darkMode',
          color: '#1F2937'
        },
        {
          icon: Zap,
          label: 'Démarrage auto',
          subtitle: 'Lancer au démarrage du téléphone',
          type: 'toggle',
          key: 'autoStart',
          color: '#F59E0B'
        }
      ]
    },
    {
      title: 'Automatisation',
      items: [
        {
          icon: Clock,
          label: 'Délai intelligent',
          subtitle: 'Varier les temps de réponse',
          type: 'toggle',
          key: 'smartDelay',
          color: '#10B981'
        },
        {
          icon: Smartphone,
          label: 'Mode hors ligne',
          subtitle: 'Fonctionner sans internet',
          type: 'toggle',
          key: 'offlineMode',
          color: '#6B7280'
        },
        {
          icon: Clock,
          label: 'Planification',
          subtitle: 'Programmer les heures d\'activité',
          type: 'navigate',
          color: '#3B82F6'
        }
      ]
    },
    {
      title: 'Sécurité & Confidentialité',
      items: [
        {
          icon: Shield,
          label: 'Mode sécurisé',
          subtitle: 'Protection anti-détection',
          type: 'toggle',
          key: 'secureMode',
          color: '#EF4444'
        },
        {
          icon: Lock,
          label: 'Verrouillage app',
          subtitle: 'Protéger par mot de passe',
          type: 'navigate',
          color: '#059669'
        },
        {
          icon: User,
          label: 'Données personnelles',
          subtitle: 'Gérer vos informations',
          type: 'navigate',
          color: '#DC2626'
        }
      ]
    },
    {
      title: 'Support & Informations',
      items: [
        {
          icon: HelpCircle,
          label: 'Aide & FAQ',
          subtitle: 'Obtenir de l\'aide',
          type: 'navigate',
          color: '#7C3AED'
        },
        {
          icon: Globe,
          label: 'À propos',
          subtitle: 'Version 2.1.0',
          type: 'navigate',
          color: '#0891B2'
        },
        {
          icon: Download,
          label: 'Sauvegarder',
          subtitle: 'Exporter les paramètres',
          type: 'navigate',
          color: '#059669'
        }
      ]
    }
  ];

  const dangerActions = [
    {
      icon: Trash2,
      label: 'Réinitialiser l\'app',
      subtitle: 'Supprimer toutes les données',
      color: '#EF4444',
      action: () => showAlert('Réinitialiser', 'Cette action supprimera toutes vos données. Continuer ?')
    },
    {
      icon: LogOut,
      label: 'Déconnexion',
      subtitle: 'Se déconnecter de tous les comptes',
      color: '#F97316',
      action: () => showAlert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?')
    }
  ];

  return (
    <LinearGradient
      colors={['#667EEA', '#764BA2']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          style={styles.header}
          entering={FadeInDown.duration(400)}
        >
          <Text style={styles.title}>Paramètres</Text>
          <Text style={styles.subtitle}>Configurez votre expérience</Text>
        </Animated.View>

        {/* User Profile Card */}
        <Animated.View 
          style={styles.profileCard}
          entering={FadeInDown.duration(400).delay(100)}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <User size={32} color="#FFFFFF" />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.userName}>Utilisateur Pro</Text>
              <Text style={styles.userStatus}>Compte Premium • Actif</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileButtonText}>Modifier</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <Animated.View 
            key={group.title}
            style={styles.settingsGroup}
            entering={FadeInDown.duration(400).delay(200 + groupIndex * 100)}
          >
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.items.map((item, itemIndex) => (
                <Animated.View 
                  key={item.label}
                  style={[
                    styles.settingItem,
                    itemIndex === group.items.length - 1 && styles.lastItem
                  ]}
                  entering={FadeInRight.duration(400).delay(300 + groupIndex * 100 + itemIndex * 50)}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: `${item.color}20` }]}>
                      <item.icon size={20} color={item.color} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.settingRight}>
                    {item.type === 'toggle' && item.key && (
                      <Switch
                        value={settings[item.key as keyof typeof settings]}
                        onValueChange={() => toggleSetting(item.key!)}
                        trackColor={{ false: '#D1D5DB', true: `${item.color}40` }}
                        thumbColor={settings[item.key as keyof typeof settings] ? item.color : '#9CA3AF'}
                      />
                    )}
                    {item.type === 'navigate' && (
                      <TouchableOpacity style={styles.navigateButton}>
                        <Text style={styles.navigateText}>›</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Quick Stats */}
        <Animated.View 
          style={styles.statsCard}
          entering={FadeInDown.duration(400).delay(600)}
        >
          <Text style={styles.statsTitle}>Statistiques d'utilisation</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7j</Text>
              <Text style={styles.statLabel}>Utilisé depuis</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>847</Text>
              <Text style={styles.statLabel}>Messages envoyés</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12h</Text>
              <Text style={styles.statLabel}>Temps économisé</Text>
            </View>
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View 
          style={styles.dangerZone}
          entering={FadeInDown.duration(400).delay(700)}
        >
          <Text style={styles.dangerTitle}>Zone dangereuse</Text>
          <View style={styles.dangerCard}>
            {dangerActions.map((action, index) => (
              <TouchableOpacity 
                key={action.label}
                style={[
                  styles.dangerItem,
                  index === dangerActions.length - 1 && styles.lastItem
                ]}
                onPress={action.action}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: `${action.color}20` }]}>
                    <action.icon size={20} color={action.color} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: action.color }]}>{action.label}</Text>
                    <Text style={styles.settingSubtitle}>{action.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>AutoResponder v2.1.0</Text>
          <Text style={styles.footerSubtext}>Développé avec ❤️ pour vous simplifier la vie</Text>
        </View>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileText: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  userStatus: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 2,
  },
  profileButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  profileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  settingsGroup: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    opacity: 0.9,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 12,
  },
  navigateButton: {
    padding: 4,
  },
  navigateText: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  statsCard: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  dangerZone: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    opacity: 0.9,
  },
  dangerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dangerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 4,
    textAlign: 'center',
  },
});