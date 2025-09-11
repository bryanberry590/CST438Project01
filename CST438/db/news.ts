import { useEffect } from "react";
import { db } from './database';

//this interface is for what the API returns
export interface NewsArticle {
    author: string;
    title: string;
    description: string;
    url: string;
    source: string;
    image?: string;
    category?: string;
    language?: string;
    country?: string;
    published_at: string;
  }

  //this interface is for posts within the database
  export interface Post {
    id: number;
    author: string;
    title: string;
    description: string;
    url: string;
    source: string;
    image: string | null;
    category: string | null;
    language: string | null;
    country: string | null;
    publishTime: string;
  }

  // const BACKEND_URL = "http://localhost:3001"; // change when deployed
  // const BACKEND_URL = "http:192.168.0.13:8081";

  //this backend url works for android emulator
  const BACKEND_URL = "http://10.0.2.2:3001";

  export async function syncNewsToLocalDB() {
    try {
      // fetch news from backend server
      const response = await fetch(`${BACKEND_URL}/api/news`);

      if (!response.ok) {
        throw new Error(`Failed to read from backend: ${response.status}`);
      }

      const posts: Post[] = await response.json();
  
      // Insert or update posts into local DB
      for (const post of posts) {
        await db.runAsync(
          `INSERT OR REPLACE INTO news 
            (id, author, title, description, url, source, image, category, language, country, publishTime)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            post.id,
            post.author,
            post.title,
            post.description,
            post.url,
            post.source,
            post.image,
            post.category,
            post.language,
            post.country,
            post.publishTime
          ]
        );
      }
  
      console.log('Frontend news table updated with latest backend data');
    } catch (error) {
      console.error('Error syncing news to local DB:', error);
    }
  }


export function useNewsSync(intervalMinutes: number = 5) {
  useEffect(() => {

    // Run once immediately on mount
    syncNewsToLocalDB();

    // Set up interval to sync every intervalMinutes
    const interval = setInterval(() => {
      syncNewsToLocalDB();
    }, intervalMinutes * 60 * 1000); // convert minutes to milliseconds

    return () => clearInterval(interval);
  }, [intervalMinutes]);
}


  export async function getAllPosts() : Promise<Post[]>{
    try{
        const posts = await db.getAllAsync(`SELECT * FROM news ORDER BY publishTime DESC`) as Post[];

        return posts;
    } catch(error) {
        console.error('Error getting all posts', error);
        throw error;
    }
  }

  export async function getPostById(id: number) : Promise<Post | null>{
    try {
      const post = await db.getFirstAsync(`SELECT * FROM news WHERE id = ?`, [id] ) as Post;

      return post;
    } catch (error) {
      console.error('Error getting post by ID', error);
      throw error;
    }
  }


//function for getPostsByCategory, getPostBySource, searchPosts, deletePost, syncNews (calls fetchNewsFromApi; stores in array of NewsArticle, calls insertPost on each NewsArticle fetched)

export async function insertPost(article: NewsArticle): Promise<boolean> {
    try {
      await db.runAsync(
        `INSERT OR IGNORE INTO news (author, title, description, url, source, image, category, language, country, publishTime) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.author || 'Unknown',
          article.title || '',
          article.description || '',
          article.url || '',
          article.source || '',
          article.image || null,
          article.category || null,
          article.language || null,
          article.country || null,
          article.published_at || new Date().toISOString()
        ]
      );
      return true;
    } catch (error) {
      console.error('Error inserting post:', error);
      return false;
    }
  }
