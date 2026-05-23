import supabase from '../services/supabaseClient.js';


export class TopicModel {
    async getTopics() {
        try {
            const { data, error } = await supabase .from('topics') .select('*') .order('game_index', { ascending: true });
            if (error) throw error;
            return  data || [];
        } catch (error) {
            throw error;
        }
    }
    async createTopic(topicData) {
        try {
            const { data, error } = await supabase .from('topics') .insert([topicData]) .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            throw error;
        }
    }

    async updateTopicOrder(newOrder){
        try {
            const updates = newOrder.map(item => supabase .from('topics') .update({ game_index: item.game_index }) .eq('id', item.id) .select());
            const results = await Promise.all(updates);
            const errorResult = results.find(result => result?.error);

            if(errorResult) {
                throw new Error(errorResult.error.message)
            };
            return results.map(result => result.data?.[0]) .filter(Boolean);
        } catch (error) {
            throw error;
        }
    }
}