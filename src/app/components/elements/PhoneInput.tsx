import PhoneInput, { CountryData } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import React, { useState } from 'react';
import './style.css'

type OnPhoneData = any;

export default function CustomPhoneInput({ onPhoneData }: { onPhoneData: OnPhoneData }) {

  const handleChange = (value: string, data: CountryData, formattedValue: string) => {
    const country = '+' + data.dialCode.toString();
    const number = value;

    // Remove the country code from the phone number
    const phoneNumberWithoutCountryCode = value.slice(data.dialCode.length);
    // console.log('phoneNumberWithoutCountryCode', phoneNumberWithoutCountryCode);
    // console.log('country', country);
    // Call the callback function with countryCode and phoneNumberWithoutCountryCode
    onPhoneData(country, phoneNumberWithoutCountryCode);
  };

  return (
    <div>
      <PhoneInput
        placeholder='Enter phone number'
        country={'in'}
        value={''}
        onChange={(value:string, data:{} | CountryData, _ ,  formattedValue: string) => {handleChange(value,data as CountryData, formattedValue)}}
        inputProps={{
          required: true,
        }}
        // onClick={(e, data)=> {
        //   console.log('data', data);
        //   setCountryCode("+"+ data.dialCode.toString());
        //   // onPhoneData(data.countryCode, data.dialCode + data.value);
        // }}
        containerClass='phone-input-container'
        inputClass='phone-input'
        searchClass='phone-input-search'
        dropdownClass='phone-input-dropdown'
        buttonClass='phone-input-button'
      />
    </div>
  )
}
