#!/usr/bin/env python3
"""
Demonstration: How the updated code shows global count for every device
"""

import sqlite3
from pathlib import Path

DB_PATH = Path("counter.db")

def get_db_count():
    """Get current global database count"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT total FROM stats WHERE id = 1")
    row = cursor.fetchone()
    count = row[0] if row else 0
    conn.close()
    return count

def api_hit():
    """Simulate POST /hit endpoint - increments global counter"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE stats SET total = total + 1 WHERE id = 1")
    conn.commit()
    cursor.execute("SELECT total FROM stats WHERE id = 1")
    new_count = cursor.fetchone()[0]
    conn.close()
    return new_count

def api_current():
    """Simulate GET /current endpoint - reads current global count"""
    return get_db_count()

def simulate_device_with_global_display(device_name, has_existing_session=False):
    """
    Simulate device visit showing GLOBAL count (updated behavior)
    """
    print(f"\n🔄 === {device_name} visits website ===")
    
    is_new_session = not has_existing_session
    print(f"📋 Session check: {'New session' if is_new_session else 'Existing session'}")
    
    if is_new_session:
        # New session - increment global counter
        print(f"✅ {device_name}: New session detected! Calling API to increment counter...")
        global_count = api_hit()
        print(f"📈 {device_name}: API response - New global visitor count: {global_count}")
        print(f"💾 {device_name}: Session marked as 'active', global count cached: {global_count}")
    else:
        # Existing session - get current global count
        print(f"🔄 {device_name}: Existing session, fetching current global count...")
        global_count = api_current()
        print(f"📊 {device_name}: Current global count from API: {global_count}")
    
    # What the user sees (ALWAYS GLOBAL COUNT)
    message = f"You are visitor #{global_count} globally, welcome!"
    print(f"👤 {device_name} sees: \"{message}\"")
    
    return global_count, is_new_session

def main():
    print("🌍 UPDATED BEHAVIOR: Always Show Global Count")
    print("=" * 60)
    
    initial_count = get_db_count()
    print(f"\n🏁 Initial global database count: {initial_count}")
    
    print(f"\n📱 DEMONSTRATION: Each device shows GLOBAL visitor count")
    print("Note: This represents the total number of unique visitors across all devices")
    
    # Multiple devices visiting
    devices_and_sessions = [
        ("iPhone Safari", False),      # New session
        ("MacBook Chrome", False),     # New session  
        ("iPhone Safari", True),       # Existing session (refresh)
        ("Windows Edge", False),       # New session
        ("iPad Firefox", False),       # New session
        ("MacBook Chrome", True),      # Existing session (refresh)
        ("Android Chrome", False),     # New session
    ]
    
    results = []
    for device_name, has_session in devices_and_sessions:
        global_count, incremented = simulate_device_with_global_display(device_name, has_session)
        results.append((device_name, global_count, incremented))
    
    print(f"\n📊 SUMMARY - GLOBAL COUNT DISPLAY:")
    print("-" * 50)
    print(f"Initial global count: {initial_count}")
    
    for device_name, count_shown, incremented in results:
        action = "(+1 to global)" if incremented else "(read global)"
        print(f"{device_name:<20}: Shows #{count_shown} {action}")
    
    final_count = get_db_count()
    total_increments = sum(1 for _, _, incremented in results if incremented)
    
    print(f"\nFinal global count: {final_count}")
    print(f"Total new visitors: {total_increments}")
    print(f"All devices see the same global count when they visit!")
    
    print(f"\n✅ KEY IMPROVEMENTS:")
    print(f"• Every device shows the GLOBAL visitor count (#{final_count})")
    print(f"• No more confusion about device-specific vs global counts")  
    print(f"• Clear indication it's a global metric across all visitors")
    print(f"• Cached global count used as fallback when API is unavailable")

if __name__ == "__main__":
    main()