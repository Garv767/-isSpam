import pandas as pd

# Use the full path to your files, replacing 'path/to/your/file.csv'
# with the actual location.
df1 = pd.read_csv('c:\\Users\\DELL\\Cooking\\!isSpam\\api\\data\\mail_data.csv')
df2 = pd.read_csv('c:\\Users\\DELL\\Cooking\\!isSpam\\api\\data\\spam_ham_dataset.csv')

# Use a raw string by adding 'r' before the path to handle backslashes correctly
# df1 = pd.read_csv(r'c:\Users\DELL\Cooking\!isSpam\api\data\mail_data.csv')

# Step 2: Rename columns and select relevant ones for df2
df2_renamed = df2.rename(columns={'label': 'Category', 'text': 'Message'})
df2_renamed = df2_renamed[['Category', 'Message']]

# Step 3: Concatenate the two dataframes
merged_df = pd.concat([df1, df2_renamed], ignore_index=True)

# Print the final merged DataFrame
print(merged_df)

# Optional: Save the result to a new CSV file
merged_df.to_csv('merged_output.csv', index=False)
