'use client';

const calculateAvgRating = (reviews) => {
   const list = Array.isArray(reviews) ? reviews : [];
   const totalRating = list.reduce((acc, item) => acc + Number(item?.rating || 0), 0);
   const avgRating = list.length ? Number((totalRating / list.length).toFixed(1)) : 0;

   return {
      totalRating,
      avgRating,
   };
};

export default calculateAvgRating;
