import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  RefreshControl,
  Image,
  ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Post, getAllPosts } from '../db/news';
import Navbar from '../components/navbar';
import { useTheme } from './theme';

//Post object 
interface Post {
  id: number | string;
  title?: string;
  description?: string;
  url?: string;
  source?: string;
  image?: string;
  category?: string;
  language?: string;
  country?: string;
  published_at?: string;
}


// Filter options
const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'General', value: 'general' },
  { label: 'Business', value: 'business' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Health', value: 'health' },
  { label: 'Science', value: 'science' },
  { label: 'Sports', value: 'sports' },
  { label: 'Technology', value: 'technology' }
];

const COUNTRIES = [
  { label: 'All', value: '' },
  { label: 'US', value: 'us' },
  { label: 'UK', value: 'gb' },
  { label: 'Canada', value: 'ca' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' }
];

const SOURCES = [
  { label: 'All', value: '' },
  { label: 'CNN', value: 'cnn' },
  { label: 'BBC', value: 'bbc' },
  { label: 'Reuters', value: 'reuters' },
  { label: 'AP News', value: 'associated press' },
  { label: 'The Guardian', value: 'theguardian' }
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  //API configuration
  const API_KEY = 'a3f1d612fd9cd7052f65bb7a97cad24b';
  const API_BASE_URL = 'http://api.mediastack.com/v1';

  const fetchPosts = async (): Promise<void> => {
    try {
      setError(null);
  
      const params = new URLSearchParams({
        access_key: API_KEY,
        limit: '15',
        languages: 'en'
      });
  
      if (selectedCategory) {
        params.append('categories', selectedCategory);
      }
      if (selectedCountry) {
        params.append('countries', selectedCountry);
      }
      if (selectedSource) {
        params.append('sources', selectedSource);
      }
      
      const requestUrl = `${API_BASE_URL}/news?${params.toString()}`;
      
      const response = await fetch(requestUrl, {
        method: 'GET',
      });
            
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error body:', errorText);
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      const articles = data.data || [];
      console.log('articles received:', articles.length);
      
      // limit to 15 posts 
      const limitedPosts: Post[] = articles.slice(0, 15).map((article: any, index: number) => ({
        id: article.url || index,
        title: article.title,
        description: article.description,
        image: article.image,
        source: article.source,
        url: article.url,
        category: article.category,
        country: article.country,
        published_at: article.published_at
      }));
      
      setPosts(limitedPosts);
      
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedCountry, selectedSource]);

  const onRefresh = (): void => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleNavPress = (section: string): void => {
    console.log(`${section} pressed`);
    if (section === 'Logout') {
      router.push('/');
    }
  };

  const handlePostPress = (postId: number | string): void => {
    console.log(`Post ${postId} pressed`);
  };

  const clearAllFilters = (): void => {
    setSelectedCategory('');
    setSelectedCountry('');
    setSelectedSource('');
  };
  
  const renderFilterButton = (
    items: Array<{label: string, value: string}>,
    selectedValue: string,
    onSelect: (value: string) => void,
    title: string
  ) => (
    <View style={styles.filterGroup}>
      <Text style={styles.filterGroupTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.filterChip,
              selectedValue === item.value && styles.filterChipSelected
            ]}
            onPress={() => onSelect(item.value)}
          >
            <Text style={[
              styles.filterChipText,
              selectedValue === item.value && styles.filterChipTextSelected
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  
  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filtersHeader}>
        <Text style={styles.filtersTitle}>Filters</Text>
        <View style={styles.filtersActions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {renderFilterButton(CATEGORIES, selectedCategory, setSelectedCategory, 'Category')}
      {renderFilterButton(COUNTRIES, selectedCountry, setSelectedCountry, 'Country')}
      {renderFilterButton(SOURCES, selectedSource, setSelectedSource, 'Source')}
    </View>
  );
  
  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedCountry) count++;
    if (selectedSource) count++;
    return count;
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={[styles.postBlock, { backgroundColor: theme.card }]}
      onPress={() => handlePostPress(item.id)}
    >
      <Image 
        source={{ 
          uri: item.image || 'https://via.placeholder.com/300x200?text=No+Image'
        }}
        style={styles.postImage}
        resizeMode="cover"
      />
      <View style={styles.postContent}>
        <Text style={[styles.postTitle, { color: theme.text }]} numberOfLines={2}>
          {item.title || 'Untitled Article'}
        </Text>
        <View style={styles.postFooter}>
          {item.source && (
            <Text style={[styles.postSource, { color: theme.textSecondary }]}>
              {item.source}
            </Text>
          )}
          {item.category && (
            <Text style={styles.postCategory}>
              {item.category.toUpperCase()}
          {item.publishTime && (
            <Text style={[styles.postDate, { color: theme.accent }]}>
              {new Date(item.publishTime).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading posts...</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text style={[styles.errorText, { color: theme.error }]}>Error: {error}</Text>
      <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={fetchPosts}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No posts available</Text>
      <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={fetchPosts}>
        <Text style={styles.retryButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const dynamicStyles = StyleSheet.create ({
    container: {
      ...styles.container,
      backgroundColor: theme.background,
    },
    statusBarSpacer: {
      ...styles.statusBarSpacer,
      backgroundColor: theme.border,
    },
    debugContainer: {
      ...styles.debugContainer,
      backgroundColor: theme.surface,
      borderBottomColor: theme.border,
    },
  });

  return (
<!--     <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.statusBarSpacer} /> -->
      
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => handleNavPress('Home')}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/account')}>
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/')}>
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
      </View>
    <View style={dynamicStyles.container}>
      <StatusBar style="light" />
      <View style={dynamicStyles.statusBarSpacer} />

      <View style={styles.filterToggleContainer}>
        <TouchableOpacity style={styles.filterToggleButton}onPress={() => setShowFilters(!showFilters)}>
          <Text style={styles.filterToggleText}>
          Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Text>
        </TouchableOpacity>
      </View>
{showFilters && renderFilters()}

      {__DEV__ && (
        <View style={dynamicStyles.debugContainer}>
          <TouchableOpacity style={[styles.debugButton, { backgroundColor: theme.primary }]} onPress={fetchPosts}>
            <Text style={styles.debugButtonText}> Test API Call</Text>

          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={[
            styles.postsContainer,
            posts.length === 0 && styles.flex1
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary}/>
          }
          ListEmptyComponent={renderEmpty}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

// colors, sizes, spacing, and layout for the home UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  statusBarSpacer: {
    height: 2, 
    backgroundColor: 'lightgray',
  },
  postsContainer: {
    padding: 16,
  },
  flex1: {
    flex: 1,
  },
  postBlock: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: 'lightgray',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    lineHeight: 24,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postSource: {
    fontSize: 12,
    color: 'gray',
    fontStyle: 'italic',
    flex: 1,
  },
  postDate: {
    fontSize: 11,
    color: 'lightblue',
    fontWeight: '500',
  },
  separator: {
    height: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'darkgray',
  },
  navButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: 'darkgray',
    fontWeight: '500',
  },
  debugContainer: {
    backgroundColor: 'lightyellow',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'yellow',
  },
  debugButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'center',
  },
  debugButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  // Filter Styling
  filterToggleContainer: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterToggleButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  filterToggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  filtersContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 16,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  filtersActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 12,
    color: 'gray',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'gray',
  },
  filterGroup: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipSelected: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  filterChipText: {
    fontSize: 12,
    color: 'black',
  },
  filterChipTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  postCategory: {
    fontSize: 10,
    color: 'blue',
    fontWeight: 'bold',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});