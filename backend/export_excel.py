import psycopg2
import pandas as pd
import json

conn = psycopg2.connect("dbname='loaner_db' user='postgres' password='majorproject' host='localhost'")
cursor = conn.cursor()
cursor.execute("SELECT id, borrower_name, loan_amnt, term, timestamp, ai_results FROM loan_applications ORDER BY timestamp DESC")
rows = cursor.fetchall()
columns = [desc[0] for desc in cursor.description]

df = pd.DataFrame(rows, columns=columns)

if not df.empty and 'ai_results' in df.columns:
    ai_df = pd.json_normalize(df['ai_results'])
    df = pd.concat([df.drop('ai_results', axis=1), ai_df], axis=1)

export_path = r"d:\Coding\Projects\Loaner Frontend\Loan_Database_Export.csv"
df.to_csv(export_path, index=False)
print("SUCCESS: Exported", len(df), "records to", export_path)
