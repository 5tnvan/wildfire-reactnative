import { Redirect } from 'expo-router';
import React from 'react';

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
