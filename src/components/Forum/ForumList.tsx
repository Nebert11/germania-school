import React, { useState } from 'react';
import { MessageSquare, User, Clock, ArrowUp, ArrowDown, Plus, Search, Filter } from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  createdAt: string;
  replies: number;
  votes: number;
  category: string;
}

const ForumList: React.FC = () => {
  const [posts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'How to pronounce "ü" correctly?',
      content: 'I\'m struggling with the pronunciation of the German umlaut "ü". Can someone help me understand the correct way to pronounce it?',
      author: 'Anna Mueller',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      createdAt: '2 hours ago',
      replies: 8,
      votes: 12,
      category: 'Pronunciation'
    },
    {
      id: '2',
      title: 'Best resources for German grammar?',
      content: 'I\'m looking for recommendations for German grammar books or online resources. What has worked best for you?',
      author: 'Michael Weber',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      createdAt: '5 hours ago',
      replies: 15,
      votes: 24,
      category: 'Grammar'
    },
    {
      id: '3',
      title: 'Difference between "der", "die", and "das"',
      content: 'I\'m confused about when to use der, die, and das. Is there a pattern or do I just need to memorize them?',
      author: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      createdAt: '1 day ago',
      replies: 22,
      votes: 35,
      category: 'Grammar'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Grammar', 'Pronunciation', 'Vocabulary', 'Culture', 'General'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white dark:bg-gray-900 dark:text-gray-100 rounded shadow border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Forum</h2>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search forum..."
          className="border rounded px-3 py-2 w-full md:w-64 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="space-y-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center mb-2">
              <img src={post.avatar} alt={post.author} className="h-10 w-10 rounded-full object-cover mr-3" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">By {post.author} &bull; {post.createdAt}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-200 mb-2">{post.content}</p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="mr-4">Replies: {post.replies}</span>
              <span>Votes: {post.votes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumList;