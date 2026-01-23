#!/usr/bin/env python3
"""
Offline batch generator for historical similarity K-line charts.
Reads data/similarity_cases.json and generates static PNG charts for each case.
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: requests library not found. Install with: pip install requests")
    sys.exit(1)

try:
    import matplotlib
    matplotlib.use('Agg')  # Non-interactive backend
    import matplotlib.pyplot as plt
    from matplotlib.patches import Rectangle
    import matplotlib.dates as mdates
except ImportError:
    print("Error: matplotlib library not found. Install with: pip install matplotlib")
    sys.exit(1)


class BinanceKlineGenerator:
    """Generator for BTCUSDT K-line charts from Binance public API."""

    BINANCE_API = "https://api.binance.com/api/v3/klines"
    SYMBOL = "BTCUSDT"
    INTERVAL = "1d"
    DAYS_BEFORE = 30
    DAYS_AFTER = 180
    IMAGE_WIDTH = 12
    IMAGE_HEIGHT = 6.5
    DPI = 100

    def __init__(self, data_file, output_dir):
        self.data_file = Path(data_file)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def load_cases(self):
        """Load similarity cases from JSON file."""
        with open(self.data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data.get('cases', [])

    def fetch_klines(self, start_date, end_date):
        """Fetch daily K-line data from Binance API."""
        start_ts = int(start_date.timestamp() * 1000)
        end_ts = int(end_date.timestamp() * 1000)

        params = {
            'symbol': self.SYMBOL,
            'interval': self.INTERVAL,
            'startTime': start_ts,
            'endTime': end_ts,
            'limit': 1000
        }

        try:
            response = requests.get(self.BINANCE_API, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"  ⚠️  API request failed: {e}")
            return None

    def parse_klines(self, klines):
        """Parse Binance K-line data into OHLCV format."""
        if not klines:
            return None

        dates = []
        opens = []
        highs = []
        lows = []
        closes = []

        for k in klines:
            timestamp = k[0] / 1000
            dates.append(datetime.fromtimestamp(timestamp))
            opens.append(float(k[1]))
            highs.append(float(k[2]))
            lows.append(float(k[3]))
            closes.append(float(k[4]))

        return {
            'dates': dates,
            'opens': opens,
            'highs': highs,
            'lows': lows,
            'closes': closes
        }

    def plot_candlestick(self, data, t0_date, case_name, output_path):
        """Generate candlestick chart with T0 vertical line."""
        fig, ax = plt.subplots(figsize=(self.IMAGE_WIDTH, self.IMAGE_HEIGHT), dpi=self.DPI)

        dates = data['dates']
        opens = data['opens']
        highs = data['highs']
        lows = data['lows']
        closes = data['closes']

        # Plot candlesticks
        width = 0.6
        for i in range(len(dates)):
            date = mdates.date2num(dates[i])
            open_price = opens[i]
            high_price = highs[i]
            low_price = lows[i]
            close_price = closes[i]

            # Determine color
            color = '#26a69a' if close_price >= open_price else '#ef5350'

            # Draw high-low line
            ax.plot([date, date], [low_price, high_price], color=color, linewidth=1)

            # Draw open-close rectangle
            height = abs(close_price - open_price)
            bottom = min(open_price, close_price)
            rect = Rectangle((date - width/2, bottom), width, height,
                           facecolor=color, edgecolor=color)
            ax.add_patch(rect)

        # Draw T0 vertical line
        t0_num = mdates.date2num(t0_date)
        ax.axvline(x=t0_num, color='#ff9800', linewidth=2, linestyle='--',
                  label=f'T0: {t0_date.strftime("%Y-%m-%d")}', alpha=0.8)

        # Format x-axis
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
        ax.xaxis.set_major_locator(mdates.MonthLocator())
        plt.xticks(rotation=45, ha='right')

        # Labels and title
        ax.set_xlabel('Date', fontsize=10)
        ax.set_ylabel('Price (USDT)', fontsize=10)
        ax.set_title(f'{case_name} - BTCUSDT Daily K-line', fontsize=12, fontweight='bold')
        ax.legend(loc='upper left', fontsize=9)
        ax.grid(True, alpha=0.3, linestyle='--')

        # Style
        ax.set_facecolor('#1a1a1a')
        fig.patch.set_facecolor('#0a0a0a')
        ax.tick_params(colors='#cccccc', labelsize=9)
        ax.xaxis.label.set_color('#cccccc')
        ax.yaxis.label.set_color('#cccccc')
        ax.title.set_color('#ffffff')
        ax.spines['bottom'].set_color('#444444')
        ax.spines['top'].set_color('#444444')
        ax.spines['left'].set_color('#444444')
        ax.spines['right'].set_color('#444444')

        plt.tight_layout()
        plt.savefig(output_path, dpi=self.DPI, facecolor=fig.get_facecolor())
        plt.close()

    def generate_chart(self, case):
        """Generate chart for a single case."""
        case_id = case['id']
        case_name = case['name']
        date_str = case['date']

        print(f"Processing: {case_id} ({case_name}) - {date_str}")

        try:
            t0_date = datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError as e:
            print(f"  ❌ Invalid date format: {e}")
            return None

        # Calculate date range: T0-30 to T0+180
        start_date = t0_date - timedelta(days=self.DAYS_BEFORE)
        end_date = t0_date + timedelta(days=self.DAYS_AFTER)

        # Fetch K-line data
        klines = self.fetch_klines(start_date, end_date)
        if not klines:
            print(f"  ❌ Failed to fetch data")
            return None

        # Parse data
        data = self.parse_klines(klines)
        if not data or len(data['dates']) < 10:
            print(f"  ❌ Insufficient data: only {len(data['dates']) if data else 0} days")
            return None

        # Generate chart
        output_path = self.output_dir / f"{case_id}.png"
        self.plot_candlestick(data, t0_date, case_name, output_path)

        print(f"  ✅ Generated: {output_path}")

        return {
            'id': case_id,
            'date': date_str,
            'symbol': self.SYMBOL,
            'chart_url': f'/sim_charts/{case_id}.png'
        }

    def generate_all(self):
        """Generate charts for all cases and create index.json."""
        cases = self.load_cases()
        print(f"\nFound {len(cases)} cases to process\n")

        index = []
        success_count = 0

        for case in cases:
            result = self.generate_chart(case)
            if result:
                index.append(result)
                success_count += 1
            print()

        # Save index.json
        index_path = self.output_dir / 'index.json'
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump(index, f, indent=2, ensure_ascii=False)

        print(f"{'='*60}")
        print(f"Summary:")
        print(f"  Total cases: {len(cases)}")
        print(f"  Successful: {success_count}")
        print(f"  Failed: {len(cases) - success_count}")
        print(f"  Index file: {index_path}")
        print(f"{'='*60}\n")


def main():
    """Main entry point."""
    # Paths
    project_root = Path(__file__).parent.parent
    data_file = project_root / 'data' / 'similarity_cases.json'
    output_dir = project_root / 'qsx-web' / 'public' / 'sim_charts'

    # Check if data file exists
    if not data_file.exists():
        print(f"Error: Data file not found: {data_file}")
        sys.exit(1)

    # Generate charts
    generator = BinanceKlineGenerator(data_file, output_dir)
    generator.generate_all()


if __name__ == '__main__':
    main()
