import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import * as ConfigConstants from '@constants/ConfigConstants';

function ChangeLanguage(props) {
  const { language, changeLanguage } = props;
  const [flag, setFlag] = useState('flag-icon-vi');
  const [LGChange, setLGChange] = useState('');
  useEffect(() => {
    if (language === 'EN') {
      setFlag('flag-icon-us');
    } else if (language === 'KR') {
      setFlag('flag-icon-kr');
    } else {
      setFlag('flag-icon-vi');
    }
  }, [language]);
  useEffect(() => {
    localStorage.setItem(ConfigConstants.LANG_CODE, LGChange);
  }, [LGChange]);
  return (
    <li className="nav-item dropdown">
      <span className="nav-link" data-toggle="dropdown" role="button">
        <i className={`flag-icon ${flag}`}></i>
      </span>
      <div className="dropdown-menu dropdown-menu-right p-0" id="jq-change-language">
        <span
          // href="#"
          className={`dropdown-item ${language == 'EN' ? 'active' : ''}`}
          onClick={(e) => {
            changeLanguage('EN');
            setLGChange('EN');
          }}
          role="button"
        >
          <i className="flag-icon flag-icon-us mr-2"></i> English
        </span>
        <span
          // href="#"
          className={`dropdown-item ${language == 'VI' ? 'active' : ''}`}
          onClick={(e) => {
            changeLanguage('VI');
            setLGChange('VI');
          }}
          role="button"
        >
          <i className="flag-icon flag-icon-vi mr-2"></i> Tiếng Việt
        </span>
        <span
          // href="#"
          className={`dropdown-item ${language == 'KR' ? 'active' : ''}`}
          onClick={(e) => {
            changeLanguage('KR');
            setLGChange('KR');
          }}
          role="button"
        >
          <i className="flag-icon flag-icon-kr mr-2"></i> 한국어
        </span>
      </div>
    </li>
  );
}

export default ChangeLanguage;
