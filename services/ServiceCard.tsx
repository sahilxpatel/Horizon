'use client';

import React from 'react'

const ServiceCard = ({item}) => {

  const {imgUrl ,title ,desc } =item

  return  ( 
  <div className='service__item'>
    <div className='service__img'>
        <img src={typeof imgUrl === 'string' ? imgUrl : imgUrl?.src} alt="" />
     </div>  
     <h5>{title}</h5>
     <p>{desc}</p>

    </div>  
  );
};


export default ServiceCard

