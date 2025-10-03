#!/usr/bin/env python3
"""
Detailed simulation of how each device increments visitor count
This simulates the exact frontend behavior for multiple devices
"""

import sqlite3
from pathlib import Path
import json

DB_PATH = Path("counter.db")

def get_db_count():
    """Get current database count"""
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
    """Simulate GET /current endpoint - reads current count"""
    return get_db_count()

def simulate_device_visit(device_name, has_existing_session=False):
    """
    Simulate a device visiting the website
    
    Args:
        device_name: Name of the device for logging
        has_existing_session: Whether this device already has a session marker
    """
    print(f"\n🔄 === {device_name} visits website ===")
    
    # Step 1: Check for existing session (simulates sessionStorage check)
    is_new_session = not has_existing_session
    print(f"📋 Session check: {'New session' if is_new_session else 'Existing session'}")
    
    try:
        if is_new_session:
            # Step 2A: New session - call /hit endpoint (increments counter)
            print(f"✅ {device_name}: New session detected! Calling API to increment counter...")
            count = api_hit()
            print(f"📈 {device_name}: API response - New visitor count: {count}")
            
            # Step 3: Mark session as active (simulates sessionStorage.setItem)
            print(f"💾 {device_name}: Session marked as 'active' in sessionStorage")
            
            # Google Analytics event (in real frontend)
            print(f"📊 {device_name}: Google Analytics event sent with value: {count}")
            
        else:
            # Step 2B: Existing session - call /current endpoint (doesn't increment)
            print(f"🔄 {device_name}: Existing session, fetching current count...")
            count = api_current()
            print(f"📊 {device_name}: Current count from API: {count}")
        
        # Step 4: Display result to user
        ordinal = get_ordinal(count)
        message = f"You are the {ordinal} visitor, welcome!"
        print(f"👤 {device_name} sees: \"{message}\"")
        
        return count, is_new_session
        
    except Exception as err:
        # Step 5: Fallback to localStorage if API fails
        print(f"❌ {device_name}: API request failed: {err}")
        print(f"💾 {device_name}: Falling back to localStorage...")
        
        # Simulate localStorage fallback (device-specific counting)
        local_count = 1 if is_new_session else 1
        print(f"💾 {device_name}: Using localStorage fallback, count: {local_count}")
        return local_count, is_new_session

def get_ordinal(value):
    """Convert number to ordinal (1st, 2nd, 3rd, etc.)"""
    mod10 = value % 10
    mod100 = value % 100
    if mod10 == 1 and mod100 != 11:
        return f"{value}st"
    elif mod10 == 2 and mod100 != 12:
        return f"{value}nd"
    elif mod10 == 3 and mod100 != 13:
        return f"{value}rd"
    else:
        return f"{value}th"

def main():
    print("📱 DETAILED DEVICE-BY-DEVICE VISITOR COUNT FLOW")
    print("=" * 60)
    
    # Check initial state
    initial_count = get_db_count()
    print(f"\n🏁 Initial database count: {initial_count}")
    
    print(f"\n🌐 SIMULATION: Multiple devices visiting website")
    print("Each device has separate sessionStorage but uses same global database")
    
    # Device 1: First visit (new session)
    device1_count, device1_new = simulate_device_visit("iPhone Safari", has_existing_session=False)
    db_after_device1 = get_db_count()
    
    # Device 2: First visit (new session) 
    device2_count, device2_new = simulate_device_visit("MacBook Chrome", has_existing_session=False)
    db_after_device2 = get_db_count()
    
    # Device 1: Refresh page (existing session)
    device1_refresh, device1_refresh_new = simulate_device_visit("iPhone Safari", has_existing_session=True)
    db_after_refresh = get_db_count()
    
    # Device 3: New device (new session)
    device3_count, device3_new = simulate_device_visit("Windows Edge", has_existing_session=False)
    db_after_device3 = get_db_count()
    
    # Device 2: Refresh page (existing session)
    device2_refresh, device2_refresh_new = simulate_device_visit("MacBook Chrome", has_existing_session=True)
    final_count = get_db_count()
    
    # Summary
    print(f"\n📊 SUMMARY OF VISITOR COUNT INCREMENTS:")
    print("-" * 50)
    print(f"Initial count:           {initial_count}")
    print(f"iPhone Safari (1st):     {device1_count} {'(+1)' if device1_new else '(+0)'}")
    print(f"MacBook Chrome (1st):    {device2_count} {'(+1)' if device2_new else '(+0)'}")
    print(f"iPhone Safari (refresh): {device1_refresh} {'(+1)' if device1_refresh_new else '(+0)'}")
    print(f"Windows Edge (1st):      {device3_count} {'(+1)' if device3_new else '(+0)'}")
    print(f"MacBook Chrome (refresh):{device2_refresh} {'(+1)' if device2_refresh_new else '(+0)'}")
    print(f"Final count:             {final_count}")
    print(f"Total increments:        +{final_count - initial_count}")
    
    print(f"\n✅ KEY INSIGHTS:")
    print(f"• Each NEW device session increments global counter by 1")
    print(f"• Each EXISTING device session reads current count (no increment)")
    print(f"• Global database is shared across ALL devices")
    print(f"• sessionStorage prevents same device from incrementing multiple times")
    print(f"• Different devices = different sessionStorage = can each increment once")

if __name__ == "__main__":
    main()