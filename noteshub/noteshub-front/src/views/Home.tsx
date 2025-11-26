import React from 'react';
import useUserStore from '../store/userStore';
import { Navigate } from 'react-router-dom';

const Home = () => {
    const { isLogged } = useUserStore();

    if (!isLogged) {
        return <Navigate to="/login" replace/>;
    }

    return <Navigate to="/notes" replace/>;
};

export default Home;
