import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

/** 
 * ROOT INDEX
 * Entry Point to the app
 * **/
const IndexPage = () => {
    return (
        <Redirect href={"/(auth)"} />
    ); 
}
export default IndexPage;
