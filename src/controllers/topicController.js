import { TopicModel } from '../models/topic.js';

export class TopicController {
  
  constructor() {
    this.topicModel = new TopicModel();
  }

  async getTopics(req, res) {
    try {
      const topics = await this.topicModel.getTopics();
      res.status(200).json(topics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createTopic(req, res) {
    const { game_id, game_name, game_index } = req.body;
    try {
      const insertTopic = await this.topicModel.createTopic({ game_id, game_name, game_index });
      res.status(201).json(insertTopic);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async reArrangeTopics(req, res) {
    const { newOrder } = req.body;
    try{
      //Validate Input Type
      if (!Array.isArray(newOrder) || newOrder.length === 0) {
        return res.status(400).json({ error: 'newOrder must be a non-empty array'});
      }
      // Validate Structure
      for (const item of newOrder) {
        if(item.id == null || typeof item.game_index !== 'number') {
          return res.status(400).json({error: 'Each item must have id and game_index (number) properties'});
        }
      }
      //Call Model to Update Order
      const updatedNewOrder = await this.topicModel.updateTopicOrder(newOrder);
      res.status(200).json(updatedNewOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateCode(req, res) {
    try {
      const format = (req.query.format || 'javascript').toLowerCase();
      if (!['javascript', 'json'].includes(format)) {
        return res.status(400).json({error: 'Query "format" must be "javascript" or "json"'});
      }

      const topics = await this.topicModel.getTopics();

      if (!Array.isArray(topics)) {
        return res.status(500).json({ error: 'Failed to retrieve topics' });
      }

      //ESCAPED QUOTE
      const escapeStr = (str = '') => {
        String(str)
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n');
      };

      //For clean + safe
      const jsonOutPut = JSON.stringify(topics, null, 2);
      
      //For valid JS array
      const jsOutPut = `[${topics.map(topic => `{ game_id: ${topic.game_id}, game_name: "${escapeStr(topic.game_name)}", game_index: ${topic.game_index} }`).join(',\n')}]`;

      const generatedCode = format === 'json' ? jsonOutPut : jsOutPut;

      res.status(200).json({generatedCode,count: topics.length, format});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}