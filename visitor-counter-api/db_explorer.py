#!/usr/bin/env python3
"""
Interactive SQLite Database Explorer
Allows you to run custom SQL queries on the counter.db database
"""

import sqlite3
import sys
from pathlib import Path

def run_query(db_path, query):
    """Execute a SQL query and display results"""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Execute the query
        cursor.execute(query)
        
        # Handle different types of queries
        if query.strip().upper().startswith(('SELECT', 'PRAGMA')):
            # For SELECT queries, fetch and display results
            results = cursor.fetchall()
            
            if results:
                # Get column names
                column_names = [description[0] for description in cursor.description]
                
                # Display header
                print(f"{'  |  '.join(column_names)}")
                print("-" * (len('  |  '.join(column_names)) + 10))
                
                # Display rows
                for row in results:
                    print(f"{'  |  '.join(str(cell) for cell in row)}")
                
                print(f"\n({len(results)} row{'s' if len(results) != 1 else ''} returned)")
            else:
                print("No results returned")
        else:
            # For INSERT, UPDATE, DELETE, etc.
            conn.commit()
            print(f"Query executed successfully. {cursor.rowcount} row(s) affected.")
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"❌ SQLite error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")

def interactive_mode(db_path):
    """Run in interactive mode"""
    print("🗄️  Interactive SQLite Database Explorer")
    print("=" * 50)
    print(f"Database: {db_path}")
    print("\nCommon commands:")
    print("  SELECT * FROM stats;              - View all data")
    print("  .schema                          - Show table schemas")
    print("  .tables                          - List all tables")
    print("  UPDATE stats SET total = 0;      - Reset counter")
    print("  SELECT COUNT(*) FROM stats;      - Count rows")
    print("  quit or exit                     - Exit the program")
    print("-" * 50)
    
    while True:
        try:
            query = input("\nSQL> ").strip()
            
            if not query:
                continue
                
            if query.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            
            # Handle special dot commands
            if query.startswith('.'):
                if query == '.schema':
                    run_query(db_path, "SELECT sql FROM sqlite_master WHERE type='table'")
                elif query == '.tables':
                    run_query(db_path, "SELECT name FROM sqlite_master WHERE type='table'")
                else:
                    print(f"Unknown command: {query}")
                continue
            
            # Execute the query
            run_query(db_path, query)
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except EOFError:
            print("\n👋 Goodbye!")
            break

def main():
    """Main function"""
    db_path = Path(__file__).parent / "counter.db"
    
    if not db_path.exists():
        print(f"❌ Database file not found: {db_path}")
        sys.exit(1)
    
    # Check if a query was passed as command line argument
    if len(sys.argv) > 1:
        query = ' '.join(sys.argv[1:])
        print(f"Executing: {query}")
        print("-" * 30)
        run_query(db_path, query)
    else:
        interactive_mode(db_path)

if __name__ == "__main__":
    main()