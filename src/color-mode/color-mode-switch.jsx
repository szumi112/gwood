import { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useColorMode } from "@chakra-ui/react";
import "./switch.css";

const ColorModeSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toggleColorMode } = useColorMode();

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
    setTimeout(() => {
      toggleColorMode();
    }, 300);
  };

  return (
    <label className={`color-mode-switch ${!isDarkMode ? "dark" : "light"}`}>
      <input
        type="checkbox"
        checked={!isDarkMode}
        onChange={handleToggle}
        className="hidden-input"
      />
      <div className="slider round">{!isDarkMode ? <FiMoon /> : <FiSun />}</div>
    </label>
  );
};

export default ColorModeSwitch;
