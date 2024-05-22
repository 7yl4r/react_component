import React, { useEffect, useState } from 'react';
import './CfParameterField.css';

export interface CfParameterFieldProps {
   label: string;
}

const cf_standard = require('../../vocabulary_json/cf_standard.json');

const CfParameterField = (props: CfParameterFieldProps) => {

   const [value, setValue] = useState('');
   const [showSuggestions, setShowSuggestions] = useState(false);
   const suggestions = cf_standard.filter( name => name.standard_name.includes(value));

   useEffect(() => {

      if (value == '') {
         setShowSuggestions(false);
      } else {
         setShowSuggestions(true);
      }

   }, [value]);

   const suggest = event => {
      setValue(event.target.value);
   };

   const selectName = event => { 
      console.log(event.target.innerHTML);
      setValue(event.target.innerHTML);
      setShowSuggestions(false);
   };

   return (
      <div className="cf_standard_name">
         <span>CF Standard Name:</span>
         <input
            type="text"
            value={value}
            onChange={suggest}
         />
         {showSuggestions && (
            <ul className="suggestions">
               {suggestions.map(suggestion => (
                  <li onClick={selectName} key={suggestion.standard_name}>{suggestion.standard_name}</li>
               ))}
            </ul>
         )}
      </div>
   )
}

export default CfParameterField;