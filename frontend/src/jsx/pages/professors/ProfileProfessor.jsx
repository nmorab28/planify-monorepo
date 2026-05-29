import React from 'react';
import PageTitle from '../../layouts/PageTitle';
import { StaffProfile } from '../staff/ProfileStaff';

const ProfileDocente = () => {
  return (
    <>
      <PageTitle activeMenu={'Docente Profile'} motherMenu={'Docentes'} />
      <StaffProfile />
    </>
  );
};

export default ProfileDocente;
