import supabase from "../services/supabaseClient.js";

export class AccountModel{
    
    async createAccount(accountData){
        try{
            const {data, error} = await supabase .from('accounts') .insert([accountData]) .select();
            if(error){
                throw error;
            }

            return {success: true, data};
        }catch(error){
            console.error("Error creating account:", error);
            return {success: false, error: error.message};
        }
    }

    async findByEmail(email){
        try{
            const {data, error} = await supabase .from('accounts') .select('*') .eq('email', email) .single();
            if(error){
                if(error.code === 'PGRST116'){
                    return {success: false, error: 'Account not found'};
                }
                return {success: false, error: error.message};
            }

            return {success: true, data};
        }catch(error){
            return {success: false, error: error.message};
        }
    }

    async verifyEmail(id) {
        try{
            const {data, error} = await supabase .from('accounts') .update({ email_verified: true, otp_code: null, otp_expires_at: null }) .eq('id', id) .select() .single();
            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
    }

    async updateOTP(id, hashedOTP, newOTPExpiresAt) {
        try{
            const { data: error} = await supabase .from('accounts') .update({ otp_code: hashedOTP, otp_expires_at: newOTPExpiresAt}) .eq('id', id);
            if (error) {
                return { success: false, error: error.message };
            }
            return { success: true, data: null };
        }catch(error){
            return { success: false, error: error.message };
        }
    }

    async findUserById(id){
        try{
            const {data, error} = await supabase .from('accounts') .select('username') .eq('id', id) .single();

            if (error){
                throw error;
            }
            return {success: true, data};
        }catch(error){
            return {success: false, error: error.message};
        }
    }

    async createAccountGoogle(accountData){
        const { email, google_id } = accountData;
        try{
            const {data, error} = await supabase .from('accounts') .insert({ email, provider_id: google_id, auth_provider: 'GOOGLE', password: null, email_verified: true }) .select() .single();
            if(error){
                throw error;
            }
            return {success: true, data};
        }catch(error){
            return {success: false, error: error.message};
        }
    }

    async updateGoogleInfo(id, google_id, auth_provider){
        try{
            const {data, error} = await supabase .from('accounts') .update({ provider_id: google_id, auth_provider: auth_provider }) .eq('id', id) .select() .single();
            if(error){
                throw error;
            }
            return {success: true, data};
        }catch(error){
            return {success: false, error: error.message};
        }
    }
}