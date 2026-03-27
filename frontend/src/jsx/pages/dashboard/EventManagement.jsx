import React from 'react';
import PageTitle from '../../layouts/PageTitle';
import CalendarBlog from '../holidays/CalendarBlog';

const EventManagement = () => {
    return (
        <>
            <PageTitle activeMenu={"Events"} motherMenu={"Events Management"}/>
            <CalendarBlog />
        </>
    );
};

export default EventManagement;