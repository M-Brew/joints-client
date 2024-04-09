import React from "react";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ImageWithFallback from "../custom/ImageWithFallback";

export default function Meal(props: IMeal) {
  const { meal } = props;

  return (
    <Card sx={{ borderRadius: 5, padding: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Box
            sx={{
              display: "block",
              position: "relative",
              height: "100px",
            }}
          >
            <ImageWithFallback
              alt="meal-image"
              src={
                "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=2761&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              sizes="(min-width: 1024px) 30vw, (min-width: 425px) 45vw, 100vw"
              style={{
                borderRadius: 5,
                objectFit: "cover",
              }}
              fallbackSrc="https://images.unsplash.com/photo-1541140134513-85a161dc4a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography>{meal.name}</Typography>
          <Typography fontSize={14} sx={{ opacity: 0.5 }}>
            {meal.description}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            {meal.currency === "cedi" ? "GHC" : ""} {meal.price.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

interface IMeal {
  meal: IMealData;
}
