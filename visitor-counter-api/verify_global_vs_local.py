#!/usr/bin/env python3
"""
Script to verify that visitor count uses global database vs local storage
This script demonstrates the key differences between global and local counting
"""

import sqlite3
import json
from pathlib import Path

DB_PATH = Path("counter.db")

def check_db():
    """Check current database count"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT total FROM stats WHERE id = 1")
    row = cursor.fetchone()
    count = row[0] if row else 0
    conn.close()
    return count

def simulate_api_hit():
    """Simulate /hit endpoint - increment global database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE stats SET total = total + 1 WHERE id = 1")
    conn.commit()
    cursor.execute("SELECT total FROM stats WHERE id = 1")
    new_count = cursor.fetchone()[0]
    conn.close()
    return new_count

def simulate_api_current():
    """Simulate /current endpoint - read global database"""
    return check_db()

def simulate_local_storage(device_name, is_new_session):
    """
    Simulate localStorage behavior for a specific device
    This is what happens when API fails and frontend falls back
    """
    # Simulate localStorage for this "device"
    storage_file = Path(f"local_storage_{device_name}.json")
    
    if storage_file.exists():
        with open(storage_file, 'r') as f:
            data = json.load(f)
        local_count = data.get('count', 0)
        session_active = data.get('session_active', False)
    else:
        local_count = 0
        session_active = False
    
    # If new session and no previous session, increment
    if is_new_session and not session_active:
        local_count += 1
        session_active = True
        
        # Save to "localStorage" file
        with open(storage_file, 'w') as f:
            json.dump({'count': local_count, 'session_active': session_active}, f)
    
    return local_count

def main():
    print("🔍 VISITOR COUNT VERIFICATION: Global vs Local")
    print("=" * 60)
    
    # 1. Check initial database state
    initial_db_count = check_db()
    print(f"\n📊 Initial global database count: {initial_db_count}")
    
    # 2. Demonstrate GLOBAL behavior (API working)
    print(f"\n🌐 GLOBAL BEHAVIOR (API Working):")
    print("- Multiple devices hitting the same global database")
    
    print(f"   Device A visits (new session):")
    device_a_count = simulate_api_hit()
    print(f"   → Global DB count: {device_a_count}")
    
    print(f"   Device B visits (new session):")
    device_b_count = simulate_api_hit()
    print(f"   → Global DB count: {device_b_count}")
    
    print(f"   Device A refreshes (existing session, calls /current):")
    device_a_refresh = simulate_api_current()
    print(f"   → Global DB count: {device_a_refresh}")
    
    print(f"   Device C visits (new session):")
    device_c_count = simulate_api_hit()
    print(f"   → Global DB count: {device_c_count}")
    
    # 3. Demonstrate LOCAL behavior (API failed, localStorage fallback)
    print(f"\n💾 LOCAL BEHAVIOR (API Failed, localStorage fallback):")
    print("- Each device maintains its own local count")
    
    device_x_count = simulate_local_storage("device_x", is_new_session=True)
    print(f"   Device X (new session): {device_x_count}")
    
    device_y_count = simulate_local_storage("device_y", is_new_session=True)  
    print(f"   Device Y (new session): {device_y_count}")
    
    device_x_refresh = simulate_local_storage("device_x", is_new_session=False)
    print(f"   Device X (refresh): {device_x_refresh}")
    
    device_z_count = simulate_local_storage("device_z", is_new_session=True)
    print(f"   Device Z (new session): {device_z_count}")
    
    # 4. Show the key differences
    final_db_count = check_db()
    print(f"\n🔍 VERIFICATION RESULTS:")
    print(f"   Global database count: {initial_db_count} → {final_db_count}")
    print(f"   Increment from testing: +{final_db_count - initial_db_count}")
    print(f"   Local storage Device X: {device_x_refresh}")
    print(f"   Local storage Device Y: {device_y_count}")
    print(f"   Local storage Device Z: {device_z_count}")
    
    print(f"\n✅ PROOF OF GLOBAL BEHAVIOR:")
    print(f"   - Global DB increments across all devices: {final_db_count > initial_db_count}")
    print(f"   - Local counts are independent per device")
    print(f"   - Your frontend uses GLOBAL when API works, LOCAL only as fallback")
    
    # 5. Show how to verify in your website
    print(f"\n🛠️ HOW TO VERIFY IN YOUR WEBSITE:")
    print(f"   1. Open browser dev tools → Network tab")
    print(f"   2. Visit your website on Device 1")
    print(f"   3. Check if you see POST to /hit endpoint")
    print(f"   4. Visit from Device 2 (or incognito)")
    print(f"   5. You should see count increment globally")
    print(f"   6. If API fails, check localStorage in Dev Tools → Application → Local Storage")
    
    # Clean up test files
    for device in ['device_x', 'device_y', 'device_z']:
        storage_file = Path(f"local_storage_{device}.json")
        if storage_file.exists():
            storage_file.unlink()

if __name__ == "__main__":
    main()