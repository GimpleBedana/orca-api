import { hashSpawnCode } from '../utils/otpUtils.js';
import { KeyModel } from '../models/key.js';
import { TopicModel } from '../models/topic.js';

export class KeyController {
  
  constructor() {
    this.keyModel = new KeyModel();
    this.topicModel = new TopicModel();
  }

  async getArrangementByKey(req, res) {
    const { key } = req.query;
    try {
      if (!key) {
        return res.status(400).json({ error: 'Key parameter is required' });
      }
      const hashedKey = await hashSpawnCode(key);

      const gameArrangement = await this.keyModel.getGameArrangement(hashedKey);
      if (!gameArrangement) {
        return res.status(404).json({ error: 'Invalid or expired key' });
      }

      if (!Array.isArray(gameArrangement)) {
        return res.status(500).json({ error: 'Invalid arrangement format from key data' });
      }

      const topics = await this.topicModel.getTopics();
      if (!Array.isArray(topics) || topics.length === 0) {
        return res.status(404).json({ error: 'No topics available'});
      }

      const topicMap = new Map(topics.map(topic => [Number(topic.game_index), topic]));
      const arrangedTopics = (gameArrangement || []).map(index => topicMap .get(Number(index))) .filter(Boolean);

      res.status(200).json({
        success: true,
        message: 'Topics retrieved successfully.',
        total: arrangedTopics.length,
        data: arrangedTopics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveArrangement(req, res) {
    const { user_id, spawn_code, game_arrangement } = req.body;
    try {
      if (user_id == null || !spawn_code || !Array.isArray(game_arrangement)) {
        return res.status(400).json({ error: 'user_id, spawn_code, and game_arrangement are required'});
      }
      const hashedCode = await hashSpawnCode(spawn_code);

      const data = await this.keyModel.saveGameArrangement(user_id, hashedCode, game_arrangement);

      res.status(201).json({message: 'Arrangement saved successfully', data});
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}