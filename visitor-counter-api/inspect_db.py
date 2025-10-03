#!/usr/bin/env python3
"""
Script to inspect the counter.db SQLite database
"""

import sqlite3
import os
from pathlib import Path

def inspect_database(db_path):
    """Inspect SQLite database and display comprehensive information"""
    
    if not os.path.exists(db_path):
        print(f"❌ Database file not found: {db_path}")
        return
    
    print(f"🔍 Inspecting SQLite Database: {db_path}")
    print("=" * 60)
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get database info
        print("\n📊 DATABASE INFORMATION")
        print("-" * 30)
        
        # Get file size
        file_size = os.path.getsize(db_path)
        print(f"File Size: {file_size} bytes ({file_size/1024:.2f} KB)")
        
        # Get SQLite version
        cursor.execute("SELECT sqlite_version()")
        sqlite_version = cursor.fetchone()[0]
        print(f"SQLite Version: {sqlite_version}")
        
        # Get all tables
        print("\n📋 TABLES")
        print("-" * 30)
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        if not tables:
            print("No tables found in database")
            return
        
        for (table_name,) in tables:
            print(f"\n🏷️  Table: {table_name}")
            
            # Get table schema
            cursor.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{table_name}'")
            schema = cursor.fetchone()[0]
            print(f"Schema: {schema}")
            
            # Get column info
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            print("\nColumns:")
            for col in columns:
                cid, name, data_type, not_null, default_value, pk = col
                pk_text = " (PRIMARY KEY)" if pk else ""
                not_null_text = " NOT NULL" if not_null else ""
                default_text = f" DEFAULT {default_value}" if default_value is not None else ""
                print(f"  - {name}: {data_type}{not_null_text}{default_text}{pk_text}")
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            row_count = cursor.fetchone()[0]
            print(f"Row Count: {row_count}")
            
            # Show all data if row count is reasonable
            if row_count > 0 and row_count <= 100:
                print(f"\n📝 Data in {table_name}:")
                cursor.execute(f"SELECT * FROM {table_name}")
                rows = cursor.fetchall()
                
                # Get column names for header
                column_names = [description[0] for description in cursor.description]
                print(f"{'  |  '.join(column_names)}")
                print("-" * (len('  |  '.join(column_names)) + 10))
                
                for row in rows:
                    print(f"{'  |  '.join(str(cell) for cell in row)}")
            elif row_count > 100:
                print(f"\n📝 Sample data from {table_name} (first 10 rows):")
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 10")
                rows = cursor.fetchall()
                
                column_names = [description[0] for description in cursor.description]
                print(f"{'  |  '.join(column_names)}")
                print("-" * (len('  |  '.join(column_names)) + 10))
                
                for row in rows:
                    print(f"{'  |  '.join(str(cell) for cell in row)}")
                print(f"... and {row_count - 10} more rows")
        
        # Get indexes
        print(f"\n🔗 INDEXES")
        print("-" * 30)
        cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL")
        indexes = cursor.fetchall()
        
        if indexes:
            for name, sql in indexes:
                print(f"Index: {name}")
                print(f"SQL: {sql}")
        else:
            print("No custom indexes found")
        
        # Get triggers
        print(f"\n⚡ TRIGGERS")
        print("-" * 30)
        cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='trigger'")
        triggers = cursor.fetchall()
        
        if triggers:
            for name, sql in triggers:
                print(f"Trigger: {name}")
                print(f"SQL: {sql}")
        else:
            print("No triggers found")
        
        # Get views
        print(f"\n👁️  VIEWS")
        print("-" * 30)
        cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='view'")
        views = cursor.fetchall()
        
        if views:
            for name, sql in views:
                print(f"View: {name}")
                print(f"SQL: {sql}")
        else:
            print("No views found")
            
        conn.close()
        print(f"\n✅ Database inspection complete!")
        
    except sqlite3.Error as e:
        print(f"❌ SQLite error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Main function"""
    # Path to the database
    db_path = Path(__file__).parent / "counter.db"
    
    print("🗄️  SQLite Database Inspector")
    print("=" * 60)
    
    inspect_database(db_path)

if __name__ == "__main__":
    main()