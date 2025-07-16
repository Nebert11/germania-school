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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Discussion Forum</h1>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              {/* Vote Section */}
              <div className="flex flex-col items-center space-y-1">
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                  <ArrowUp className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium text-gray-900">{post.votes}</span>
                <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <ArrowDown className="h-5 w-5" />
                </button>
              </div>

              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">{post.createdAt}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                  {post.title}
                </h3>
                
                <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.replies} replies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <nav className="flex space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ForumList;