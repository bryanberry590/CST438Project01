import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Post, getAllPosts } from '../db/news';
import Navbar from '../components/navbar';



export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (): Promise<void> => {
    try {
      setError(null);

      const articles: Post[] = await getAllPosts();
      
      console.log('Number of articles received:', articles.length);
      
      //limited to 5 posts for now
      const limitedPosts: Post[] = articles.slice(0, 5);
      
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
  }, []);

  const onRefresh = (): void => {
    setRefreshing(true);
    fetchPosts();
  };

  // const handleNavPress = (section: string): void => {
  //   console.log(`${section} pressed`);
  //   if (section === 'Logout') {
  //     router.push('/');
  //   }
  // };

  const handlePostPress = (postId: number): void => {
    console.log(`Post ${postId} pressed`);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.postBlock}
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
        <Text style={styles.postTitle} numberOfLines={2}>
          {item.title || 'Untitled Article'}
        </Text>
        <View style={styles.postFooter}>
          {item.source && (
            <Text style={styles.postSource}>
              {item.source}
            </Text>
          )}
          {item.publishTime && (
            <Text style={styles.postDate}>
              {new Date(item.publishTime).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="blue" />
      <Text style={styles.loadingText}>Loading posts...</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>Error: {error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyText}>No posts available</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
        <Text style={styles.retryButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.statusBarSpacer} />

      <Navbar activeTab="home" />

      {__DEV__ && (
        <View style={styles.debugContainer}>
          <TouchableOpacity style={styles.debugButton} onPress={fetchPosts}>
            <Text style={styles.debugButtonText}>🔄 Test API Call</Text>
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  // navbar: {
  //   flexDirection: 'row',
  //   backgroundColor: 'lightgray',
  //   paddingVertical: 10,
  //   paddingHorizontal: 5,
  //   borderBottomWidth: 1,
  //   borderBottomColor: 'darkgray',
  // },
  // navButton: {
  //   flex: 1,
  //   paddingVertical: 8,
  //   paddingHorizontal: 4,
  //   alignItems: 'center',
  // },
  // navText: {
  //   fontSize: 12,
  //   color: 'darkgray',
  //   fontWeight: '500',
  // },
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
});