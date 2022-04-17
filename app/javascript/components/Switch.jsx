import React from 'react';
import {ToggleSwitch, useTheme} from '@primer/react';
import ReactDOM from "react-dom";

const Switch = () => {
  const {setColorMode} = useTheme()

  const storedColorMode = localStorage.getItem('WHOIS_mode');

  const [isOn, setIsOn] = React.useState(storedColorMode === 'night')
  const onClick = () => {
    setIsOn(!isOn);
  }
  const handleSwitchChange = on => {
    if (isOn) {
      localStorage.setItem('WHOIS_mode', 'night');
      return setColorMode('night');
    }
    localStorage.setItem('WHOIS_mode', 'day');
    setColorMode('day');
  }

  return (
    <ToggleSwitch onClick={onClick} onChange={handleSwitchChange} checked={isOn} aria-labelledby="switchLabel" />
  );
}

export default Switch;