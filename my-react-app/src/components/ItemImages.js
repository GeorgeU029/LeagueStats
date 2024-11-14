import React from 'react';
import { Avatar, Box } from '@mui/material';

function ItemImages({ items, version }) {
  return (
    <Box display="flex" gap={0.5}>
      {items.filter((itemId) => itemId > 0).map((itemId, index) => (
        <Avatar
          key={`item-${itemId}-${index}`}
          src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`}
          alt={`Item ${itemId}`}
          sx={{ width: 24, height: 24, mr: 0.5, borderRadius: '4px', bgcolor: '#2d3748' }}
          variant="rounded"
        />
      ))}
    </Box>
  );
}

export default ItemImages;
