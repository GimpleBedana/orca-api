import supabase from '../services/supabaseClient.js';

export class KeyModel {
    async getGameArrangement(hashedKey) {
        try {
            const { data, error } = await supabase .from('key') .select('game_arrangement') .eq('spawn_code', hashedKey) .maybeSingle();
            if (error) throw error;
            return data?.game_arrangement || null;
        } catch (error) {
            throw error;
        }
    }

    async saveGameArrangement(user_id, hashedCode, game_arrangement) {
        try{
            const { data, error } = await supabase .from('key') .insert({ user_id, spawn_code: hashedCode, game_arrangement }) .select();
            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }
}