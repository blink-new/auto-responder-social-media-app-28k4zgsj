import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { XCircle, PlusCircle } from 'lucide-react-native';

interface ExclusionModalProps {
  visible: boolean;
  onClose: () => void;
  platformName: string;
  excludedContacts: string[];
  onAddContact: (contact: string) => void;
  onRemoveContact: (contact: string) => void;
}

export function ExclusionModal({
  visible,
  onClose,
  platformName,
  excludedContacts,
  onAddContact,
  onRemoveContact,
}: ExclusionModalProps) {
  const [newContact, setNewContact] = React.useState('');

  const handleAddContact = () => {
    if (newContact.trim()) {
      onAddContact(newContact.trim());
      setNewContact('');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Exclusions {platformName}</Text>
            <TouchableOpacity onPress={onClose}>
              <XCircle size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.addInputContainer}>
            <TextInput
              style={styles.addInput}
              placeholder="Nom du contact à exclure"
              value={newContact}
              onChangeText={setNewContact}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
              <PlusCircle size={24} color="#10B981" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={excludedContacts}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.contactItem}>
                <Text style={styles.contactName}>{item}</Text>
                <TouchableOpacity onPress={() => onRemoveContact(item)}>
                  <Text style={styles.removeButton}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyListText}>Aucune exclusion configurée pour l'instant.</Text>
            )}
            style={styles.contactList}
          />

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    marginRight: 10,
  },
  addButton: {
    padding: 8,
  },
  contactList: {
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    width: '100%',
  },
  contactName: {
    fontSize: 16,
    color: '#374151',
  },
  removeButton: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#6B7280',
  },
});