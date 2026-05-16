'use client';

import React,{useRef} from 'react'
import {Col, Form, FormGroup} from "reactstrap";
import { BASE_URL } from '../utils/config.js';
import { useRouter } from 'next/navigation';



const SearchBar = () => {

   const locationRef = useRef<HTMLInputElement>(null);
   const distanceRef = useRef<HTMLInputElement>(null);
   const maxGroupSizeRef = useRef<HTMLInputElement>(null);
   const router = useRouter();


   const searchHandler = async() => {
    const location = locationRef.current?.value
    const distance = distanceRef.current?.value
    const maxGroupSize = maxGroupSizeRef.current?.value

    if(!location || !distance || !maxGroupSize){
      return alert("All fields are required!");
    }

    router.push(`/tours/search?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`);
   };

  return <Col lg='12'> 
    <div className="search__bar">
      <Form className="d-flex align-items-center gap-4">
         <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
                <i className="ri-map-pin-line"></i>
            </span>
            <div>
              <h6>Location</h6>
              <input type="text" placeholder="Where are you Going?" ref={locationRef} />
            </div>
         </FormGroup>
         <FormGroup className="d-flex gap-3 form__group form__group-last">
            <span>
                <i className="ri-map-pin-time-line"></i>
            </span>
            <div>
              <h6>Distance</h6>
              <input type="number" placeholder="Distance(k/m)" ref={distanceRef} />
            </div>
         </FormGroup>
         <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
                <i className="ri-group-line"></i>
            </span>
            <div>
              <h6>Max people</h6>
              <input type="number" placeholder="0" ref={maxGroupSizeRef} />
            </div>
         </FormGroup>
         <span className="search__icon" onClick={searchHandler}>
          <i className="ri-search-line"></i>
         </span>
      </Form>
    </div>
  </Col>
    
}

export default SearchBar

