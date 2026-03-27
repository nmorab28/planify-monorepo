import React from 'react';
import PageTitle from '../../layouts/PageTitle';
import {StaffProfile} from '../staff/ProfileStaff';

const ProfileProfessor = () => {
    return (
        <>
            <PageTitle activeMenu={"Professor Profile"} motherMenu={"Professors"}/>   
            <StaffProfile />
        </>
    );
};

export default ProfileProfessor;