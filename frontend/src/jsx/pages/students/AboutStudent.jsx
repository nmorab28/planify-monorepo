import React from 'react';
import PageTitle from '../../layouts/PageTitle';
import { StaffProfile } from '../staff/ProfileStaff';

const AboutStudent = () => {
    return (
        <>
            <PageTitle activeMenu={"About Student"} motherMenu={"Students"}/>
            <StaffProfile />
        </>
    );
};

export default AboutStudent;