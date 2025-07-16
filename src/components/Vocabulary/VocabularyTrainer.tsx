import React, { useState, useEffect } from 'react';
import { vocabularyApi } from '../../services/api';
import { VocabularyWord } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Brain, Volume2, RotateCcw, CheckCircle, XCircle, Plus } from 'lucide-react';

const VocabularyTrainer: React.FC = () => {
  const { user } = useAuth();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentWord, setCurrentWord] = useState<VocabularyWord | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'review' | 'new'>('review');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const vocabulary = await vocabularyApi.getVocabulary(user?.id || '');
        setWords(vocabulary);
        selectRandomWord(vocabulary);
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, [user?.id]);

  const selectRandomWord = (wordList: VocabularyWord[] = words) => {
    if (wordList.length > 0) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      setCurrentWord(wordList[randomIndex]);
      setShowAnswer(false);
    }
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentWord) return;

    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    };
    setScore(newScore);

    // Update mastery level
    const newMasteryLevel = isCorrect 
      ? Math.min(currentWord.masteryLevel + 1, 5)
      : Math.max(currentWord.masteryLevel - 1, 1);

    try {
      await vocabularyApi.updateMastery(currentWord.id, newMasteryLevel);
    } catch (error) {
      console.error('Error updating mastery:', error);
    }

    // Move to next word after a brief delay
    setTimeout(() => {
      selectRandomWord();
    }, 1000);
  };

  const playPronunciation = () => {
    if (currentWord) {
      // In a real app, this would use text-to-speech API
      console.log('Playing pronunciation:', currentWord.pronunciation);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded shadow border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Vocabulary Trainer</h2>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vocabulary Trainer</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setPracticeMode('review')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              practiceMode === 'review' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Review
          </button>
          <button
            onClick={() => setPracticeMode('new')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              practiceMode === 'new' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            New Words
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Total Words</p>
              <p className="text-xl font-bold text-gray-900">{words.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Mastered</p>
              <p className="text-xl font-bold text-gray-900">{words.filter(w => w.masteryLevel >= 4).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <RotateCcw className="h-6 w-6 text-orange-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Reviewing</p>
              <p className="text-xl font-bold text-gray-900">{words.filter(w => w.masteryLevel < 4).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-purple-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Session Score</p>
              <p className="text-xl font-bold text-gray-900">{score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Card */}
      {currentWord && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {currentWord.category}
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{currentWord.word}</h2>
              <button
                onClick={playPronunciation}
                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                {currentWord.pronunciation}
              </button>
            </div>

            {showAnswer ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xl font-semibold text-gray-900 mb-2">{currentWord.translation}</p>
                  <p className="text-gray-600 italic">"{currentWord.example}"</p>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Hard
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Easy
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">What does this word mean?</p>
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Show Answer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Word List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Vocabulary</h2>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Word
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {words.map((word) => (
              <div key={word.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{word.word}</h3>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full mr-1 ${
                          i < word.masteryLevel ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{word.translation}</p>
                <p className="text-gray-500 text-xs italic">"{word.example}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyTrainer;