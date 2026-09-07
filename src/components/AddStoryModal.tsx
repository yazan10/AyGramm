import React from 'react';
import { AyGramStudioModal } from './AyGramStudioModal';

interface AddStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStoryModal: React.FC<AddStoryModalProps> = ({ isOpen, onClose }) => {
  return <AyGramStudioModal isOpen={isOpen} onClose={onClose} target="story" />;
};
