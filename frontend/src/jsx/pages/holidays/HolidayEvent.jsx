import React from "react";


import PageTitle from '../../layouts/PageTitle';
import CalendarBlog from "./CalendarBlog";

const HolidayEvent = () => {
      return (
         <>
            <PageTitle activeMenu={"Holiday Calendar"} motherMenu={"Holiday"} />
            <CalendarBlog />
         </>
      );
    
};

export default HolidayEvent;
