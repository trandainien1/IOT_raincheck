import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

const CustomSlider = ({ marks, saveData, fetchData, max, min }) => {
  const [defaultValue, setDefaultValue] = useState(3);

  useEffect(() => {
    const unsubscribe = fetchData(setDefaultValue);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <Box sx={{ width: 300 }}>
        <Slider
          value={defaultValue}
          aria-label="Default"
          valueLabelDisplay="auto"
          min={min}
          max={max}
          marks={marks}
          onChange={(e, new_value) => {
            saveData(new_value);
            setDefaultValue(new_value);
          }}
          sx={{
            width: "240px",
          }}
        />
      </Box>
    </div>
  );
};

export default CustomSlider;
