# Similarity K-line Chart Generator

Offline batch tool to generate historical similarity K-line charts for all cases in `data/similarity_cases.json`.

## Features

- Fetches BTCUSDT daily K-line data from Binance public API
- Generates static PNG charts (1200x650) with T0 vertical line
- Time window: T0-30 days to T0+180 days
- Outputs to `qsx-web/public/sim_charts/`
- Creates `index.json` manifest for frontend integration
- Handles errors gracefully (skips failed cases, continues processing)

## Requirements

- Python 3.7+
- `requests` library: `pip install requests`
- `matplotlib` library: `pip install matplotlib`

## Usage

Run the generator from the project root:

```bash
python3 scripts/generate_sim_charts.py
```

Or make it executable and run directly:

```bash
chmod +x scripts/generate_sim_charts.py
./scripts/generate_sim_charts.py
```

## Output

### PNG Charts
- Location: `qsx-web/public/sim_charts/<case_id>.png`
- Size: 1200x650 pixels
- Format: PNG with dark theme
- Content: Candlestick chart with T0 vertical line (orange dashed)

### Index Manifest
- Location: `qsx-web/public/sim_charts/index.json`
- Format: JSON array with entries:
  ```json
  {
    "id": "A1_2020_03_12",
    "date": "2020-03-12",
    "symbol": "BTCUSDT",
    "chart_url": "/sim_charts/A1_2020_03_12.png"
  }
  ```

## Frontend Integration

Reference charts in your Next.js app:

```tsx
import chartIndex from '@/public/sim_charts/index.json';

// Display chart
<img src={chartIndex[0].chart_url} alt={chartIndex[0].id} />
```

## Error Handling

- If a case has insufficient data (< 10 days), it will be skipped
- If Binance API fails, the case will be skipped
- All errors are logged to stdout with case ID and reason
- The script continues processing remaining cases

## Data Source

- API: Binance Public API (`https://api.binance.com/api/v3/klines`)
- Symbol: BTCUSDT
- Interval: 1d (daily)
- No authentication required
