import { Redirect } from 'expo-router';
import React from 'react';

const IndexPage = () => {
    return (
        <Redirect href={"/(tabs)"} />
    );
}

export default IndexPage;
