import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Edit3, Trash2, MessageSquare, Clock, Zap, Instagram, Video } from 'lucide-react-native';
import { useState } from 'react';

const PLATFORMS = [
  { id: 'snapchat', name: 'Snapchat', icon: MessageSquare, color: '#FFFC00' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: '#000000' },
];

export default function Responses() {
  const [responses, setResponses] = useState([
    {
      id: 1,
      trigger: 'salut',
      message: 'Salut ! Je te réponds dès que possible 😊',
      apps: ['instagram', 'tiktok'],
      delay: '2-5 min'
    },
    {
      id: 2,
      trigger: 'comment tu vas',
      message: 'Ça va super bien, merci ! Et toi ? 🙂',
      apps: ['instagram'],
      delay: '1-3 min'
    },
    {
      id: 3,
      trigger: 'rdv',
      message: 'Je regarde mon agenda et je te dis ça ! 📅',
      apps: ['instagram', 'snapchat'],
      delay: '5-10 min'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newResponse, setNewResponse] = useState({
    trigger: '',
    message: '',
    delay: '2-5 min',
    selectedApps: [] as string[],
  });

  const toggleAppSelection = (appId: string) => {
    setNewResponse(prev => ({
      ...prev,
      selectedApps: prev.selectedApps.includes(appId)
        ? prev.selectedApps.filter(id => id !== appId)
        : [...prev.selectedApps, appId],
    }));
  };

  const addResponse = () => {
    if (newResponse.trigger && newResponse.message && newResponse.selectedApps.length > 0) {
      setResponses([...responses, {
        id: Date.now(),
        trigger: newResponse.trigger,
        message: newResponse.message,
        delay: newResponse.delay,
        apps: newResponse.selectedApps,
      }]);
      setNewResponse({ trigger: '', message: '', delay: '2-5 min', selectedApps: [] });
      setShowAddForm(false);
    }
  };

  const deleteResponse = (id: number) => {
    setResponses(responses.filter(r => r.id !== id));
  };

  return (
    <LinearGradient
      colors={['#10B981', '#059669']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={styles.header}
          entering={FadeInDown.duration(400)}
        >
          <Text style={styles.title}>Auto-Réponses</Text>
          <Text style={styles.subtitle}>Configurez vos messages automatiques</Text>
        </Animated.View>

        <Animated.View
          style={styles.statsRow}
          entering={FadeInDown.duration(400).delay(100)}
        >
          <View style={styles.statItem}>
            <MessageSquare size={20} color="#FFFFFF" />
            <Text style={styles.statValue}>{responses.length}</Text>
            <Text style={styles.statLabel}>Réponses</Text>
          </View>
          <View style={styles.statItem}>
            <Zap size={20} color="#FFFFFF" />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Envoyées</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={20} color="#FFFFFF" />
            <Text style={styles.statValue}>95%</Text>
            <Text style={styles.statLabel}>Succès</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={styles.addContainer}
          entering={FadeInDown.duration(400).delay(200)}
        >
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={24} color="#10B981" />
            <Text style={styles.addButtonText}>Nouvelle réponse</Text>
          </TouchableOpacity>
        </Animated.View>

        {showAddForm && (
          <Animated.View
            style={styles.addForm}
            entering={FadeInDown.duration(300)}
          >
            <Text style={styles.formTitle}>Créer une auto-réponse</Text>
            <TextInput
              style={styles.input}
              placeholder="Mot-clé déclencheur (ex: salut, rdv)"
              value={newResponse.trigger}
              onChangeText={(text) => setNewResponse({ ...newResponse, trigger: text })}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Message de réponse"
              value={newResponse.message}
              onChangeText={(text) => setNewResponse({ ...newResponse, message: text })}
              multiline
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.platformSelectorTitle}>Activer sur :</Text>
            <View style={styles.platformSelectorContainer}>
              {PLATFORMS.map(platform => (
                <TouchableOpacity
                  key={platform.id}
                  style={[
                    styles.platformButton,
                    newResponse.selectedApps.includes(platform.id) && styles.platformButtonSelected,
                  ]}
                  onPress={() => toggleAppSelection(platform.id)}
                >
                  <platform.icon
                    size={20}
                    color={newResponse.selectedApps.includes(platform.id) ? '#FFFFFF' : platform.color}
                  />
                  <Text
                    style={[
                      styles.platformButtonText,
                      newResponse.selectedApps.includes(platform.id) && styles.platformButtonTextSelected,
                    ]}
                  >
                    {platform.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={addResponse}
              >
                <Text style={styles.saveButtonText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        <Animated.View
          style={styles.responsesContainer}
          entering={FadeInDown.duration(400).delay(300)}
        >
          <Text style={styles.sectionTitle}>Vos réponses actives</Text>
          {responses.map((response, index) => {
            const activePlatforms = PLATFORMS.filter(p => response.apps.includes(p.id));
            return (
              <Animated.View
                key={response.id}
                style={styles.responseCard}
                entering={FadeInRight.duration(400).delay(400 + index * 100)}
              >
                <View style={styles.responseHeader}>
                  <View style={styles.triggerContainer}>
                    <Text style={styles.triggerText}>"{response.trigger}"</Text>
                    <View style={styles.delayBadge}>
                      <Clock size={12} color="#6B7280" />
                      <Text style={styles.delayText}>{response.delay}</Text>
                    </View>
                  </View>
                  <View style={styles.responseActions}>
                    <TouchableOpacity style={styles.editButton}>
                      <Edit3 size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteResponse(response.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.responseMessage}>{response.message}</Text>

                <View style={styles.appsContainer}>
                  {activePlatforms.map((platform, appIndex) => {
                    const PlatformIcon = platform.icon;
                    return (
                      <View
                        key={appIndex}
                        style={[styles.appBadge, { backgroundColor: `${platform.color}20` }]}
                      >
                        <PlatformIcon size={16} color={platform.color} />
                      </View>
                    );
                  })}
                </View>
              </Animated.View>
            );
          })}
        </Animated.View>

        <Animated.View
          style={styles.tipsCard}
          entering={FadeInDown.duration(400).delay(600)}
        >
          <Text style={styles.tipsTitle}>💡 Conseils</Text>
          <Text style={styles.tipsText}>
            • Utilisez des mots-clés courts et fréquents{'\n'}
            • Personnalisez vos réponses pour chaque plateforme{'\n'}
            • Variez les délais pour paraître plus naturel{'\n'}
            • Testez vos réponses avant de les activer
          </Text>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  addContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  addForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#10B981',
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  responsesContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  responseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  triggerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginRight: 8,
  },
  delayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  delayText: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 2,
  },
  responseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  responseMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  appsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  appBadge: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
    marginLeft: 4,
  },
  platformSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  platformSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  platformButtonSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  platformButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  platformButtonTextSelected: {
    color: '#FFFFFF',
  },
  tipsCard: {
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
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});