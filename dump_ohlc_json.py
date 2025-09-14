# dump_ohlc_json.py
from __future__ import annotations
import os, sys, json, argparse
from pathlib import Path
import pandas as pd
from io import StringIO

# --- Pre-parse --data-dir and --repo to ensure config is set BEFORE imports ---
def _preparse(argv):
    p = argparse.ArgumentParser(add_help=False)
    p.add_argument("--data-dir")
    p.add_argument("--repo", default=".")
    p.add_argument("--online", action="store_true")
    args, _ = p.parse_known_args(argv)
    return args

_pre = _preparse(sys.argv[1:])
REPO_ROOT = Path(_pre.repo).resolve()

# Put repo on sys.path so we can import tradingagents.*
sys.path.insert(0, str(REPO_ROOT))

# If a data dir was provided, try to prime config BEFORE importing interface
DATA_DIR_OVERRIDE = None
if _pre.data_dir:
    DATA_DIR_OVERRIDE = Path(_pre.data_dir).resolve()

# Best-effort: set config & globals BEFORE interface import
try:
    from tradingagents.dataflows import config as _cfg  # type: ignore
    if DATA_DIR_OVERRIDE is not None:
        # Try all reasonable knobs, but do NOT rely on kwargs signature
        try:
            _cfg.set_config({"DATA_DIR": str(DATA_DIR_OVERRIDE)})
        except Exception:
            pass
        try:
            _cfg.DATA_DIR = str(DATA_DIR_OVERRIDE)
        except Exception:
            pass
except Exception:
    pass

# Now import interface functions
from tradingagents.dataflows.interface import get_YFin_data, get_YFin_data_online  # type: ignore

def _to_lw_records(df: pd.DataFrame):
    # Normalize columns
    rename_map = {c: c.strip().title() for c in df.columns}
    df = df.rename(columns=rename_map)

    # Dates -> YYYY-MM-DD
    if "Date" in df.columns:
        df["Date"] = pd.to_datetime(df["Date"]).dt.strftime("%Y-%m-%d")
    df = df.sort_values("Date").reset_index(drop=True)

    # Build Lightweight Charts-compatible records
    recs = []
    for _, r in df.iterrows():
        recs.append({
            "time":  r["Date"],
            "open":  float(r["Open"]),
            "high":  float(r["High"]),
            "low":   float(r["Low"]),
            "close": float(r["Close"]),
            "volume": float(r["Volume"]) if "Volume" in r else 0.0,
        })
    return recs

def dump(symbol: str, start_date: str, end_date: str, outdir: Path, online: bool = False):
    symbol = symbol.upper()

    if online:
        # get_YFin_data_online returns header + CSV string; strip the commented header lines
        raw = get_YFin_data_online(symbol, start_date, end_date)
        # Keep only the CSV body (drop lines starting with '#')
        body = "\n".join([ln for ln in str(raw).splitlines() if not ln.strip().startswith("#") and ln.strip()])
        df = pd.read_csv(StringIO(body))
    else:
        # Reads from DATA_DIR/market_data/price_data/<symbol>-YFin-data-2015-01-01-2025-03-25.csv
        df = get_YFin_data(symbol, start_date, end_date)

    records = _to_lw_records(df)

    outdir.mkdir(parents=True, exist_ok=True)
    outpath = outdir / f"{symbol}_ohlc.json"
    with open(outpath, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False)
    print(f"Wrote: {outpath}  ({len(records)} candles)")

def main():
    ap = argparse.ArgumentParser(description="Dump OHLC candles to frontend/public/data for the chart")
    ap.add_argument("--symbol", required=True)
    ap.add_argument("--start", required=True, help="YYYY-MM-DD")
    ap.add_argument("--end",   required=True, help="YYYY-MM-DD")
    ap.add_argument("--repo",  default=".", help="Repo root (if not running from root)")
    ap.add_argument("--data-dir", help="Base folder that contains market_data/price_data (optional)")
    ap.add_argument("--online", action="store_true", help="Fetch via yfinance instead of local CSVs")
    args = ap.parse_args()

    repo_root = Path(args.repo).resolve()
    outdir = repo_root / "frontend" / "public" / "data"

    dump(args.symbol, args.start, args.end, outdir, online=args.online)

if __name__ == "__main__":
    main()
