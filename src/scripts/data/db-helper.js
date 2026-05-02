import { openDB } from 'idb';
import CONFIG from '../config';

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = CONFIG;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    db.createObjectStore('pending-stories', { keyPath: 'id', autoIncrement: true });
  },
});

const DbHelper = {
  async getStory(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async putStory(story) {
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },
  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
  async putPendingStory(story) {
    return (await dbPromise).put('pending-stories', story);
  },
  async getAllPendingStories() {
    return (await dbPromise).getAll('pending-stories');
  },
  async deletePendingStory(id) {
    return (await dbPromise).delete('pending-stories', id);
  },
};

export default DbHelper;
